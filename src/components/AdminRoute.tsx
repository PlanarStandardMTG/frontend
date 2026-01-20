import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
