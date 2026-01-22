import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Authentication } from './pages/Authentication'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { Rules } from './pages/Rules'
import { AdminDashboard } from './pages/AdminDashboard'
import { AccountSettings } from './pages/AccountSettings'
import { ChallongeCallback } from './pages/ChallongeCallback'
import { Tournaments } from './pages/Tournaments'

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/auth/challonge/callback" element={<ProtectedRoute><ChallongeCallback /></ProtectedRoute>} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  )
}

export default App
