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
import ForgotPassword from './pages/Login/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Dashboard/Settings';
import Student from './pages/Dashboard/Student';
import Post from './pages/Dashboard/Post';
import Profile from './pages/Dashboard/Profile';
import Comments from './pages/Dashboard/Comments';

import AdminDashboard from './superadmin/Dashboard';
import AdminAdmin from './superadmin/Admin';
import AdminStudent from './superadmin/Student';
import AdminUsers from './superadmin/Users';
import AdminLogs from './superadmin/AdminLogs';
import AdminPost from './superadmin/Post';
import AdminSettings from './superadmin/Settings';
import AdminComments from './superadmin/Comments';
import AdminMessage from './superadmin/Message';
import AdminGroupMessage from './superadmin/GroupMessage';
import AdminGroupChat from './superadmin/GroupChat';
import AdminStudentLogs from './superadmin/StudentLogs';
import AdminSystemLogs from './superadmin/SystemLogs';

axios.defaults.baseURL = 'http://localhost:8000';
//axios.defaults.baseURL = 'https://nupals-web.onrender.com';
//axios.defaults.baseURL = 'https://nupals-server.vercel.app'; 
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
      <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
      <Route path='/forgotpassword' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}/>
      <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
      <Route path='/settings' element={<PrivateRoute><Settings /></PrivateRoute>}/>
      <Route path='/student' element={<PrivateRoute><Student /></PrivateRoute>}/>
      <Route path='/post' element={<PrivateRoute><Post /></PrivateRoute>}/>
      <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
      <Route path='/comments' element={<PrivateRoute><Comments /></PrivateRoute>}/>
      <Route path='/template' element={<PrivateRoute><Template /></PrivateRoute>}/>
      
      <Route path='/super/dashboard' element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
      <Route path='/super/admin' element={<AdminPrivateRoute><AdminAdmin /></AdminPrivateRoute>} />
      <Route path='/super/student' element={<AdminPrivateRoute><AdminStudent /></AdminPrivateRoute>} />
      <Route path='/super/users' element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
      <Route path='/super/adminlogs' element={<AdminPrivateRoute><AdminLogs /></AdminPrivateRoute>} />
      <Route path='/super/studentlogs' element={<AdminPrivateRoute><AdminStudentLogs /></AdminPrivateRoute>} />
      <Route path='/super/post' element={<AdminPrivateRoute><AdminPost /></AdminPrivateRoute>} />
      <Route path='/super/settings' element={<AdminPrivateRoute><AdminSettings /></AdminPrivateRoute>} />
      <Route path='/super/comments' element={<AdminPrivateRoute><AdminComments /></AdminPrivateRoute>} />
      <Route path='/super/groupmessage' element={<AdminPrivateRoute><AdminGroupMessage /></AdminPrivateRoute>} />
      <Route path='/super/groupchat' element={<AdminPrivateRoute><AdminGroupChat /></AdminPrivateRoute>} />
      <Route path='/super/message' element={<AdminPrivateRoute><AdminMessage /></AdminPrivateRoute>} />
      <Route path='/super/systemlogs' element={<AdminPrivateRoute><AdminSystemLogs /></AdminPrivateRoute>} />
      </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
