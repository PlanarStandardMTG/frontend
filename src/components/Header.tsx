import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { API_BASE_URL } from '../types/Api'
import { FaTachometerAlt, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaBars } from 'react-icons/fa'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleTitleClick = () => navigate('/')
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setIsLoggedIn(false)
    navigate('/auth')
  }

  const handleTestUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log('User Info:', data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const desktopButton = (key: string, icon: JSX.Element, label: string, onClick: () => void, color?: string) => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(key)}
      onMouseLeave={() => setHovered(null)}
      className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200
        ${hovered === key ? `bg-${color}-600 text-white scale-105 shadow-lg shadow-${color}-500/50` : 'bg-gray-700 text-gray-100 hover:text-white'}`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1
              onClick={handleTitleClick}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 cursor-pointer hover:opacity-80 transition-opacity"
            >
              PlanarStandard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-3">
            {isLoggedIn && desktopButton('dashboard', <FaTachometerAlt />, 'Dashboard', () => navigate('/dashboard'), 'blue')}
            {isLoggedIn && import.meta.env.MODE === 'development' &&
              desktopButton('test', <FaUserCircle />, 'Test User Info', handleTestUserInfo, 'purple')
            }
            {desktopButton(
              'auth',
              isLoggedIn ? <FaSignOutAlt /> : <FaSignInAlt />,
              isLoggedIn ? 'Logout' : 'Login',
              isLoggedIn ? handleLogout : () => navigate('/auth'),
              isLoggedIn ? 'red' : 'green'
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-200 hover:text-white focus:outline-none">
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col p-2 space-y-2">
            {isLoggedIn && (
              <button
                onClick={() => { navigate('/dashboard'); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-blue-600 hover:text-white"
              >
                <FaTachometerAlt /> Dashboard
              </button>
            )}
            {isLoggedIn && import.meta.env.MODE === 'development' && (
              <button
                onClick={() => { handleTestUserInfo(); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-purple-600 hover:text-white"
              >
                <FaUserCircle /> Test User Info
              </button>
            )}
            <button
              onClick={() => { isLoggedIn ? handleLogout() : navigate('/auth'); setMenuOpen(false) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isLoggedIn ? 'bg-red-900 text-red-100 hover:bg-red-700 hover:text-white' : 'border-2 border-gray-500 text-gray-100 hover:border-gray-300'
              }`}
            >
              {isLoggedIn ? <FaSignOutAlt /> : <FaSignInAlt />} {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
