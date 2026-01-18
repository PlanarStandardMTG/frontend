import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to PlanarStandard</h1>
        <p className="text-xl text-gray-300 mb-8">A modern application with clean navigation</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
