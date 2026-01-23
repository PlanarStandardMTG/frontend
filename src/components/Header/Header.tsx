import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { FaTachometerAlt, FaSignInAlt, FaBars, FaHome, FaCrown, FaCog, FaTrophy, FaProjectDiagram } from 'react-icons/fa'
import DesktopButton from './DesktopButton'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleTitleClick = () => navigate('/')

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleTitleClick}>
            <span className="text-2xl font-extrabold italic pr-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              PLANAR
            </span>
            <img
              src="/PlanarStandardLogo.png"
              alt=""
              className="h-11"
            />
            <span className="text-2xl font-extrabold italic pr-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              STANDARD
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-3">
            {isLoggedIn && (
              <DesktopButton 
                icon={<FaTachometerAlt />} 
                label="Dashboard" 
                onClick={() => navigate('/dashboard')} 
                color="blue" 
              />
            )}
            
            <DesktopButton 
              icon={<FaTrophy />} 
              label="Tournaments" 
              onClick={() => navigate(isLoggedIn ? '/tournaments' : '/auth?redirect=/tournaments')} 
              color="purple" 
            />

            <DesktopButton 
              icon={<FaBars />} 
              label="Rules" 
              onClick={() => navigate('/rules')} 
              color="orange" 
            />
            
            <DesktopButton 
              icon={<FaProjectDiagram />} 
              label="Archetypes" 
              onClick={() => navigate('/archetype-map')} 
              color="cyan" 
            />
            
            {isAdmin && (
              <DesktopButton 
                icon={<FaCrown />} 
                label="Admin" 
                onClick={() => navigate('/admin')} 
                color="yellow" 
              />
            )}
            
            {isLoggedIn ? (
              <DesktopButton 
                icon={<FaCog />} 
                label="Account" 
                onClick={() => navigate('/account')} 
                color="gray" 
              />
            ) : (
              <DesktopButton 
                icon={<FaSignInAlt />} 
                label="Login" 
                onClick={() => navigate('/auth')} 
                color="green" 
              />
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
            <button
              onClick={() => { navigate('/'); setMenuOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 hover:text-white"
            >
              <FaHome /> Home
            </button>

            {isLoggedIn && (
              <button
                onClick={() => { navigate('/dashboard'); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-blue-600 hover:text-white"
              >
                <FaTachometerAlt /> Dashboard
              </button>
            )}

            <button
              onClick={() => { navigate(isLoggedIn ? '/tournaments' : '/auth'); setMenuOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-purple-600 hover:text-white"
            >
              <FaTrophy /> Tournaments
            </button>

            <button
              onClick={() => { navigate('/rules'); setMenuOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-orange-600 hover:text-white"
            >
              <FaBars /> Rules
            </button>

            <button
              onClick={() => { navigate('/archetype-map'); setMenuOpen(false) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-cyan-600 hover:text-white"
            >
              <FaProjectDiagram /> Archetype Map
            </button>

            {isAdmin && (
              <button
                onClick={() => { navigate('/admin'); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-yellow-600 hover:text-white"
              >
                <FaCrown /> Admin Dashboard
              </button>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => { navigate('/account'); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 hover:text-white"
              >
                <FaCog /> Account Settings
              </button>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setMenuOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-500 text-gray-100 hover:border-gray-300"
              >
                <FaSignInAlt /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
