// 19. src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSuperadmin = false }) => {
  const { user, token } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireSuperadmin && user.role !== 'superadmin') return <Navigate to="/assets" replace />;

  return children;
};

export default ProtectedRoute;
