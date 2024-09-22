import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Modal, Input, Button } from 'antd';
import styles from './Login.module.css';
import { FiMail } from 'react-icons/fi'; // Importing icons from react-icons
import { Link, useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPasswordModalVisible, setNewPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/requestotp', { email });
      toast.success('OTP sent to your email.');
      setOtpModalVisible(true); // Show the OTP modal
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await axios.post('/verifyotp', { email, otp, password: newPassword });
      toast.success('OTP verified successfully. Please set a new password.');
      setOtpModalVisible(false);
      setNewPasswordModalVisible(true);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  const handlePasswordSubmit = async () => {

    if (newPassword.length < 6) {
        toast.error('Password is required and should be at least 6 characters long');
        return;
      }
      
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
    await axios.post('/verifyotp', { email, password: newPassword });
    toast.success('Password reset successful. Redirecting to login...');
    setOtpModalVisible(false);
    setNewPasswordModalVisible(false); // Close new password modal

    // Navigate to login page after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Adjust the delay as needed
  } catch (error) {
    console.error('Error verifying OTP:', error);
    const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
    toast.error(errorMessage);
  }
};

  return (
    <>

    
    <div className={styles.container}>
        <div className={styles['container-form']}>
          <h3   className="text-center">Forgot Password?</h3>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<FiMail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: '25px' }} // Add margin-bottom to create space
              />
              
            </div>
           
            <Button type="primary" htmlType="submit" block>
              Send OTP
            </Button>
          </form>
          <div className={styles.dont}>
                    <p><Link to="/login"><span>Go back to Login</span></Link></p>
                </div>
        </div>
      <Modal
        title="Enter OTP"
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleOtpSubmit}>
          Verify OTP
        </Button>
      </Modal>

      <Modal
        title="Set New Password"
        open={newPasswordModalVisible}
        onCancel={() => setNewPasswordModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handlePasswordSubmit}>
          Reset Password
        </Button>
      </Modal>
    </div>

    </>
  );
};

export default ForgotPassword;
