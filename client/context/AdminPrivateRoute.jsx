import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // Show a loading spinner or placeholder while waiting for user data
    return <div>Loading...</div>;
  }

  console.log('User state:', user); // Check the user state
  
  if (!user) {
    // If no user is found, redirect to login
    return <Navigate to="/login" />;
  }

  if (!user.roles || !user.roles.includes('superadmin')) {
    // If user is not a superadmin, redirect to the not-authorized page or login
    return <Navigate to="/not-authorized" />;
  }

  // If the user is a superadmin, render the children components
  return children;
};

export default AdminPrivateRoute;
