import type { RankedInfoDTO, UserDTO } from './User'

export interface Match {
  id: string
  player1Id: string
  player2Id: string
  winnerRankedId: string | null
  player1EloChange: number | null
  player2EloChange: number | null
  createdAt: string
  completedAt: string | null
  tournamentId: string | null
  draw: boolean
  player1Score: number | null
  player2Score: number | null
  player1?: UserDTO
  player2?: UserDTO
  player1Ranked: RankedInfoDTO
  player2Ranked: RankedInfoDTO
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
