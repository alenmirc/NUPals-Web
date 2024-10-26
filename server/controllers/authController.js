const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');
const Log = require('../models/log');
const test = (req, res) => {
    res.json('test is working');
};

  // REGISTER ENDPOINT DITO (NEW USER CREATE BY SUPERADMIN)
  const registerUser = async (req, res) => {
      try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
    
        // CHECK IF FIRST NAME IS PROVIDED
        if (!firstName) {
          return res.json({ error: 'First Name is required' });
        }
    
        // CHECK IF LAST NAME IS PROVIDED
        if (!lastName) {
          return res.json({ error: 'Last Name is required' });
        }
    
        // CHECK IF PASSWORD IS VALID
        if (!password || password.length < 6) {
          return res.json({ error: 'Password is required and should be 6 characters long' });
        }
    
        if (password !== confirmPassword) {
          return res.json({ error: 'Passwords do not match' });
      }
        // CHECK IF EMAIL ALREADY EXISTS
        const exist = await User.findOne({ email });
        if (exist) {
          await Log.create({
            level: 'warn',
            message: `Failed registration attempt - email already taken`,
            adminId: null, // No user ID since the registration failed
            adminName: email, // Log the email used for the registration attempt
          });
          return res.json({ error: 'Email is already taken' });
        }
    
        // HASH PASSWORD
        const hashedPassword = await hashPassword(password);
    
        // CREATE NEW USER IN DATABASE
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'admin', // Default role is 'admin'
        });
    
        // LOG SUCCESSFUL REGISTRATION
        await Log.create({
          level: 'info',
          message: `New admin account created by superadmin`,
          adminId: user._id, // Log the newly created user's ID
          adminName: email,  // Log the user's email
        });
    
        return res.json(user);
      } catch (error) {
        // LOG SERVER ERROR
        await Log.create({
          level: 'error',
          message: 'Internal server error during registration',
          adminId: null, // No specific admin ID for system errors
          adminName: 'unknown', // Log as 'unknown' since the error may not be tied to a specific user
        });
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

    const createStudent = async (req, res) => {
      try {
        const { firstName, lastName, email, username, password, confirmPassword } = req.body;
    
        // CHECK IF FIRST NAME IS PROVIDED
        if (!firstName) {
          return res.json({ error: 'First Name is required' });
        }
    
        // CHECK IF LAST NAME IS PROVIDED
        if (!lastName) {
          return res.json({ error: 'Last Name is required' });
        }
    
        // CHECK IF USERNAME IS VALID
        if (!username) {
          return res.json({ error: 'Username is required' });
        }
    
        // CHECK IF PASSWORD IS VALID
        if (!password || password.length < 6) {
          return res.json({ error: 'Password is required and should be 6 characters long' });
        }
    
        if (password !== confirmPassword) {
          return res.json({ error: 'Passwords do not match' });
        }
    
        // CHECK IF EMAIL ALREADY EXISTS
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          await Log.create({
            level: 'warn',
            message: `Failed create Student attempt - email already taken`,
            adminId: null,
            adminName: req.user.email,
          });
          return res.json({ error: 'Email is already taken' });
        }
    
        // CHECK IF USERNAME ALREADY EXISTS
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          await Log.create({
            level: 'warn',
            message: `Failed create Student attempt - username already taken`,
            adminId: null,
            adminName: req.user.email,
          });
          return res.json({ error: 'Username is already taken' });
        }
    
        // HASH PASSWORD
        const hashedPassword = await hashPassword(password);
    
        // CREATE NEW USER IN DATABASE
        const user = await User.create({
          firstName,
          lastName,
          email,
          username, // Add the username to the new user
          password: hashedPassword,
          role: 'student', // Default role is 'student'
        });
    
        // LOG SUCCESSFUL REGISTRATION
        await Log.create({
          level: 'info',
          message: `New student account created by superadmin`,
          adminId: req.user._id,
          adminName: req.user.email,
        });
    
        return res.json(user);
      } catch (error) {
        // LOG SERVER ERROR
        await Log.create({
          level: 'error',
          message: 'Internal server error during create student',
          adminId: req.user._id,
          adminName: req.user.email,
        });
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    

  
// LOGIN DITO
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK IF USER EXISTS
    const user = await User.findOne({ email });
    if (!user) {
      await Log.create({
        level: 'warn',
        message: 'Failed login attempt - no user found',
        adminId: null, // No user ID since user was not found
        adminName: email, // Log the email used for login attempt
      });
      return res.json({ error: 'No user Found' });
    }

    // CHECK IF PASSWORD MATCHES
    const match = await comparePassword(password, user.password);
    if (!match) {
      await Log.create({
        level: 'warn',
        message: 'Failed login attempt - password mismatch',
        adminId: user._id, // Log the user's ID
        adminName: user.email, // Log the email
      });
      return res.json({ error: 'Password does not match' });
    }

    // CHECK IF ROLE IS ADMIN OR SUPERADMIN
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      await Log.create({
        level: 'warn',
        message: 'Failed login attempt - not authorized',
        adminId: user._id, // Log the user's ID
        adminName: user.email, // Log the email
      });
      return res.json({ error: 'User Not authorized' });
    }

    // GENERATE JWT TOKEN
    jwt.sign(
      { email: user.email, id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '120m' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ error: 'Token generation failed' });
        }
        res.cookie('token', token, {
          httpOnly: true, // This should typically remain true for security
          secure: true, // Set to false during development; use true in production when using HTTPS
          sameSite: 'Lax', // Allows cross-origin requests, which is often needed in development
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        
        // Respond with user data and role
        res.json({
          ...user.toObject(),
          role: user.role === 'superadmin' ? 'superadmin' : 'admin',
        });
      }
    );

    await Log.create({
      level: 'info',
      message: 'User logged in',
      adminId: user._id, // Log the user's ID
        adminName: user.email, // Log the email
    });

  } catch (error) {
    await Log.create({
      level: 'error',
      message: 'Internal server error during login',
      adminId: null, // No specific admin ID for system errors
      adminName: 'unknown', // Log as 'unknown' since the error may not be tied to a specific user
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};


// LOGOUT ENDPOINT
const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.cookie('token', '', { 
      maxAge: 1, 
      httpOnly: true,  // Same as when the token was set
      secure: true,    // Ensure this matches (for HTTPS)
      sameSite: 'None', // Match sameSite policy
      path: '/'        // Ensure the path is correct
    });

    // Log the logout action
    await Log.create({
      level: 'info',
      message: 'User logged out',
      adminId: req.user._id, // Log the user's ID, assuming you're using req.user for authentication
      adminName: req.user.email, // Log the email
    });

    // Send the response
    return res.json({ message: 'Logged out' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ message: 'Error logging out' });
  }
};

  

