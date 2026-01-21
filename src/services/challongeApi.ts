import { API_BASE_URL } from '../types/Api'
import type {
  ChallongeAuthorizationResponse,
  ChallongeCallbackResponse,
  ChallongeConnectionStatus,
  ChallongeRefreshResponse,
  ChallongeDisconnectResponse,
} from '../types/Challonge'

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
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
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initiate Challonge connection')
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
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to complete Challonge connection')
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
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get Challonge status')
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
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to refresh Challonge token')
    }

    return response.json()
  },

  /**
   * Disconnect Challonge account
   */
  async disconnect(): Promise<ChallongeDisconnectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/challonge/disconnect`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to disconnect Challonge')
    }

    return response.json()
  },
}
