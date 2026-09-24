import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component Placeholder
 * Will eventually enforce role-based access control (user, local_admin, global_admin)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  // Placeholder condition: Pass-through during initial architecture stage
  const isAuthenticated = true;
  const userRole = 'user'; // 'user' | 'local_admin' | 'global_admin'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

