import { API_BASE_URL } from '../types/Api'
import type {
  ChallongeAuthorizationResponse,
  ChallongeCallbackResponse,
  ChallongeConnectionStatus,
  ChallongeRefreshResponse,
  ChallongeDisconnectResponse,
} from '../types/Challonge'
import { getAuthToken } from '../utils/apiSecurity'
import { sanitizeText } from '../utils/security'

const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const challongeApi = {
  /**
   * Initiate OAuth connection - get authorization URL
   */
  async connect(): Promise<ChallongeAuthorizationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/challonge/connect`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(sanitizeText(error.message || 'Failed to initiate Challonge connection'))
    }

    return response.json()
  },

  /**
   * Complete OAuth callback - exchange code for tokens
   */
  async callback(code: string, state: string): Promise<ChallongeCallbackResponse> {
    const response = await fetch(`${API_BASE_URL}/api/challonge/callback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(sanitizeText(error.message || 'Failed to complete Challonge connection'))
    }

    return response.json()
  },

  /**
   * Get current connection status
   */
  async getStatus(): Promise<ChallongeConnectionStatus> {
    const response = await fetch(`${API_BASE_URL}/api/challonge/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(sanitizeText(error.message || 'Failed to get Challonge status'))
    }

    return response.json()
  },

  /**
   * Manually refresh access token
   */
  async refresh(): Promise<ChallongeRefreshResponse> {
    const response = await fetch(`${API_BASE_URL}/api/challonge/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(sanitizeText(error.message || 'Failed to refresh Challonge token'))
    }

    return response.json()
  },

  /**
   * Disconnect Challonge account
   */
  async disconnect(): Promise<ChallongeDisconnectResponse> {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/api/challonge/disconnect`, {
      method: 'DELETE',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'same-origin',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(sanitizeText(error.message || 'Failed to disconnect Challonge'))
    }

    return response.json()
  },
}
