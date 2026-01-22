export interface Tournament {
  id: string;
  challongeId: string;
  userId: string | null;
  name: string;
  tournamentType: string;
  url: string;
  state: 'pending' | 'underway' | 'awaiting_review' | 'complete';
  startsAt: string;
  gameName: string;
  participantCount: number;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
  // User participation data (populated by backend)
  isParticipant?: boolean;
  userChallongeUsername?: string | null;
}

export interface TournamentsResponse {
  tournaments: Tournament[];
  count: number;
}

export interface TournamentDetailResponse {
  tournament: Tournament;
  fullData: {
    name: string;
    tournament_type: string;
    url: string;
    state: string;
    starts_at: string;
    game_name: string;
    participants_count: number;
    description: string;
    private: boolean;
    group_stage_enabled: boolean;
  };
}
