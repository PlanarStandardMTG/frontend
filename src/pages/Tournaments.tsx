import { useState, useEffect } from 'react';
import { TournamentCard } from '../components/Tournaments/TournamentCard';
import type { Tournament, TournamentsResponse } from '../types/Tournament';
import { API_BASE_URL } from '../types/Api';
import { FaTrophy, FaExclamationTriangle, FaFilter, FaCheckCircle } from 'react-icons/fa';

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyMyTournaments, setShowOnlyMyTournaments] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/challonge/tournaments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tournaments');
      }

      const data: TournamentsResponse = await response.json();
      setTournaments(data.tournaments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const activeTournaments = tournaments.filter(t => t.state !== 'complete');
  const completedTournaments = tournaments.filter(t => t.state === 'complete');
  
  // Separate user's tournaments
  const myActiveTournaments = activeTournaments.filter(t => t.isParticipant);
  const otherActiveTournaments = activeTournaments.filter(t => !t.isParticipant);
  const myCompletedTournaments = completedTournaments.filter(t => t.isParticipant);
  const otherCompletedTournaments = completedTournaments.filter(t => !t.isParticipant);
  
  // Filter based on view mode
//   const displayActiveTournaments = showOnlyMyTournaments ? myActiveTournaments : activeTournaments;
//   const displayCompletedTournaments = showOnlyMyTournaments ? myCompletedTournaments : completedTournaments;
  
  const hasMyTournaments = myActiveTournaments.length > 0 || myCompletedTournaments.length > 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <FaTrophy className="text-yellow-400 text-5xl mr-4" />
            <h1 className="text-5xl font-bold text-white">Tournaments</h1>
          </div>
          <p className="text-gray-400 text-lg">
            View all Planar Standard MTG tournaments
          </p>
          
          {/* View Toggle */}
          {hasMyTournaments && !loading && (
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center bg-gray-900/75 backdrop-blur-md border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setShowOnlyMyTournaments(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    !showOnlyMyTournaments
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaFilter />
                  All Tournaments
                </button>
                <button
                  onClick={() => setShowOnlyMyTournaments(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    showOnlyMyTournaments
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaCheckCircle />
                  My Tournaments
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-4">Loading tournaments...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-3" />
              <p className="text-red-200">{error}</p>
            </div>
            <button
              onClick={fetchTournaments}
              className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No tournaments found</p>
          </div>
        )}
        
        {!loading && !error && showOnlyMyTournaments && !hasMyTournaments && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">You're not registered for any tournaments yet</p>
          </div>
        )}

        {!loading && !error && tournaments.length > 0 && (showOnlyMyTournaments ? hasMyTournaments : true) && (
          <div className="space-y-12">
            {/* Show tournaments based on view mode */}
            {showOnlyMyTournaments ? (
              <>
                {/* My Active Tournaments */}
                {myActiveTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
                      <FaTrophy className="text-green-400" />
                      My Active Tournaments
                    </h2>
                    <p className="text-gray-400 mb-6">Tournaments you're registered for</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myActiveTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}

                {/* My Completed Tournaments */}
                {myCompletedTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">
                      My Completed Tournaments
                    </h2>
                    <p className="text-gray-500 mb-6">Past tournaments you participated in</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCompletedTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* My Active Tournaments */}
                {myActiveTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
                      <FaTrophy className="text-green-400" />
                      My Tournaments
                    </h2>
                    <p className="text-gray-400 mb-6">Tournaments you're registered for</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myActiveTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Active Tournaments */}
                {otherActiveTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {myActiveTournaments.length > 0 ? 'Other ' : ''}Active & Upcoming Tournaments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherActiveTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}

                {/* My Completed Tournaments */}
                {myCompletedTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">
                      My Completed Tournaments
                    </h2>
                    <p className="text-gray-500 mb-6">Past tournaments you participated in</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCompletedTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Completed Tournaments */}
                {otherCompletedTournaments.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-500 mb-6">
                      {myCompletedTournaments.length > 0 ? 'Other ' : ''}Completed Tournaments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherCompletedTournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
