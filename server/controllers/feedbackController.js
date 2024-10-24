const Feedback = require('../models/feedback'); // Assuming you have a Feedback model

// Create feedback
const createFeedback = async (req, res) => {
  const { userId, message, timestamp } = req.body;

  const feedback = new Feedback({ userId, message, timestamp });
  try {
    await feedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to submit feedback' });
  }
};

// Get all feedback ordered by newest first
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 }); // Sort by timestamp in descending order
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch feedback' });
  }
};

// Mark feedback as read
const markFeedbackAsRead = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!feedback) {
      return res.status(404).send({ error: 'Feedback not found' });
    }
    res.status(200).send({ message: 'Feedback marked as read!', feedback });
  } catch (error) {
    res.status(500).send({ error: 'Failed to mark feedback as read' });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  markFeedbackAsRead,
};
