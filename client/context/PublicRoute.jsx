import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin, isSuperadmin} = useContext(UserContext);

  if (loading) {
    // Show a loading spinner or placeholder while waiting for user data
    return <div className="loader-container">
    <div className="loader"></div>
  </div>
  
  }

  if (user) {
    // Redirect based on the user's role
    if (isAdmin) {
      return <Navigate to="/dashboard" />;
    }
    if (isSuperadmin) {
      return <Navigate to="/super/dashboard" />;
  }
  }

  // If no user is logged in, render the public route components
  return children;
};

export default PublicRoute;
