import { createContext } from 'react'

export interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
