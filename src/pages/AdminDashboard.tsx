import { useAuth } from '../contexts/useAuth'
import { FaCrown, FaUsers, FaBook, FaChartBar, FaCog } from 'react-icons/fa'

export function AdminDashboard() {
  const { user } = useAuth()

  const adminCards = [
    {
      icon: FaUsers,
      title: 'User Management',
      description: 'Manage users, permissions, and accounts',
      color: 'from-blue-600 to-blue-800',
    },
    {
      icon: FaBook,
      title: 'Card Database',
      description: 'Manage card sets, banlists, and format rules',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: FaChartBar,
      title: 'Analytics',
      description: 'View platform statistics and player metrics',
      color: 'from-green-600 to-green-800',
    },
    {
      icon: FaCog,
      title: 'System Settings',
      description: 'Configure platform settings and features',
      color: 'from-orange-600 to-orange-800',
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <FaCrown className="text-4xl text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-yellow-100 mt-1">
                Welcome back, {user?.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {adminCards.map((card) => (
            <button
              key={card.title}
              className="group bg-gray-900/75 backdrop-blur-md rounded-lg p-6 border border-gray-700 hover:border-gray-500 transition-all duration-300 text-left"
            >
              <div className={`bg-gradient-to-r ${card.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400">{card.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-900/75 backdrop-blur-md rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">---</div>
              <div className="text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">---</div>
              <div className="text-gray-400">Active Games</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">---</div>
              <div className="text-gray-400">Cards in Database</div>
            </div>
          </div>
        </div>

        {/* Development Notice */}
        {import.meta.env.MODE === 'development' && (
          <div className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-500 text-sm">
              <strong>Development Mode:</strong> Admin dashboard functionality is under development. 
              Click on the cards above to implement specific admin features.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
