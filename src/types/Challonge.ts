export interface ChallongeAuthorizationResponse {
  authorizationUrl: string
  state: string
}

export interface ChallongeCallbackResponse {
  success: boolean
  connected: boolean
  expiresAt: string
}

export interface ChallongeConnectionStatus {
  connected: boolean
  expiresAt?: string
  isExpired?: boolean
  scope?: string
  connectedSince?: string
}

export interface ChallongeTokenResponse {
  accessToken: string
  expiresAt: string
}

export interface ChallongeRefreshResponse {
  success: boolean
  expiresAt: string
  scope: string
}

export interface ChallongeDisconnectResponse {
  success: boolean
  message: string
}
