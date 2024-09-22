const Posts = require('../models/posting');
const User = require('../models/user');
const Log = require('../models/log'); // Import the Log model

// Function to get counts
const getCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Posts.countDocuments();
    const logCount = await Log.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const studentCount = await User.countDocuments({ role: 'student' });

    // Get today's date and start of the day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to 00:00:00.000

    // Count users registered today
    const todayStudentCount = await User.countDocuments({ createdAt: { $gte: startOfToday }, role: 'student' });
    const todayAdminCount = await User.countDocuments({ createdAt: { $gte: startOfToday }, role: 'admin' });
    const todayPostCount = await Posts.countDocuments({ createdAt: { $gte: startOfToday } });
    const todayLogCount = await Log.countDocuments({ createdAt: { $gte: startOfToday } });


    res.status(200).json({
      totalUsers: userCount,
      totalStudent: studentCount,
      totalAdmin: adminCount,
      totalPosts: postCount,
      totalLogs: logCount,

      newStudentToday: todayStudentCount,
      newAdminsToday: todayAdminCount,
      newPostsToday: todayPostCount,
      newLogsToday: todayLogCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving counts' });
  }
};


//getLoggedInUsersCount
const getLoggedInUsersCount = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of the day
  
      const counts = await Log.aggregate([
        {
          $match: {
            message: "User logged in", // Adjust based on your log message
            timestamp: { $gte: today },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
      ]);
  
      res.status(200).json(counts);
    } catch (error) {
      console.error('Error retrieving logged-in users count:', error);
      res.status(500).json({ message: 'Error retrieving logged-in users count' });
    }
  };


module.exports = { getCounts, getLoggedInUsersCount };
