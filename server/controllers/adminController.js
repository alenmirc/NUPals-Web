const Posts = require('../models/posting');
const User = require('../models/user');
const Log = require('../models/log'); // Import the Log model
const { hashPassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
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
        const { content } = req.body; // Destructure content from req.body

        // If there is a media file uploaded, use it
        const media = req.file ? req.file.buffer.toString('base64') : req.body.media; // Convert buffer to base64 if needed

        const updatedPost = await Posts.findByIdAndUpdate(postId, { content, media }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error.message);
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
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
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
  
module.exports = {
    getUsers,
    getAllpost,
    getLogs,
    editPost,
    adminDeletepost,
    updateUser,
    updateSAdminpassword,
    deleteUser,
    createUser
};
