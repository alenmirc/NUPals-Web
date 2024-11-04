const express = require('express');
const router = express.Router();
const { test, registerUser, createStudent, loginUser, logoutUser, getProfile, updateProfile, getUserprofile} = require('../controllers/authController');
const { createUserPosting, getPost, getPostbyid, deletePost, deleteComment, getPostWithComments, getComments } = require('../controllers/userPostingController');
const { getUsers, getAllpost, adminDeletepost, editPost, updateUser, createUser, deleteUser, updateSAdminpassword,  getLogs, getStudentLogs  } = require('../controllers/adminController');
const { getMessages, deleteMessage, getUserIdByEmail, logLegalReason, fetchGroupMessages, fetchAllGroupChats, deleteGroupMessage } = require('../controllers/messageController');
const { viewGroupChats, createGroupChat, updateGroupChat, deleteGroupChat } = require('../controllers/groupChatController');
const { createKeyword, getKeywords, updateKeyword, deleteKeyword} = require('../controllers/keywordsController');
const { getAllStopwords,createStopword,updateStopword,deleteStopword} = require('../controllers/stopwordsController');
const { getReports, resolveReport } = require('../controllers/reportsController');
const {createFeedback, getFeedbacks, markFeedbackAsRead,} = require('../controllers/feedbackController'); // Import the controller functions
const { getfeedbackreportcount } = require('../controllers/barController');
const { requestOtp, verifyOtp } = require('../controllers/resetPassword');
const { getCounts, getLoggedInUsersCount, getNewUsersOvertime, getMostLikedPosts, getMostCommentedPosts, getEngagementMetrics, getDailyActiveUsers, getTopInterestsAndCategories } = require('..//controllers/dashboardController'); // Adjust path as needed
const { getUpdates, createUpdate, deleteUpdate} = require('../controllers/updatesController');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../middleware/authenticate');

//Body parser Setup
router.use(bodyParser.json({ limit: '50mb' }));

// Define storage for multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10 // 10 MB limit for field size
  }
});

//usercontroller
router.get('/', test);
router.post('/register', registerUser); 
router.post('/createStudent', authenticate, createStudent); 
router.post('/login', loginUser)
router.post('/logout', authenticate, logoutUser)
router.get('/profile', getProfile)
router.put('/updateprofile', upload.single('profilePicture'), updateProfile);
router.get('/getUserprofile', getUserprofile);

//posting controller
router.post('/createuserposting', upload.single('media'), authenticate, createUserPosting);
router.get('/getpost', getPost);
router.get('/getpostbyid', getPostbyid);
router.delete('/deletepost/:postId', authenticate, deletePost);
router.delete('/deletecomment/:commentId', authenticate, deleteComment);
router.get('/getpostwithcomments', getPostWithComments);
router.get('/getcomments/:postId', getComments);

//admin controller
router.get('/getusers', getUsers);
router.get('/getallpost', getAllpost);
router.put('/editpost/:postId', upload.single('media'), editPost);
router.delete('/admindeletepost/:postId', authenticate, adminDeletepost);
router.put('/updateuser/:id', authenticate, updateUser);
router.delete('/deleteuser/:id',  authenticate, deleteUser);
router.post('/createuser',  createUser);
router.put('/updatesadminpassword', updateSAdminpassword);
router.get('/getlogs', getLogs);
router.get('/getstudentlogs', getStudentLogs);

//reports controller
router.get('/getreports', getReports);
router.put('/reports/:id/resolve', resolveReport);

//feedback controller
router.post('/createfeedback', createFeedback);
router.get('/getfeedback', getFeedbacks);
router.put('/feedbackmark-as-read/:id', markFeedbackAsRead);

//get count
router.get('/getFeedbackReportCount', getfeedbackreportcount);

//group chats
router.get('/viewGroupChats', viewGroupChats);
router.post('/createGroupChat', authenticate, createGroupChat);
router.put('/updateGroupChat/:id', authenticate, updateGroupChat);
router.delete('/deleteGroupChat/:id', authenticate, deleteGroupChat);

//multi-keywords
router.post('/createKeyword', authenticate, createKeyword);
router.get('/viewKeywords', getKeywords);
router.put('/updateKeyword/:id', authenticate, updateKeyword);
router.delete('/deleteKeyword/:id', authenticate, deleteKeyword);

// Stopword routes
router.post('/createStopword', authenticate, createStopword);
router.get('/viewStopwords', getAllStopwords);
router.put('/updateStopword/:id', authenticate, updateStopword);
router.delete('/deleteStopword/:id', authenticate, deleteStopword);

//messagesController
router.get('/getmessages', getMessages);
router.delete('/deletemessage/:messageId', authenticate, deleteMessage);
router.get('/getUserIdByEmail', getUserIdByEmail);
router.post('/logLegalReason', authenticate, logLegalReason);
router.get('/groupMessages/:groupId', authenticate, fetchGroupMessages);
router.get('/groupChats', fetchAllGroupChats);
router.delete('/deleteGroupMessage/:messageId', authenticate, deleteGroupMessage);

//resetPassword controller
router.post('/requestotp', requestOtp);
router.post('/verifyotp', verifyOtp);


//dasboardController like counts
router.get('/counts', getCounts);
router.get('/getloggedin', getLoggedInUsersCount);
router.get('/newusersovertime', getNewUsersOvertime);
router.get('/getmostlikedposts', getMostLikedPosts);
router.get('/getmostcommentedposts', getMostCommentedPosts);
router.get('/getengagementmetrics', getEngagementMetrics);
router.get('/getdailyactiveusers', getDailyActiveUsers);
router.get('/getTopInterestsAndCategories', getTopInterestsAndCategories);

//updatesController
router.get('/getupdates', getUpdates);
router.post('/createupdate', createUpdate);
router.delete('/deleteupdate/:id', deleteUpdate);



module.exports = router;
