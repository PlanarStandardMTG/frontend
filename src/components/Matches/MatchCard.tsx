import { useState } from 'react'
import type { Match } from '../../types/Match'
import { useAuth } from '../../contexts/useAuth'
import { API_BASE_URL } from '../../types/Api'

interface MatchCardProps {
  match: Match
  onMatchCompleted?: () => void
}

export function MatchCard({ match, onMatchCompleted }: MatchCardProps) {
  const { user, isAdmin } = useAuth()
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPlayer1 = user?.id === match.player1Id
  const isPlayer2 = user?.id === match.player2Id

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCompleteMatch = async (winnerId: string) => {
    setIsCompleting(true)
    setError(null)

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/matches/${match.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete match')
      }

      onMatchCompleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete match')
    } finally {
      setIsCompleting(false)
    }
  }

  const getEloChangeDisplay = (change: number | null) => {
    if (change === null) return null
    const sign = change >= 0 ? '+' : ''
    const color = change >= 0 ? 'text-green-400' : 'text-red-400'
    return <span className={color}>{sign}{change}</span>
  }

  const isCompleted = match.completedAt !== null
  const didWin = (playerId: string) => match.winner === playerId

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Player 1 */}
            <div className={`flex-1 ${didWin(match.player1Id) ? 'font-bold text-yellow-400' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={isPlayer1 ? 'text-blue-400' : 'text-white'}>
                  {match.player1?.username || 'Unknown'}
                </span>
                {didWin(match.player1Id) && <span className="text-yellow-400">👑</span>}
              </div>
              {isCompleted && (
                <div className="text-sm text-gray-400">
                  ELO: {match.player1?.elo} {getEloChangeDisplay(match.player1EloChange)}
                </div>
              )}
            </div>

            <div className="text-gray-500 font-bold">VS</div>

            {/* Player 2 */}
            <div className={`flex-1 ${didWin(match.player2Id) ? 'font-bold text-yellow-400' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={isPlayer2 ? 'text-blue-400' : 'text-white'}>
                  {match.player2?.username || 'Unknown'}
                </span>
                {didWin(match.player2Id) && <span className="text-yellow-400">👑</span>}
              </div>
              {isCompleted && (
                <div className="text-sm text-gray-400">
                  ELO: {match.player2?.elo} {getEloChangeDisplay(match.player2EloChange)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {isCompleted ? (
            <span className="text-green-400">Completed</span>
          ) : (
            <span className="text-yellow-400">Pending</span>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Created: {formatDate(match.createdAt)}
        {match.completedAt && ` • Completed: ${formatDate(match.completedAt)}`}
      </div>

      {!isCompleted && isAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Complete Match (Admin Only)</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCompleteMatch(match.player1Id)}
              disabled={isCompleting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              {match.player1?.username} Wins
            </button>
            <button
              onClick={() => handleCompleteMatch(match.player2Id)}
              disabled={isCompleting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              {match.player2?.username} Wins
            </button>
          </div>
          {error && (
            <div className="mt-2 text-red-400 text-sm">{error}</div>
          )}
        </div>
      )}
    </div>
  )
}
