// Types related to leaderboard endpoints (sleaderboard, etc.)

export interface LeaderboardEntryDTO {
  id: string; // RankedUserInfo ID
  username: string;
  elo: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winsAsPlayer1: number;
  winsAsPlayer2: number;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeaderboardResponseDTO {
  leaderboard: LeaderboardEntryDTO[];
  pagination: PaginationDTO;
}
