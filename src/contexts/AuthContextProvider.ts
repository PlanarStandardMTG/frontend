import { createContext } from 'react'
import type { UserDTO } from '../types/User'

export interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  user: UserDTO | null
  setUser: (user: UserDTO | null) => void
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
