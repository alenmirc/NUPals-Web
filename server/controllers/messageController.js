const mongoose = require('mongoose');
const Message = require('../models/message'); // Import your Message model
const User = require('../models/user'); // Import your User model
const Log = require('../models/log'); // Import the Log model
const { GroupChatMessage, GroupChat } = require('../models/groupChat');

// Get messages and include sender and receiver emails
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // Sort by message creation time, newest first

        const formattedMessages = await Promise.all(messages.map(async message => {
            // Fetch sender and receiver emails using their IDs
            const sender = await User.findById(message.senderId).select('email');
            const receiver = await User.findById(message.receiverId).select('email');

            return {
                _id: message._id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                senderEmail: sender ? sender.email : 'Unknown',
                receiverEmail: receiver ? receiver.email : 'Unknown',
                createdAt: message.createdAt,
                updatedAt: message.updatedAt
            };
        }));

        res.json({ messages: formattedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
    const { messageId } = req.params; // Extract the message ID from the request parameters

    try {
        // Check if the message exists
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Log the deletion action
    await Log.create({
        level: 'info',
        message: `Deleted Message with ID ${messageId}`,
        adminId: req.user._id,
        adminName: req.user.email,
      });
        // Delete the message
        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user ID by email

const getUserIdByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ userId: user._id });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Log legal reason route
const logLegalReason = async (req, res) => {
    const { legalReason, senderEmail, receiverEmail } = req.body;
    const user = req.user; // Get the authenticated user
  
    try {
      // Log the action
      await Log.create({
        level: 'warn',
        message: `Superadmin accessed ${senderEmail} and ${receiverEmail} with legal reason: ${legalReason}`,
        adminId: user._id, // Log the ID of the user making the change
        adminName: user.email, // Log the email of the admin/user
      });
  
      res.status(200).json({ message: 'Legal reason logged successfully.' });
    } catch (error) {
      console.error('Error logging legal reason:', error);
      res.status(500).json({ message: 'Error logging legal reason' });
    }
  };
  

// Fetch messages for a specific group chat
const fetchGroupMessages = async (req, res) => {
    try {
        const messages = await GroupChatMessage.find({ groupId: req.params.groupId })
            .populate('senderId', 'email') // Populate sender's email
            .sort({ createdAt: -1 }); // Sort by timestamp

              // Log the action for fetching group messages
        await Log.create({
            level: 'info',
            message: `Fetched messages for Group Chat with ID ${req.params.groupId}`,
            adminId: req.user._id, // Assuming you're using authentication
            adminName: req.user.email, // Log the admin's email or name
        });
        
        res.json({ messages });
    } catch (error) {
        console.error('Error fetching group chat messages:', error);
        res.status(500).json({ message: 'Error fetching group chat messages' });
    }
};


// Fetch all group chats
const fetchAllGroupChats = async (req, res) => {
    try {
        const groupChats = await GroupChat.find(); // No need to populate members since it doesn't exist

        res.json({ groupChats });
    } catch (error) {
        console.error('Error fetching group chats:', error.message); // Log the error message
        res.status(500).json({ message: 'Error fetching group chats', error: error.message }); // Return the error message
    }
};

const deleteGroupMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        // Find the message by its ID and delete it
        const deletedMessage = await GroupChatMessage.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

    // Log the deletion action
    await Log.create({
        level: 'info',
        message: `Deleted a Group Message with ID ${messageId}`,
        adminId: req.user._id,
        adminName: req.user.email,
      });
        // If message was successfully deleted
        return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ error: 'Server error while deleting message' });
    }
};

module.exports = { getMessages, deleteMessage, getUserIdByEmail, logLegalReason, fetchGroupMessages,
    fetchAllGroupChats, deleteGroupMessage };
