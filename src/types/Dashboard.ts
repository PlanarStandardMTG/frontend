// Types related to dashboard endpoints (stats, leaderboard, matches, etc.)

export interface RecentMatchDTO {
  id: string;
  opponent: {
    id: string;
    username: string;
    elo: number; // always provided from rankedInfo
  };
  result: 'win' | 'loss';
  eloChange: number;
  completedAt: string | null;
}

export interface DashboardStatsDTO {
  id: string;
  username: string;
  email?: string;
  elo: number; // 1600 default, from rankedInfo
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  recentMatches: RecentMatchDTO[];
}

