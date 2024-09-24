import React, { useState, useContext, useEffect } from 'react';
import { Input, Button } from 'antd';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css'; 
import { UserContext } from '../../../context/userContext';

const Settings = () => {
  const { user } = useContext(UserContext);
  const userId = user?.id;

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for profile update
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [fileName, setFileName] = useState('');
  const [userData, setUserData] = useState(null);
  

  useEffect(() => {
    if (userId) {
      axios.get(`/getUserprofile?userId=${userId}`)
        .then(response => {
          console.log(response.data); // Log the userData received from the API
          setUserData(response.data);
          setFirstName(response.data.firstName || ''); // Ensure empty string if data is not available
          setLastName(response.data.lastName || ''); // Ensure empty string if data is not available

          setProfilePicture(response.data.profilePicture);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userId]);


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size;
    const maxSize = 10 * 1024 * 1024; // 10MB
  
    if (fileSize > maxSize) {
      toast.error('File size exceeds 10MB');
      return;
    }
    setFileName(file.name); // Set the file name

    const reader = new FileReader();
  
    reader.onload = () => {
      const base64 = reader.result;
      setBase64String(base64);
      setProfilePicture(file); // Set the profile picture here
    };
  
    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
    }
  };

  // Submit form to update profile details
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('profilePicture', base64String);
    
    try {
      const response = await axios.put('/updateprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Navigate to login page after a short delay
   
      toast.success('Profile updated successfully! Refreshing...');
      window.location.reload(); // Refresh the page after successful profile update
    } catch (error) {
      toast.error('Error updating profile!');
    }
  };


  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      await axios.put(`/updatesadminpassword`, {
        userId: user.id,
        currentPassword,
        newPassword,
      });

      toast.success('Password updated successfully!');
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
                <h3>Edit Profile</h3>
              </div>

              {/* Profile update form */}
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

            

                <Button type="primary" htmlType="submit">Update Profile</Button>
              </form>
              </div>

              
              {/* Password update form */}
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
