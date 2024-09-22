const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../helpers/nodemailer');
const bcrypt = require('bcrypt');

// Request OTP
const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (e.g., 10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();

    // Send OTP via email
    const message = `Your OTP code is ${otp}. It expires in 10 minutes.`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>You requested a password reset for your account. Please use the following OTP to reset your password:</p>
        <h2 style="color: #ff6600;">${otp}</h2>
        <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        <p>Thanks,</p>
        <p>NUPals</p>
      `,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

//verifyotp
const verifyOtp = async (req, res) => {
    const { email, otp, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if OTP is valid and not expired
      if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordExpires) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
  
      // Clear OTP fields
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpires = undefined;
  
      // Save the user
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Error resetting password' });
    }
  };
  
module.exports = {
  requestOtp,
  verifyOtp,
};
