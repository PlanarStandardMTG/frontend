import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './AuthContextProvider'
import type { UserDTO } from '../types/User'

// Helper function to decode JWT and extract user info
function decodeToken(token: string): UserDTO | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('authToken')
    return !!token
  })

  const [user, setUser] = useState<UserDTO | null>(() => {
    const token = localStorage.getItem('authToken')
    return token ? decodeToken(token) : null
  })

  const isAdmin = user?.admin ?? false

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken')
      setIsLoggedIn(!!token)
      setUser(token ? decodeToken(token) : null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Update user when login state changes
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token && isLoggedIn) {
      setUser(decodeToken(token))
    } else if (!isLoggedIn) {
      setUser(null)
    }
  }, [isLoggedIn])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