//GET PROFILE

const getProfile = (req, res) => {
  const {token} = req.cookies
  if(token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
          if(err) throw err;
          res.json(user)
      })
  } else {
      res.json(null)
  }
}
// Update profile function
const updateProfile = async (req, res) => {
    const { userId, firstName, lastName, profilePicture } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
  
  
      // Update profile picture if provided
      if (profilePicture) {
        user.profilePicture = profilePicture || user.profilePicture;
        
      }
  
      await user.save();

    // Log the profile update action
    await Log.create({
      level: 'info',
      message: `Profile updated for user ${user.email}`,
      adminId: user._id, // Log the user's ID
      adminName: user.email, // Log the email
    });


      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
    // Log the error
    await Log.create({
      level: 'error',
      message: 'Error updating profile',
      adminId: user._id, // Log the user's ID if available
      adminName: user.email, // Log the email if available
      error: error.message, // Log the error message
    });

    res.status(500).json({ message: 'Error updating profile', error });
  }
};

//get userprofile
const getUserprofile = async (req, res) => {
    try {
      const { userId } = req.query; // Get userId from query parameters
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const user = await User.findById(userId).select('firstName lastName email department skills profilePicture'); // Find user by ID
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving user profile' });
    }
  };
  

    

module.exports = {
    test,
    registerUser,
    createStudent,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    getUserprofile
};
