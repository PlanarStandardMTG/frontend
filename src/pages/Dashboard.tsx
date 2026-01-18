export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-300 mb-8">Welcome to your dashboard. This is a placeholder page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Stats</h2>
            <p className="text-gray-400">Your statistics will appear here</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Activity</h2>
            <p className="text-gray-400">Recent activity will be shown here</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <p className="text-gray-400">Quick actions will be available here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
