  import React, { useContext } from 'react';
  import { Navigate } from 'react-router-dom';
  import { UserContext } from './userContext';

  const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);
  
   
  if (loading) {
    // You can customize this part to show a loading spinner or a placeholder
    return <div>Loading...</div>;
  }

  if (!user) {
    // If no user is found, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.roles && user.roles.includes('superadmin')) {
    // If user is a superadmin, redirect to super dashboard
    return <Navigate to="/super/dashboard" />;
  }

  if (!user.roles || !user.roles.includes('admin')) {
    // If user is not an admin, redirect to login
    return <Navigate to="/login" />;
  }
    // If all checks pass, render the children components
    return children;
  };
  export default PrivateRoute;
  