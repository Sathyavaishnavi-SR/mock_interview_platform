import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public & Marketing Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOtp from './pages/VerifyResetOtp';
import ResetPassword from './pages/ResetPassword';

// User Authenticated Pages
import Dashboard from './pages/Dashboard';
import PostInterviewExperience from './pages/PostInterviewExperience';
import PostInterviewQuestions from './pages/PostInterviewQuestions';
import InterviewSetup from './pages/InterviewSetup';
import Interview from './pages/Interview';
import Results from './pages/Results';

// Admin Pages
import GlobalAdminDashboard from './pages/admin/GlobalAdminDashboard';
import LocalAdminDashboard from './pages/admin/LocalAdminDashboard';
import ReviewSubmission from './pages/admin/ReviewSubmission';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Root Route: Redirect to /dashboard if authenticated, else to /login
function RootRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          background: 'var(--bg-primary)',
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root / Route: redirects to /login if not authenticated, else to /dashboard */}
          <Route path="/" element={<RootRoute />} />

          {/* Public Authentication Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-experience"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <PostInterviewExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-questions"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <PostInterviewQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-setup"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute allowedRoles={['user', 'local_admin', 'global_admin']}>
                <Results />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/global"
            element={
              <ProtectedRoute allowedRoles={['global_admin']}>
                <GlobalAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/local"
            element={
              <ProtectedRoute allowedRoles={['local_admin', 'global_admin']}>
                <LocalAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/review/:id"
            element={
              <ProtectedRoute allowedRoles={['local_admin', 'global_admin']}>
                <ReviewSubmission />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
