import React, { useState, useContext } from 'react';
import { Input, Button } from 'antd';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css'; 
import { UserContext } from '../../context/userContext';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user } = useContext(UserContext);
 
  const handlePasswordUpdate = async () => {
    // Validation checks
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
 
      // Sending PUT request to update the password
      await axios.put(`/updatesadminpassword`, {
        userId: user.id, // Pass the user ID from the context or state
        currentPassword,
        newPassword,
        
      });

      toast.success('Password updated successfully!');
      // Clear the fields after successful password update
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Settings</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Settings</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Edit Password</h3>
              </div>

              <div className="form-group">
            <label>Current Password</label>
            <Input.Password
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

              <Button type="primary" onClick={handlePasswordUpdate}>Update Password</Button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Settings;
