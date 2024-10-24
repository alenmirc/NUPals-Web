

const Feedback = require('../models/feedback'); // Your Feedback model
const Report = require('../models/report');     // Your Report model

// Controller function to get the feedback and report counts
const getfeedbackreportcount = async (req, res) => {
    try {
     // Count feedback documents where isRead is null
     const feedbackCount = await Feedback.countDocuments({ isRead: null });

     // Count report documents where resolved is null
     const reportCount = await Report.countDocuments({ resolved: null });

        // Return the counts as JSON
        res.status(200).json({
            feedbackCount,
            reportCount
        });
    } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getfeedbackreportcount
};
