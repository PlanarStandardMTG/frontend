import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tournament } from '../../types/Tournament';
import { FaCalendar, FaUsers, FaTrophy, FaGamepad, FaCheckCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../types/Api';
import { challongeApi } from '../../services/challongeApi';
import { getAuthToken } from '../../utils/apiSecurity';
import { sanitizeText, sanitizeURL } from '../../utils/security';

interface TournamentCardProps {
  tournament: Tournament;
  onTournamentUpdate?: () => void;
}

export function TournamentCard({ tournament, onTournamentUpdate }: TournamentCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(tournament.isParticipant || false);
  
  const isCompleted = tournament.state === 'complete';
  const isUnderway = tournament.state === 'underway';
//   const isPending = tournament.state === 'pending';

  const getStateColor = () => {
    switch (tournament.state) {
      case 'complete':
        return 'text-gray-500';
      case 'underway':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'awaiting_review':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStateLabel = () => {
    switch (tournament.state) {
      case 'complete':
        return 'Completed';
      case 'underway':
        return 'In Progress';
      case 'pending':
        return 'Upcoming';
      case 'awaiting_review':
        return 'Awaiting Review';
      default:
        return tournament.state;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleJoinTournament = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      // Check Challonge connection status first
      const status = await challongeApi.getStatus();
      if (!status.connected) {
        navigate('/account');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/challonge/tournaments/${tournament.id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If no Challonge connection, redirect to account settings
        if (response.status === 403) {
          navigate('/account-settings');
          return;
        }
        
        throw new Error(sanitizeText(errorData.message || 'Failed to join tournament'));
      }

      setIsParticipant(true);
      if (onTournamentUpdate) {
        onTournamentUpdate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTournament = async () => {
    if (!confirm('Are you sure you want to leave this tournament?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/challonge/tournaments/${tournament.id}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If no Challonge connection, redirect to account settings
        if (response.status === 403) {
          navigate('/account-settings');
          return;
        }
        
        throw new Error(sanitizeText(errorData.message || 'Failed to leave tournament'));
      }

      setIsParticipant(false);
      if (onTournamentUpdate) {
        onTournamentUpdate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? sanitizeText(err.message) : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-900/75 backdrop-blur-md border rounded-lg p-6 transition-all hover:border-gray-600 ${
        isCompleted ? 'opacity-50 border-gray-700' : isParticipant ? 'border-green-500' : 'border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-1 ${isCompleted ? 'text-gray-500' : 'text-white'}`}>
            {tournament.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${getStateColor()}`}>
              {getStateLabel()}
            </span>
            {isParticipant && !isCompleted && (
              <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/50">
                <FaCheckCircle /> You're Registered
              </span>
            )}
          </div>
        </div>
        {isUnderway && (
          <FaTrophy className="text-yellow-400 text-2xl animate-pulse" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-400 text-sm">
          <FaGamepad className="mr-2" />
          <span className={isCompleted ? 'text-gray-600' : ''}>
            {tournament.tournamentType}
          </span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <FaCalendar className="mr-2" />
          <span className={isCompleted ? 'text-gray-600' : ''}>
            {formatDate(tournament.startsAt)}
          </span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <FaUsers className="mr-2" />
          <span className={isCompleted ? 'text-gray-600' : ''}>
            {tournament.participantCount} participants
          </span>
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-md p-2 text-sm text-red-200">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <a
              href={sanitizeURL(`https://challonge.com/${tournament.url}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View on Challonge →
            </a>
            
            {tournament.state === 'pending' && (
              isParticipant ? (
                <button
                  onClick={handleLeaveTournament}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors disabled:cursor-not-allowed"
                >
                  <FaSignOutAlt />
                  {isLoading ? 'Leaving...' : 'Leave'}
                </button>
              ) : (
                <button
                  onClick={handleJoinTournament}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors disabled:cursor-not-allowed"
                >
                  <FaSignInAlt />
                  {isLoading ? 'Joining...' : 'Join'}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
