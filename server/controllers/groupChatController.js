const mongoose = require('mongoose');
const { GroupChat } = require('../models/groupChat');
const Log = require('../models/log'); // Import the Log model

// Controller for getting all group chats
const viewGroupChats = async (req, res) => {
  try {
    const groupChats = await GroupChat.find();
    res.status(200).json(groupChats);
  } catch (error) {
    console.error('Error fetching group chats:', error);
    res.status(500).json({ message: 'Server error while fetching group chats.' });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const newGroupChat = new GroupChat(req.body);
    await newGroupChat.save();

    // Log the action
    await Log.create({
      level: 'info', // You can change the level based on your logging strategy
      message: `Group chat created with title: ${newGroupChat.title}`,
      adminId: req.user._id, // Assuming req.user contains the logged-in user's data
      adminName: req.user.email, // Log the email of the admin/user
    });

    res.status(201).json(newGroupChat);
  } catch (error) {
    console.error('Error creating group chat:', error);
    res.status(500).json({ message: 'Error creating group chat' });
  }
};

const deleteGroupChat = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGroupChat = await GroupChat.findByIdAndDelete(id);
    if (!deletedGroupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Log the action
    await Log.create({
      level: 'warn', // Level can be changed as needed
      message: `Group chat deleted with title: ${deletedGroupChat.title}`,
      adminId: req.user._id,
      adminName: req.user.email,
    });

    res.status(200).json({ message: 'Group chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting group chat:', error);
    res.status(500).json({ message: 'Error deleting group chat' });
  }
};

const updateGroupChat = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedGroupChat = await GroupChat.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedGroupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Log the action
    await Log.create({
      level: 'info',
      message: `Group chat updated with title: ${updatedGroupChat.title}`,
      adminId: req.user._id,
      adminName: req.user.email,
    });

    res.status(200).json(updatedGroupChat);
  } catch (error) {
    console.error('Error updating group chat:', error);
    res.status(500).json({ message: 'Error updating group chat' });
  }
};

module.exports = { viewGroupChats, createGroupChat, deleteGroupChat, updateGroupChat };
