import { useEffect, useState } from "react";
import type { UserDTO } from "../types/User";
import { API_BASE_URL } from "../types/Api";

export function Dashboard() {
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setUser(await response.json());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {user ? `Welcome, ${user.username}` : "Dashboard"}
        </h1>
        <p className="text-gray-300 mb-8">Welcome to your dashboard. THIS PAGE IS A WORK IN PROGRESS.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">ELO Ratings</h2>
            <p className="text-gray-400">Your current ELO rating will appear here</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Recent Matches</h2>
            <p className="text-gray-400">Recent match history will be shown here</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Match Stats</h2>
            <p className="text-gray-400">Statistics from your matches will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
