import { useEffect, useState } from "react";
 
import type { UserDTO } from "../types/User";
import { API_BASE_URL } from "../types/Api";
import { UpcomingTournaments } from '../components/Dashboard/UpcomingTournaments';
import { MatchHistory } from '../components/Dashboard/MatchHistory';
import { getAuthToken } from '../utils/apiSecurity';

export function Dashboard() {
  
  const [user, setUser] = useState<UserDTO | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        });
        if (response.ok) {
          setUser(await response.json());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  // tournaments refreshed via child `UpcomingTournaments` component

  // matches are handled in `MatchHistory` component

  const refreshUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });
      if (response.ok) {
        setUser(await response.json());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleMatchCompleted = () => {
    refreshUserData()
    setRefreshTrigger((p) => p + 1)
  }

  const handleTournamentUpdate = () => setRefreshTrigger((p) => p + 1)

  // Child components handle their own collapsed state and fetching

  // derive displayed ELO: prefer rankedInfo, fall back to legacy elo or default
  const displayedUserElo = user ? (user.rankedInfo?.elo ?? user.elo ?? 1600) : null;

  return (
    <div className="relative min-h-screen px-6 py-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white">
      {/* Welcome Header with ELO */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 text-white">
          {user ? `${user.username}` : "Dashboard"}
        </h1>
        {user && (
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-gray-400 text-lg">Your ELO Rating:</span>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {displayedUserElo}
            </span>
          </div>
        )}
        <p className="text-gray-400">
          Track your matches and watch your rating evolve
        </p>
      </div>

      <UpcomingTournaments refreshTrigger={refreshTrigger} onTournamentUpdate={handleTournamentUpdate} />

      <MatchHistory refreshTrigger={refreshTrigger} onMatchCompleted={handleMatchCompleted} />
    </div>
  )
}
