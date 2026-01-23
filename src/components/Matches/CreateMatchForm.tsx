import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../types/Api'
import type { UserDTO } from '../../types/User'
import { getAuthToken } from '../../utils/apiSecurity'
import { sanitizeText, isValidUUID } from '../../utils/security'

interface CreateMatchFormProps {
  onMatchCreated?: () => void
}

export function CreateMatchForm({ onMatchCreated }: CreateMatchFormProps) {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required');
        setIsLoadingUsers(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(sanitizeText(data.message || 'Failed to fetch users'))
      }

      setUsers(data.users || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'Failed to load users'
      setError(errorMessage)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    if (!player1Id || !player2Id) {
      setError('Please select both players')
      setIsLoading(false)
      return
    }

    if (player1Id === player2Id) {
      setError('Players must be different')
      setIsLoading(false)
      return
    }

    // Validate UUIDs to prevent injection
    if (!isValidUUID(player1Id) || !isValidUUID(player2Id)) {
      setError('Invalid player selection')
      setIsLoading(false)
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        setIsLoading(false)
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/api/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ player1Id, player2Id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(sanitizeText(data.message || 'Failed to create match'))
      }

      setSuccess(true)
      setPlayer1Id('')
      setPlayer2Id('')
      onMatchCreated?.()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'Failed to create match'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUsers) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="text-center text-gray-400">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white">Create New Match</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium text-gray-300 mb-2">
            Player 1
          </label>
          <select
            id="player1"
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Player 1</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} (ELO: {user.elo})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-gray-300 mb-2">
            Player 2
          </label>
          <select
            id="player2"
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Player 2</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} (ELO: {user.elo})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-md">
            Match created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          {isLoading ? 'Creating Match...' : 'Create Match'}
        </button>
      </form>
    </div>
  )
}
