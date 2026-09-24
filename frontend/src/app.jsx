import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/authentication.jsx';
import RoleRoute from './components/roleroute.jsx';
import Login from './pages/login.jsx';

// Global Admin Pages
import GlobalDashboard from './pages/global_admin/dashboard.jsx';
import AllExperiences from './pages/global_admin/allexperiences.jsx';
import GlobalExperienceDetail from './pages/global_admin/experiencedetail.jsx';

// Local Admin Pages
import LocalDashboard from './pages/local_admin/dashboard.jsx';
import DepartmentExperiences from './pages/local_admin/departmentexperiences.jsx';
import LocalExperienceDetail from './pages/local_admin/experiencedetail.jsx';

import ErrorBoundary from './components/error.jsx';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Global Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['global_admin']} />}>
              <Route path="/global-admin/dashboard" element={<GlobalDashboard />} />
              <Route path="/global-admin/experiences" element={<AllExperiences />} />
              <Route path="/global-admin/experiences/:id" element={<GlobalExperienceDetail />} />
            </Route>

            {/* Local Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['local_admin']} />}>
              <Route path="/local-admin/dashboard" element={<LocalDashboard />} />
              <Route path="/local-admin/experiences" element={<DepartmentExperiences />} />
              <Route path="/local-admin/experiences/:id" element={<LocalExperienceDetail />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;