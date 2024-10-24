const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  isRead: { type: Boolean, default: false }, // New field to track read status
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;
