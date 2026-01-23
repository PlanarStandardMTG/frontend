import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './AuthContextProvider'
import type { UserDTO } from '../types/User'
import { getAuthToken, clearAuthToken } from '../utils/apiSecurity'

// Helper function to decode JWT and extract user info
function decodeToken(token: string): UserDTO | null {
  try {
    // Validate token format first
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const padded = base64 + padding;
    
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // Validate token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token has expired');
      clearAuthToken();
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    clearAuthToken();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from token
  const initializeAuth = () => {
    const token = getAuthToken();
    if (!token) return { loggedIn: false, userData: null };
    
    const decoded = decodeToken(token);
    return {
      loggedIn: !!decoded,
      userData: decoded
    };
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => initializeAuth().loggedIn);
  const [user, setUser] = useState<UserDTO | null>(() => initializeAuth().userData);

  const isAdmin = user?.admin ?? false;

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to authToken changes
      if (e.key === 'authToken') {
        const token = getAuthToken()
        const decoded = token ? decodeToken(token) : null;
        setIsLoggedIn(!!decoded);
        setUser(decoded);
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
