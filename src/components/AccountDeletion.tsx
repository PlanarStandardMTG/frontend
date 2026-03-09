import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { API_BASE_URL } from '../types/Api';
import { clearAuthToken } from '../utils/apiSecurity';
import { FaTrashAlt } from 'react-icons/fa';

export function AccountDeletion() {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Success
        clearAuthToken();
        setIsLoggedIn(false);
        navigate('/auth');
      } else if (response.status === 404) {
        setError('User not found. Please try logging in again.');
      } else if (response.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-red-400">Delete Account</h2>
      <p className="text-gray-400 mb-6">
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
          disabled={isDeleting}
        >
          <FaTrashAlt /> Delete Account
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-yellow-300 font-semibold">
            Are you sure you want to delete your account? This will permanently remove all your data.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}