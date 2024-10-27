const mongoose = require('mongoose');
const Stopword = require('../models/stopwords');
const Log = require('../models/log'); // Import the Log model

// Get all stopwords
const getAllStopwords = async (req, res) => {
    try {
        const stopwords = await Stopword.find();
        res.status(200).json(stopwords);
    } catch (error) {
        console.error('Error fetching stopwords:', error);
        res.status(500).json({ message: 'Error fetching stopwords' });
    }
};

// Create new stopwords
const createStopword = async (req, res) => {
    const { words } = req.body; // Expecting an array of words
    try {
        // Ensure words is an array and filter out empty strings
        if (!Array.isArray(words) || words.length === 0) {
            return res.status(400).json({ message: 'No stopwords provided' });
        }

        // Check for existing stopwords and prepare new stopwords
        const existingStopwords = await Stopword.find({ word: { $in: words } });
        const existingWords = existingStopwords.map(stopword => stopword.word);
        
        // Filter out existing stopwords from the input
        const newWords = words.filter(word => !existingWords.includes(word));

        // If no new stopwords to add
        if (newWords.length === 0) {
            return res.status(400).json({ message: 'All provided stopwords already exist' });
        }

        // Save new stopwords
        const createdStopwords = await Stopword.insertMany(newWords.map(word => ({ word })));

        // Log the creation of the new stopwords in a single entry
        await Log.create({
            level: 'info',
            message: `Stopwords created: ${newWords.join(', ')}`, // Log all new stopwords
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(201).json(createdStopwords);
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error creating stopwords: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(400).json({ message: 'Error creating stopwords' });
    }
};

// Update an existing stopword
const updateStopword = async (req, res) => {
    const { id } = req.params;
    const { word } = req.body;
    try {
        const updatedStopword = await Stopword.findByIdAndUpdate(id, { word }, { new: true });

        // Log the update of the stopword
        await Log.create({
            level: 'info',
            message: `Stopword updated: ${word}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(200).json(updatedStopword);
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error updating stopword: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(400).json({ message: 'Error updating stopword' });
    }
};

// Delete a stopword
const deleteStopword = async (req, res) => {
    const { id } = req.params;
    try {
        await Stopword.findByIdAndDelete(id);

        // Log the deletion of the stopword
        await Log.create({
            level: 'info',
            message: `Stopword deleted with ID: ${id}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(204).send();
    } catch (error) {
        // Log the error
        await Log.create({
            level: 'error',
            message: `Error deleting stopword: ${error.message}`,
            adminId: req.user ? req.user.userId : null,
            adminName: req.user ? req.user.email : 'unknown',
        });

        res.status(500).json({ message: 'Error deleting stopword' });
    }
};


module.exports = {
    getAllStopwords,
    createStopword,
    updateStopword,
    deleteStopword,
};
