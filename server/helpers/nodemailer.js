const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use any email service provider
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: to, // receiver address
      subject: subject,
      html: html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS ? '*****' : 'Not Set'); // Don't log the actual password
  } catch (error) {
    console.error('Error sending OTP email:', error);
    console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS ? '*****' : 'Not Set'); // Don't log the actual password
  }
};

module.exports = sendEmail;
