import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';
import { PageLoader } from './loading.jsx';

const RoleRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === 'global_admin') {
      return <Navigate to="/global-admin/dashboard" replace />;
    }
    if (user?.role === 'local_admin') {
      return <Navigate to="/local-admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;