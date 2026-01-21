import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { challongeApi } from '../services/challongeApi'

export function ChallongeCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Connecting your Challonge account...')

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get code and state from URL parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Check for OAuth errors from Challonge
        if (error) {
          setStatus('error')
          setMessage(errorDescription || `OAuth error: ${error}`)
          return
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus('error')
          setMessage('Missing authorization code or state parameter')
          return
        }

        // Verify state matches what we stored (CSRF protection)
        const storedState = sessionStorage.getItem('challonge_oauth_state')
        if (state !== storedState) {
          setStatus('error')
          setMessage('State mismatch - possible CSRF attack')
          return
        }

        // Clear stored state
        sessionStorage.removeItem('challonge_oauth_state')

        // Exchange code for tokens
        await challongeApi.callback(code, state)

        setStatus('success')
        setMessage('Successfully connected to Challonge!')

        // Redirect to account settings after a brief delay
        setTimeout(() => {
          navigate('/account-settings')
        }, 2000)
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Failed to connect Challonge account')
      }
    }

    processCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md rounded-lg p-8 border border-gray-700 text-center">
        {status === 'processing' && (
          <>
            <FaSpinner className="text-5xl text-blue-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Processing...</h1>
            <p className="text-gray-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Success!</h1>
            <p className="text-gray-400 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to account settings...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Connection Failed</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => navigate('/account-settings')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Return to Account Settings
            </button>
          </>
        )}
      </div>
    </div>
  )
}
