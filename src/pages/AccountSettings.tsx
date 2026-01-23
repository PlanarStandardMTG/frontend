import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { ChallongeConnection } from '../components/Challonge/ChallongeConnection'
import { clearAuthToken } from '../utils/apiSecurity'

export function AccountSettings() {
  const { setIsLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthToken()
    setIsLoggedIn(false)
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaUserCircle className="text-4xl text-blue-400" />
          <h1 className="text-4xl font-bold">Account Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Challonge Integration */}
          <ChallongeConnection />

          {/* Logout Section */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Session</h2>
            <p className="text-gray-400 mb-6">
              Sign out of your account and return to the login page.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Placeholder for future settings */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700 opacity-50">
            <h2 className="text-2xl font-semibold mb-4">More Settings Coming Soon</h2>
            <p className="text-gray-400">
              Additional account settings and preferences will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
