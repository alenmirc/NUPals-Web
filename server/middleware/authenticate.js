const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model

// Middleware to authenticate and populate req.user
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming token is in cookies

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Set user in request object
        req.user = user;

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
