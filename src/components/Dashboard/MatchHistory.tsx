import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { API_BASE_URL } from '../../types/Api'
import type { Match, MatchesResponse } from '../../types/Match'
// import type { UserDTO } from '../../types/User'
import { MatchCard } from '../Matches/MatchCard'
import { CreateMatchForm } from '../Matches/CreateMatchForm'
import { useAuth } from '../../contexts/useAuth'
import { getAuthToken } from '../../utils/apiSecurity'
import { sanitizeText } from '../../utils/security'

// Backend response shape from /api/users/${id}
// interface UserResponse {
//   username: string
//   rankedInfoId: string | null
//   elo: number
// }

// Transform backend response to a shape MatchCard can use
// function toUserDTO(response: UserResponse, id: string): UserDTO {
//   return {
//     id,
//     email: '',
//     username: response.username,
//     elo: response.elo,
//     admin: false,
//     rankedInfo: response.rankedInfoId
//       ? {
//           id: response.rankedInfoId,
//           username: response.username,
//           elo: response.elo,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           userId: id,
//           connectionId: null,
//         }
//       : undefined,
//   }
// }

interface Props {
  refreshTrigger?: number
  onMatchCompleted?: () => void
}

export function MatchHistory({ refreshTrigger, onMatchCompleted }: Props) {
  const { user: authUser, isAdmin } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [viewMode, setViewMode] = useState<'my-matches' | 'all-matches' | 'pending'>('my-matches')
  const [pagination, setPagination] = useState({ limit: 5, offset: 0, total: 0, hasMore: false })

  // collapse state persisted to localStorage, mirrors UpcomingTournaments logic
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('dashboardMatchesCollapsed')
    return stored === 'true'
  })

  const toggle = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('dashboardMatchesCollapsed', String(next))
  }

  useEffect(() => {
    const fetchMatches = async () => {
      if (!authUser && viewMode === 'my-matches') return

      setIsLoadingMatches(true)
      setError(null)

      try {
        const token = getAuthToken()
        if (!token) {
          setError('Authentication required')
          setIsLoadingMatches(false)
          return
        }

        let endpoint = `${API_BASE_URL}/api/matches`
        if (viewMode === 'my-matches') {
          endpoint = `${API_BASE_URL}/api/matches/user?limit=${pagination.limit}&offset=${pagination.offset}`
        } else if (viewMode === 'pending') {
          endpoint = `${API_BASE_URL}/api/matches?limit=${pagination.limit}&offset=${pagination.offset}&status=pending`
        } else {
          endpoint = `${API_BASE_URL}/api/matches?limit=${pagination.limit}&offset=${pagination.offset}`
        }

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(sanitizeText(data.message || 'Failed to fetch matches'))
        }

        const matchesData = data as MatchesResponse

        // Safety client-side filtering for pending view
        let filtered = matchesData.matches
        if (viewMode === 'pending') {
          filtered = filtered.filter((match) => match.completedAt === null)
        }

        console.log('Filtered matches:', filtered)

        setMatches(filtered)
        setPagination(matchesData.pagination)
      } catch (err) {
        const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'Failed to load matches'
        setError(errorMessage)
      } finally {
        setIsLoadingMatches(false)
      }
    }

    fetchMatches()
  }, [authUser, viewMode, pagination.offset, pagination.limit, refreshTrigger])

  const handleNextPage = () => setPagination((p) => ({ ...p, offset: p.offset + p.limit }))
  const handlePreviousPage = () => setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))

  const handleMatchCreated = () => {
    setShowCreateForm(false)
    setPagination((p) => ({ ...p, offset: 0 }))
  }

  return (
    <div className="mb-8">
      <button
        onClick={toggle}
        className="flex items-center gap-3 text-3xl md:text-4xl font-bold mb-4 text-white hover:text-gray-300 transition-colors text-left w-full md:w-auto"
      >
        <FaChevronDown
          className={`text-lg md:text-xl transition-transform flex-shrink-0 ${isCollapsed ? '-rotate-90' : ''}`}
        />
        Match History
      </button>

      {!isCollapsed && (
        <div>
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 bg-gray-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('my-matches')}
                className={`px-3 py-1.5 rounded transition-colors text-sm ${
                  viewMode === 'my-matches' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                My Matches
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setViewMode('pending')}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      viewMode === 'pending' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setViewMode('all-matches')}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      viewMode === 'all-matches' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    All Matches
                  </button>
                </>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCreateForm((s) => !s)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
              >
                {showCreateForm ? 'Hide Form' : 'Create Match'}
              </button>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} matches
          </div>
        </div>

        {isAdmin && showCreateForm && (
          <div className="mb-6">
            <CreateMatchForm onMatchCreated={handleMatchCreated} />
          </div>
        )}

        {isLoadingMatches && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Loading matches...</div>
          </div>
        )}

        {error && !isLoadingMatches && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md mb-6">{error}</div>
        )}

        {!isLoadingMatches && !error && matches.length === 0 && (
          <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="text-gray-400 text-lg mb-2">No matches found</div>
            <p className="text-gray-500 text-sm">
              {viewMode === 'my-matches' ? "You haven't played any matches yet" : viewMode === 'pending' ? 'No pending matches at the moment' : 'No matches have been created yet'}
            </p>
          </div>
        )}

        {!isLoadingMatches && !error && matches.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} onMatchCompleted={onMatchCompleted} />
              ))}
            </div>

            {pagination.total > pagination.limit && (
              <div className="flex justify-center gap-4 items-center">
                <button onClick={handlePreviousPage} disabled={pagination.offset === 0} className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-md transition-colors">Previous</button>
                <span className="text-gray-400">Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}</span>
                <button onClick={handleNextPage} disabled={!pagination.hasMore} className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-md transition-colors">Next</button>
              </div>
            )}
          </>
        )}
      </div>
      )}
    </div>
  )
}
