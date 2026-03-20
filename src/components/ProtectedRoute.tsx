import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const isDev = import.meta.env.MODE === 'development'

  if (!isDev) {
    return <Navigate to="/" replace />
  }

  if (!isLoggedIn) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}
