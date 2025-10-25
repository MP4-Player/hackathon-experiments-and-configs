import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { MapPage } from '@/pages/dashboard/MapPage'
import { MeetingTypesPage } from '@/pages/dashboard/MeetingTypesPage'
import { SchedulePage } from '@/pages/dashboard/SchedulePage'
import { StatisticsPage } from '@/pages/dashboard/StatisticsPage'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard/map" replace />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/map" 
          element={
            <ProtectedRoute>
              <Layout>
                <MapPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard/meeting-types"
          element={
            <ProtectedRoute>
              <Layout>
                <MeetingTypesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/schedule"
          element={
            <ProtectedRoute>
              <Layout>
                <SchedulePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/statistics"
          element={
            <ProtectedRoute>
              <Layout>
                <StatisticsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
