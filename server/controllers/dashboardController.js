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


module.exports = { getCounts, getLoggedInUsersCount, getNewUsersOvertime, getMostLikedPosts, getMostCommentedPosts, getEngagementMetrics };
