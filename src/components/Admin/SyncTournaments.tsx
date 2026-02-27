import { useState } from 'react'
import { API_BASE_URL } from '../../types/Api'
import { getAuthToken } from '../../utils/apiSecurity'
import { sanitizeText } from '../../utils/security'

export function SyncTournaments() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSync = async () => {
    if (!window.confirm('Are you sure you want to sync tournament matches?')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const token = getAuthToken()
      if (!token) {
        setMessage('Authentication required')
        setLoading(false)
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/tournaments/sync-matches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(sanitizeText(data.message || 'Sync request failed'))
      }

      setMessage(`Successfully synced ${data.processed} tournament(s)`)
    } catch (err) {
      const errMsg = err instanceof Error ? sanitizeText(err.message) : 'Failed to sync tournaments'
      setMessage(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {message && (
        <div className={`text-sm ${message.startsWith('Successfully') ? 'text-green-400' : 'text-red-400'} mb-2`}>{message}</div>
      )}
      <button
        onClick={handleSync}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        {loading ? 'Syncing...' : 'Sync Tournament Matches'}
      </button>
    </div>
  )
}
