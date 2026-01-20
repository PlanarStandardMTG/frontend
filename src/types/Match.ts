import type { UserDTO } from './User'

export interface Match {
  id: string
  player1Id: string
  player2Id: string
  winner: string | null
  player1EloChange: number | null
  player2EloChange: number | null
  createdAt: string
  completedAt: string | null
  player1?: UserDTO
  player2?: UserDTO
}

export interface CreateMatchRequest {
  player1Id: string
  player2Id: string
}

export interface CompleteMatchRequest {
  winnerId: string
}

export interface MatchesResponse {
  matches: Match[]
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}
