const UpdateModel = require('../models/updates');

// Controller to get all updates
const getUpdates = async (req, res) => {
  try {
    const updates = await UpdateModel.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching updates' });
  }
};

// Controller to create an update
const createUpdate = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description || !link) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newUpdate = new UpdateModel({ title, description, link });
    await newUpdate.save();

    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ error: 'Error creating update' });
  }
};

// Controller to delete an update
const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const update = await UpdateModel.findByIdAndDelete(id);

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    res.status(200).json({ message: 'Update deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting update' });
  }
};

module.exports = {
  getUpdates,
  createUpdate,
  deleteUpdate,
};
