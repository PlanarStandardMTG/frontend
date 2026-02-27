import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrophy, FaChevronDown } from 'react-icons/fa'
import { API_BASE_URL } from '../../types/Api'
import { getAuthToken } from '../../utils/apiSecurity'
import type { Tournament } from '../../types/Tournament'
import { TournamentCard } from '../../components/Tournaments/TournamentCard'

interface Props {
  refreshTrigger?: number
  onTournamentUpdate?: () => void
}

export function UpcomingTournaments({ refreshTrigger, onTournamentUpdate }: Props) {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true)
      try {
        const token = getAuthToken()
        if (!token) {
          setIsLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/challonge/tournaments`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        })

        if (res.ok) {
          const data = await res.json()
          setTournaments(data.tournaments || [])
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTournaments()
  }, [refreshTrigger])

  const upcoming = tournaments.filter(
    (t) => t.isParticipant && (t.state === 'pending' || t.state === 'awaiting_review')
  )

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('dashboardTournamentsCollapsed')
    return stored === 'true'
  })

  const toggle = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('dashboardTournamentsCollapsed', String(next))
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={toggle}
          className="flex items-center gap-3 text-3xl md:text-4xl font-bold text-white hover:text-gray-300 transition-colors text-left"
        >
          <FaChevronDown
            className={`text-lg md:text-xl transition-transform flex-shrink-0 ${isCollapsed ? '-rotate-90' : ''}`}
          />
          Upcoming Tournaments
        </button>
        <button
          onClick={() => navigate('/tournaments')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition-colors text-sm font-semibold self-start md:self-auto"
        >
          Browse
        </button>
      </div>

      {!isCollapsed && (
        <>
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading tournaments...</div>
            </div>
          )}

          {!isLoading && upcoming.length === 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
              <FaTrophy className="text-gray-600 text-5xl mx-auto mb-4" />
              <p className="text-gray-400 mb-4">You haven't signed up for any tournaments yet</p>
              <button
                onClick={() => navigate('/tournaments')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors font-semibold"
              >
                Browse Tournaments
              </button>
            </div>
          )}

          {!isLoading && upcoming.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((t) => (
                <TournamentCard key={t.id} tournament={t} onTournamentUpdate={onTournamentUpdate} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
