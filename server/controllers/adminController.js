const Posts = require('../models/posting');
const User = require('../models/user');
const Log = require('../models/log'); // Import the Log model
const studentLogs = require('../models/studentlogs'); 
const { hashPassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//UPDATE SUPER ADMIN PASSWORD
const updateSAdminpassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        await Log.create({
          level: 'warn',
          message: `Failed password update attempt for ${user.email}: current password incorrect`,
          adminId: user._id,
          adminName: user.email,
        });
         
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
       // Log the password update action
    await Log.create({
      level: 'info',
      message: `Password updated for ${user.email}`,
      adminId: user._id, // Log the user's ID who is updating the password
      adminName: user.email, // Log the email of the admin making the change
    });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
    // Log the error
    await Log.create({
      level: 'error',
      message: 'Error updating password ',
      adminId: userId || 'Unknown', // If user is not available, log the userId from the request
      adminName: user ? user.email : 'Unknown', // Log the email if the user exists, otherwise 'Unknown'
      error: error.message, // Log the error message
    });

    res.status(500).json({ message: 'Internal server error' });
  }
};
  

//GET ALL USERS

const getUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find();
      
      // Return the fetched users as a response
      res.json(users);
    } catch (error) {
      // Handle errors
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

//GET ALL Post

const getAllpost = async (req, res) => {
    try {
        // Fetch all posts from the database
        const posts = await Posts.find().populate('userId', 'firstName lastName email'); // Populate userId with first and last names

        // Return the fetched posts as a response
        res.json(posts);
    } catch (error) {
        // Handle errors
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//EDIT POST

const editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, content } = req.body; // Destructure content from req.body

// Find the user by ID
const user = await User.findById(userId);

        // If there is a media file uploaded, use it
        const media = req.file ? req.file.buffer.toString('base64') : req.body.media; // Convert buffer to base64 if needed

        const updatedPost = await Posts.findByIdAndUpdate(postId, { content, media }, { new: true });
        if (!updatedPost) {
          
            return res.status(404).json({ message: 'Post not found' });
        }

  // Log successful post edit
  await Log.create({
    level: 'info',
    message: `Edited post with ID ${postId}`,
    adminId: user._id, // Log the ID of the user making the change
    adminName: user.email, // Log the email of the admin/user
  });

        
        res.status(200).json(updatedPost);
    } catch (error) {
      // Log the error
      await Log.create({
        level: 'error',
        message: `Error editing post with ID ${postId}`,
        adminId: user ? user._id : 'unknown', // Log the user's ID if available
        adminName: user ? user.email : 'unknown', // Log the email if available
        error: error.message, // Log the error message
      });
  
      res.status(500).json({ message: 'Error editing post', error });
    }
  };



// DELETEPOST
const adminDeletepost = async (req, res) => {
    try {
      const postId = req.params.postId; // Get the post ID from the request parameters
  
      // Find the post by ID and delete it
      const deletedPost = await Posts.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }


        // Log the user's ID and email before logging the deletion action
        console.log(`User ID: ${req.user._id}, User Email: ${req.user.email}`);


      // Log the deletion action
      await Log.create({
        level: 'info',
        message: `Post with ID ${postId} deleted by ${req.user.email}`, // Log the deletion action
        adminId: req.user._id, // Log the ID of the user deleting the post
        adminName: req.user.email, // Log the email of the user deleting the post
    });
  
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'An error occurred while deleting the post' });
    }
  };


// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...otherData } = req.body;

    // If the password field is provided, hash it before updating the user
    if (password) {
      const hashedPassword = await hashPassword(password);
      otherData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, otherData, { new: true });

    // Log the update action
    await Log.create({
      level: 'info',
      message: `User with ID ${id} updated`, // Log the user update action
      adminId: req.user._id, // Log the ID of the user performing the update
      adminName: req.user.email, // Log the email of the user performing the update
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};



// Delete a user
const deleteUser = async (req, res) => {
  try {
      const { id } = req.params;

      // Log the deletion action
      await Log.create({
          level: 'info',
          message: `User with ID ${id} deleted`, // Log the user deletion action
          adminId: req.user._id, // Log the ID of the user performing the deletion
          adminName: req.user.email, // Log the email of the user performing the deletion
      });

      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user', error });
  }
};


// Create a new user
const createUser = async (req, res) => {
    try {
        // Hash the password from the request body
        const hashedPassword = await hashPassword(req.body.password);
        console.log('Received password:', req.body.password);

        // Create a new user with the hashed password
        const newUser = new User({
            ...req.body,
            password: hashedPassword // Use the hashed password instead
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// GET LOGS
const getLogs = async (req, res) => {
  try {
      // Fetch all logs from the database
      const logs = await Log.find().sort({ timestamp: -1 }); // Sort logs by timestamp in descending order

      // Return the fetched logs as a response
      res.json(logs);
  } catch (error) {
      // Handle errors
      console.error('Error fetching logs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// GET STUDEnT LOGS
const getStudentLogs = async (req, res) => {
  try {
      // Fetch all logs from the database
      const logs = await studentLogs.find().sort({ timestamp: -1 }); // Sort logs by timestamp in descending order

      // Return the fetched logs as a response
      res.json(logs);
  } catch (error) {
      // Handle errors
      console.error('Error fetching logs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  
module.exports = {
    getUsers,
    getAllpost,
    getLogs,
    getStudentLogs,
    editPost,
    adminDeletepost,
    updateUser,
    updateSAdminpassword,
    deleteUser,
    createUser
};
