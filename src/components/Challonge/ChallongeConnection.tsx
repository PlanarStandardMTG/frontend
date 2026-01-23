import { useState, useEffect } from 'react'
import { FaTrophy, FaLink, FaUnlink, FaCheckCircle, FaExclamationTriangle, FaSync } from 'react-icons/fa'
import { challongeApi } from '../../services/challongeApi'
import type { ChallongeConnectionStatus } from '../../types/Challonge'
import { sanitizeURL } from '../../utils/security'

export function ChallongeConnection() {
  const [status, setStatus] = useState<ChallongeConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchStatus = async () => {
    try {
      setError(null)
      const data = await challongeApi.getStatus()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connection status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleConnect = async () => {
    try {
      setActionLoading(true)
      setError(null)
      
      const { authorizationUrl, state } = await challongeApi.connect()
      
      // Validate authorization URL before redirect
      const safeUrl = sanitizeURL(authorizationUrl)
      if (!safeUrl || !safeUrl.startsWith('https://')) {
        throw new Error('Invalid authorization URL received')
      }
      
      // Store state in sessionStorage for verification in callback
      sessionStorage.setItem('challonge_oauth_state', state)
      
      // Redirect to Challonge OAuth page
      window.location.href = safeUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate connection')
      setActionLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Challonge account?')) {
      return
    }

    try {
      setActionLoading(true)
      setError(null)
      
      await challongeApi.disconnect()
      await fetchStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setActionLoading(true)
      setError(null)
      
      await challongeApi.refresh()
      await fetchStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh token')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <FaTrophy className="text-2xl text-purple-400" />
          <h2 className="text-2xl font-semibold">Challonge Integration</h2>
        </div>
        <p className="text-gray-400">Loading connection status...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <FaTrophy className="text-2xl text-purple-400" />
        <h2 className="text-2xl font-semibold">Challonge Integration</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start gap-2">
          <FaExclamationTriangle className="text-red-400 mt-1 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {status?.connected ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-green-400 mb-4">
            <FaCheckCircle className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">Connected to Challonge</p>
              <p className="text-sm text-gray-400">
                Your account is linked and ready to manage tournaments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {status.connectedSince && (
              <div>
                <p className="text-gray-400">Connected Since</p>
                <p className="text-white font-medium">{formatDate(status.connectedSince)}</p>
              </div>
            )}
            
            {status.expiresAt && (
              <div>
                <p className="text-gray-400">Token Expires</p>
                <p className={`font-medium ${status.isExpired ? 'text-red-400' : 'text-white'}`}>
                  {formatDate(status.expiresAt)}
                  {status.isExpired && ' (Expired)'}
                </p>
              </div>
            )}

            {status.scope && (
              <div className="sm:col-span-2">
                <p className="text-gray-400">Permissions</p>
                <p className="text-white font-mono text-xs">{status.scope}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {status.isExpired && (
              <button
                onClick={handleRefresh}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <FaSync className={actionLoading ? 'animate-spin' : ''} />
                Refresh Token
              </button>
            )}
            
            <button
              onClick={handleDisconnect}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
            >
              <FaUnlink />
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400">
            Connect your Challonge account to create and manage tournaments directly from Planar Standard.
          </p>
          
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>Create tournaments automatically</li>
            <li>Sync match results</li>
            <li>Manage participants and brackets</li>
          </ul>

          <button
            onClick={handleConnect}
            disabled={actionLoading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            <FaLink />
            {actionLoading ? 'Connecting...' : 'Connect to Challonge'}
          </button>
        </div>
      )}
    </div>
  )
}
