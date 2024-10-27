const mongoose = require('mongoose');
const Keywords = require('../models/keywords');
const Log = require('../models/log'); // Import the Log model

// Create a new keyword
const createKeyword = async (req, res) => {
    const { keyword } = req.body;
    try {
        const newKeyword = new Keywords({ keyword });
        await newKeyword.save();
        
        // Log the creation of the new keyword
        await Log.create({
            level: 'info', // Use 'info' for successful operations
            message: `Keyword created: ${keyword}`,
            adminId: req.user ? req.user.userId : null, // Assuming userId is stored in req.user
            adminName: req.user ? req.user.email : 'unknown', // Using admin's email
        });

        res.status(201).json(newKeyword);
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error creating keyword: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(400).json({ message: error.message });
    }
};

// Get all keywords
const getKeywords = async (req, res) => {
    try {
        const keywords = await Keywords.find();
        res.json(keywords);
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error retrieving keywords: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(500).json({ message: error.message });
    }
};

// Update a keyword
const updateKeyword = async (req, res) => {
    const { keyword } = req.body;
    try {
        const updatedKeyword = await Keywords.findByIdAndUpdate(req.params.id, { keyword }, { new: true });

        // Log the update of the keyword
        await Log.create({
            level: 'info',
            message: `Keyword updated: ${keyword}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.json(updatedKeyword);
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error updating keyword: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(400).json({ message: error.message });
    }
};

// Delete a keyword
const deleteKeyword = async (req, res) => {
    try {
        await Keywords.findByIdAndDelete(req.params.id);

        // Log the deletion of the keyword
        await Log.create({
            level: 'info',
            message: `Keyword deleted with ID: ${req.params.id}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(204).send();
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error deleting keyword: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(500).json({ message: error.message });
    }
};

// Export the functions as an object
module.exports = {
    createKeyword,
    getKeywords,
    updateKeyword,
    deleteKeyword,
};
