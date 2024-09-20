const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');  // Missing CORS import
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();

// Apply CORS middleware globally, using CLIENT_URL from .env
app.use(cors({
  credentials: true,
  origin: process.env.CORS_ORIGIN // Make sure you set this in your .env file
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
})
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('Database connection error:', err));

// Middleware
app.use(express.json());  // Handle JSON payloads
app.use(express.urlencoded({ extended: false }));  // Handle URL-encoded payloads
app.use(cookieParser());  // Parse cookies

// Routes
app.use('/', require('./routes/authRoutes'));  // Load your routes

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
