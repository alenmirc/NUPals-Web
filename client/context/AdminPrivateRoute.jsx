import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const AdminPrivateRoute = ({ children }) => {
  const { user, loading, isSuperadmin } = useContext(UserContext);

  if (loading) {
    // Show a loading spinner or placeholder while waiting for user data
    return <div>Loading...</div>;
  }

  console.log('User state:', user); // Check the user state

  if (!user) {
    return <Navigate to="/login" />;
}

if (!isSuperadmin) {
    return <Navigate to="/Dashboard" />;
}

return children;
};

export default AdminPrivateRoute;
