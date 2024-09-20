import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // Show a loading spinner or placeholder while waiting for user data
    return <div>Loading...</div>;
  }

  if (user) {
    // Redirect based on the user's role
    if (user.roles && user.roles.includes('superadmin')) {
      return <Navigate to="/super/dashboard" />;
    } else if (user.roles && user.roles.includes('admin')) {
      return <Navigate to="/dashboard" />;
    }
  }

  // If no user is logged in, render the public route components
  return children;
};

export default PublicRoute;
