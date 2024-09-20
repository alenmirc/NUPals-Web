import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // Show a loading spinner or placeholder while the user is being fetched
    return <div>Loading...</div>;
  }

  if (!user) {
    // If no user is found, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.roles && user.roles.includes('superadmin')) {
    // If the user is a superadmin, redirect to the superadmin dashboard
    return <Navigate to="/super/dashboard" />;
  }

  if (user.roles && user.roles.includes('admin')) {
    // If the user is an admin, allow access to the admin route
    return children;
  }

  // If the user is logged in but is neither an admin nor a superadmin, redirect to "not authorized"
  return <Navigate to="/not-authorized" />;
};

export default PrivateRoute;
