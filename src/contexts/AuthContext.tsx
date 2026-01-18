import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './AuthContextProvider'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('authToken')
    return !!token
  })

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken')
      setIsLoggedIn(!!token)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
