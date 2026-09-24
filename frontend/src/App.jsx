import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// User Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </Router>
  );
}

