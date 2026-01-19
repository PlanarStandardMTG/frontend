import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { API_BASE_URL } from '../types/Api'

export function Header() {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleTitleClick = () => {
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsLoggedIn(false)
    navigate('/auth')
  }

  const handleTestUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      console.log('User Info:', data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 
              onClick={handleTitleClick}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 cursor-pointer hover:opacity-80 transition-opacity"
            >
              PlanarStandard
            </h1>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-4">
            {/* Dashboard Button - Only show when logged in */}
            {isLoggedIn && (
              <button
                onClick={() => navigate('/dashboard')}
                onMouseEnter={() => setIsHovered('dashboard')}
                onMouseLeave={() => setIsHovered(null)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isHovered === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-gray-700 text-gray-100 hover:text-white'
                }`}
              >
                Dashboard
              </button>
            )}

            {/* Test Button - Only show when logged in */}
            {isLoggedIn && import.meta.env.MODE === 'development' && (
              <button
                onClick={handleTestUserInfo}
                onMouseEnter={() => setIsHovered('test')}
                onMouseLeave={() => setIsHovered(null)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isHovered === 'test'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-gray-700 text-gray-100 hover:text-white'
                }`}
              >
                Test User Info
              </button>
            )}

            {/* Login/Register or Logout Button */}
            <button
              onClick={isLoggedIn ? handleLogout : () => navigate('/auth')}
              onMouseEnter={() => setIsHovered('auth')}
              onMouseLeave={() => setIsHovered(null)}
              className={`px-6 py-2 rounded-lg font-semibold  ${
                isLoggedIn
                  ? isHovered === 'auth'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50 scale-105'
                    : 'bg-red-900 text-red-100 hover:text-white'
                  : isHovered === 'auth'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105'
                    : 'border-2 border-gray-500 text-gray-100 hover:border-gray-300'
              }`}
            >
              {isLoggedIn ? 'Logout' : 'Login/Register'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
