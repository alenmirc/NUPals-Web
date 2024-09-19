import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // You can customize this part to show a loading spinner or a placeholder
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" />;
  }

   if (user.roles && user.roles.includes('admin')) {
    // Redirect to admin dashboard if user is an admin
    return <Navigate to="/dashboard" />;
  }
  
  return children;
  
};

export default AdminPrivateRoute;
