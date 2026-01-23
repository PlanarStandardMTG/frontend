import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserDTO } from "../types/User";
import { API_BASE_URL } from "../types/Api";
import type { Match, MatchesResponse } from '../types/Match';
import type { Tournament, TournamentsResponse } from '../types/Tournament';
import { MatchCard } from '../components/Matches/MatchCard';
import { CreateMatchForm } from '../components/Matches/CreateMatchForm';
import { TournamentCard } from '../components/Tournaments/TournamentCard';
import { useAuth } from '../contexts/useAuth';
import { FaTrophy } from 'react-icons/fa';
import { getAuthToken } from '../utils/apiSecurity';
import { sanitizeText } from '../utils/security';

export function Dashboard() {
  const { user: authUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'my-matches' | 'all-matches' | 'pending'>('my-matches');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    hasMore: false
  });

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

  useEffect(() => {
    const fetchTournamentsData = async () => {
      setIsLoadingTournaments(true);

      try {
        const token = getAuthToken();
        if (!token) {
          setIsLoadingTournaments(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/challonge/tournaments`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        });

        if (response.ok) {
          const data: TournamentsResponse = await response.json();
          setTournaments(data.tournaments);
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err);
      } finally {
        setIsLoadingTournaments(false);
      }
    };

    fetchTournamentsData();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchMatchesData = async () => {
      if (!authUser) return;

      setIsLoadingMatches(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          setError('Authentication required');
          setIsLoadingMatches(false);
          return;
        }
        
        let endpoint = `${API_BASE_URL}/api/matches`;
        if (viewMode === 'my-matches') {
          endpoint = `${API_BASE_URL}/api/matches/user?limit=${pagination.limit}&offset=${pagination.offset}`;
        } else if (viewMode === 'pending') {
          endpoint = `${API_BASE_URL}/api/matches?limit=${pagination.limit}&offset=${pagination.offset}&status=pending`;
        } else {
          endpoint = `${API_BASE_URL}/api/matches?limit=${pagination.limit}&offset=${pagination.offset}`;
        }

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(sanitizeText(data.message || 'Failed to fetch matches'));
        }

        const matchesData = data as MatchesResponse;
        
        // Client-side filtering for pending view (as a safety measure)
        let filteredMatches = matchesData.matches;
        if (viewMode === 'pending') {
          filteredMatches = matchesData.matches.filter(match => match.completedAt === null);
        }
        
        setMatches(filteredMatches);
        setPagination(matchesData.pagination);
      } catch (err) {
        const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'Failed to load matches';
        setError(errorMessage);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchMatchesData();
  }, [authUser, viewMode, pagination.offset, pagination.limit, refreshTrigger]);

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

  const handleMatchCreated = () => {
    setShowCreateForm(false);
    // Reset to first page and trigger refresh
    setPagination(prev => ({ ...prev, offset: 0 }));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleMatchCompleted = () => {
    // Refresh both user data (for ELO update) and matches
    refreshUserData();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTournamentUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }));
  };

  // Filter for upcoming tournaments the user is participating in
  const upcomingTournaments = tournaments.filter(
    t => t.isParticipant && (t.state === 'pending' || t.state === 'awaiting_review')
  );

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
              {user.elo}
            </span>
          </div>
        )}
        <p className="text-gray-400">
          Track your matches and watch your rating evolve
        </p>
      </div>

      {/* Upcoming Tournaments Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            {/* <FaTrophy className="text-yellow-400" /> */}
            Upcoming Tournaments
          </h2>
          <button
            onClick={() => navigate('/tournaments')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold"
          >
            Browse All
          </button>
        </div>

        {isLoadingTournaments && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading tournaments...</div>
          </div>
        )}

        {!isLoadingTournaments && upcomingTournaments.length === 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
            <FaTrophy className="text-gray-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 mb-4">You haven't signed up for any tournaments yet</p>
            <button
              onClick={() => navigate('/tournaments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors font-semibold"
            >
              Browse Tournaments
            </button>
          </div>
        )}

        {!isLoadingTournaments && upcomingTournaments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((tournament) => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                onTournamentUpdate={handleTournamentUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Matches Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4 text-white">Match History</h2>
        
        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* View Mode Filters */}
            <div className="flex gap-1 bg-gray-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('my-matches')}
                className={`px-3 py-1.5 rounded transition-colors text-sm ${
                  viewMode === 'my-matches'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                My Matches
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setViewMode('pending')}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      viewMode === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setViewMode('all-matches')}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      viewMode === 'all-matches'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    All Matches
                  </button>
                </>
              )}
            </div>

            {/* Create Match Button */}
            {isAdmin && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
              >
                {showCreateForm ? 'Hide Form' : 'Create Match'}
              </button>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} matches
          </div>
        </div>

        {/* Create Match Form (Admin Only) */}
        {isAdmin && showCreateForm && (
          <div className="mb-6">
            <CreateMatchForm onMatchCreated={handleMatchCreated} />
          </div>
        )}

        {/* Loading State */}
        {isLoadingMatches && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Loading matches...</div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoadingMatches && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Matches List */}
        {!isLoadingMatches && !error && matches.length === 0 && (
          <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="text-gray-400 text-lg mb-2">No matches found</div>
            <p className="text-gray-500 text-sm">
              {viewMode === 'my-matches' 
                ? "You haven't played any matches yet"
                : viewMode === 'pending'
                ? 'No pending matches at the moment'
                : 'No matches have been created yet'
              }
            </p>
          </div>
        )}

        {!isLoadingMatches && !error && matches.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {matches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onMatchCompleted={handleMatchCompleted}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.total > pagination.limit && (
              <div className="flex justify-center gap-4 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={pagination.offset === 0}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-400">
                  Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasMore}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
