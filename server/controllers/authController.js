const User = require('../models/user');
const { hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken');
const Log = require('../models/log');
const test = (req, res) => {
    res.json('test is working');
};

// REGISTER ENDPOINT DITO
const registerUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
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
        roles: ['admin'], // Default role is 'admin'
      });
  
      // LOG SUCCESSFUL REGISTRATION
      await Log.create({
        level: 'info',
        message: `New user registered: ${email}`,
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

  

//LOGIN
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

    // GENERATE JWT TOKEN
    jwt.sign(
      { email: user.email, id: user._id, firstName: user.firstName, lastName: user.lastName, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ error: 'Token generation failed' });
        }
        res.cookie('token', token, {
          httpOnly: true, // This should typically remain true for security
          secure: false, // Set to false during development; use true in production when using HTTPS
          sameSite: 'None', // Allows cross-origin requests, which is often needed in development
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      });

        // Respond with user data and role
        res.json({
          ...user.toObject(),
          role: user.roles.includes('superadmin') ? 'superadmin' : 'admin',
        });
      }
    );
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
        const user = req.user;  // This assumes you have a middleware setting req.user

        await Log.create({
            level: 'info',
            message: 'User logged out',
            adminId: user ? user._id : null,  // Use the user's ID if available
            adminName: user ? user.email : null  // Use the user's email if available
        });

        // Clear the token cookie
        res.cookie('token', '', { maxAge: 1 }).json('Logged out');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Failed to log out' });
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
    const { userId, firstName, lastName, department, skills, profilePicture } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.department = department || user.department;
      user.skills = skills ? JSON.parse(skills) : user.skills;
  
      // Update profile picture if provided
      if (profilePicture) {
        user.profilePicture = profilePicture || user.profilePicture;
        
      }
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
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
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    getUserprofile
};
