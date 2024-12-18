const Posts = require('../models/posting');
const User = require('../models/user');
const Log = require('../models/log'); // Import the Log model
const studentlogs = require('../models/studentlogs');
const surveyResponse = require('../models/surveyResponse');
const Feedback = require('../models/feedback'); // Your Feedback model
const Report = require('../models/report');     // Your Report model


// Function to get counts
const getCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Posts.countDocuments();
    const logCount = await Log.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const studentCount = await User.countDocuments({ role: 'student' });
    const feedbackCount = await Feedback.countDocuments();
    const reportCount = await Report.countDocuments();

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
      totalReport: reportCount,
      totalFeedback: feedbackCount,

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


  //get new users overtime

  const getNewUsersOvertime = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } // Group by date
          },
          count: { $sum: 1 } // Count users
        }
      },
      {
        $sort: { _id: 1 } // Sort by date
      }
    ]);

    // Format the result for the front-end
    const formattedResult = result.map(item => ({
      date: item._id,
      newUsers: item.count
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching new users over time:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//getMostLikedPosts

const getMostLikedPosts = async (req, res) => {
  try {
    const mostLikedPosts = await Posts.aggregate([
      {
        $project: {
          content: 1,
          media: 1,
          userId: 1,
          createdAt: 1,
          likesCount: { $size: { $ifNull: ["$likes", []] } } // Calculate the number of likes
        }
      },
      { 
        $sort: { likesCount: -1 } // Sort by likes count in descending order
      },
      { 
        $limit: 10 // Limit to 10 posts
      },
      {
        $lookup: {
          from: 'users', // Replace with the actual collection name for users
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: { 
          path: '$userInfo', 
          preserveNullAndEmptyArrays: true // Optional: to keep posts without user info
        }
      },
      {
        $project: {
          content: 1,
          media: 1,
          createdAt: 1,
          likesCount: 1,
          userId: { 
            firstName: '$userInfo.firstName', 
            lastName: '$userInfo.lastName' 
          }
        }
      }
    ]);

    return res.status(200).json(mostLikedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching most liked posts' });
  }
};


//getMostCommentedPosts

const getMostCommentedPosts = async (req, res) => {
  try {
    const mostCommentedPost = await Posts.aggregate([
      {
        $project: {
          content: 1,
          media: 1,
          userId: 1,
          createdAt: 1,
          comments: 1,
          commentsCount: {
            $cond: {
              if: { $isArray: "$comments" }, // Check if comments is an array
              then: { $size: "$comments" }, // Get size if it's an array
              else: 0 // Return 0 if it's not an array or doesn't exist
            }
          }
        }
      },
      { $sort: { commentsCount: -1 } }, // Sort by comments count descending
      { $limit: 1 } // Limit to the top post
    ]);

    if (mostCommentedPost.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    // Populate userId field to get user details
    const postWithUserDetails = await Posts.populate(mostCommentedPost, { path: 'userId', select: 'firstName lastName' });

    return res.status(200).json(postWithUserDetails);
  } catch (error) {
    console.error('Error fetching the most commented post:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//get Engagement Metrics
const getEngagementMetrics = async (req, res) => {
  try {
    const metrics = await Posts.aggregate([
      {
        $project: {
          content: 1,
          media: 1,
          userId: 1,
          createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Format date
          likesCount: { $size: { $ifNull: ["$likes", []] } }, // Count likes
          commentsCount: { $size: { $ifNull: ["$comments", []] } }, // Count comments
        },
      },
      {
        $group: {
          _id: "$createdAt", // Group by date
          totalLikes: { $sum: "$likesCount" }, // Sum likes per date
          totalComments: { $sum: "$commentsCount" }, // Sum comments per date
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    return res.status(200).json(metrics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching engagement metrics' });
  }
};

// Get daily active users
const getDailyActiveUsers = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - 6)); // Start date for the last 7 days
    startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    const logs = await studentlogs.find({
      timestamp: { $gte: startOfWeek, $lte: endOfDay },
      message: 'User logged in'
    });

    // Extract unique user IDs per day
    const activeUsersByDay = {};

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const day = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

      if (!activeUsersByDay[day]) {
        activeUsersByDay[day] = new Set(); // Create a Set to store unique user IDs for the day
      }
      activeUsersByDay[day].add(log.studentId.toString());
    });

    // Create a report of daily active users
    const weeklyReport = Object.keys(activeUsersByDay).map(day => ({
      date: day,
      activeUsers: activeUsersByDay[day].size // Number of unique active users
    }));

    res.json({ weeklyActiveUsers: weeklyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//surveyresponse top interest categories
// Get top 3 specific interests and top 3 categories
const getTopInterestsAndCategories = async (req, res) => {
  try {
    // Aggregate the survey responses to count occurrences of each interest and category
    const results = await surveyResponse.aggregate([
      {
        $unwind: '$analysisResult.specificInterests',
      },
      {
        $group: {
          _id: '$analysisResult.specificInterests',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3 ,
      },
    ]);

    const topSpecificInterests = results.map(result => result._id);

    const categoryResults = await surveyResponse.aggregate([
      {
        $unwind: '$analysisResult.topCategories',
      },
      {
        $group: {
          _id: '$analysisResult.topCategories',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    const topCategories = categoryResults.map(result => result._id);

    res.json({ specificInterests: topSpecificInterests, topCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCounts, getLoggedInUsersCount, getNewUsersOvertime, getMostLikedPosts, getMostCommentedPosts, getEngagementMetrics, getDailyActiveUsers, getTopInterestsAndCategories  };
