import type { Tournament } from '../../types/Tournament';
import { FaCalendar, FaUsers, FaTrophy, FaGamepad, FaCheckCircle } from 'react-icons/fa';

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isCompleted = tournament.state === 'complete';
  const isUnderway = tournament.state === 'underway';
  const isParticipant = tournament.isParticipant || false;
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
        <div className="mt-4 pt-4 border-t border-gray-700">
          <a
            href={`https://challonge.com/${tournament.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            View on Challonge →
          </a>
        </div>
      )}
    </div>
  );
}
