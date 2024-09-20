import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './App.css';

import { UserContextProvider } from '../context/userContext';
import PrivateRoute from '../context/PrivateRoute';
import PublicRoute from '../context/PublicRoute';
import AdminPrivateRoute from '../context/AdminPrivateRoute';

import Notfound from './pages/404Notfound/404';
import NotAuthorized from './pages/404Notfound/NotAuthorized';
import Test from './pages/Dashboard/test';
import Template from './pages/Dashboard/template';

import Home from './pages/Home';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Dashboard/Users';
import Post from './pages/Dashboard/Post';
import Profile from './pages/Dashboard/Profile';

import AdminDashboard from './superadmin/Dashboard';
import AdminAdmin from './superadmin/Admin';
import AdminUsers from './superadmin/Users';
import AdminLogs from './superadmin/Logs';

axios.defaults.baseURL = 'https://nupals-web.onrender.com';
axios.defaults.withCredentials = true


function App() {
  return (
    <>

    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
      <Route path='*' element={<Notfound />} />
      <Route path='/not-authorized' element={<NotAuthorized />} />
      <Route path='/test' element={<Test />}/>

      <Route path='/' element={<Home />} />
      <Route path='/login' element={<PublicRoute><Login /></PublicRoute>}/>
      <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}/>
      <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
      <Route path='/users' element={<PrivateRoute><Users /></PrivateRoute>}/>
      <Route path='/post' element={<PrivateRoute><Post /></PrivateRoute>}/>
      <Route path='/profile' element={<Profile />}/>
      <Route path='/template' element={<Template />}/>
      
      <Route path='/super/dashboard' element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
      <Route path='/super/admin' element={<AdminPrivateRoute><AdminAdmin /></AdminPrivateRoute>} />
      <Route path='/super/users' element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
      <Route path='/super/logs' element={<AdminPrivateRoute><AdminLogs /></AdminPrivateRoute>} />

      </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
