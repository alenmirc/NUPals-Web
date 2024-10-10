const express = require('express');
const router = express.Router();
const { test, registerUser, createStudent, loginUser, logoutUser, getProfile, updateProfile, getUserprofile} = require('../controllers/authController');
const { createUserPosting, getPost, getPostbyid, deletePost, deleteComment, getPostWithComments } = require('../controllers/userPostingController');
const { getUsers, getAllpost, adminDeletepost, getLogs, editPost, updateUser, createUser, deleteUser, updateSAdminpassword  } = require('../controllers/adminController');
const { requestOtp, verifyOtp } = require('../controllers/resetPassword');
const { getCounts, getLoggedInUsersCount, getNewUsersOvertime, getMostLikedPosts, getMostCommentedPosts, getEngagementMetrics } = require('..//controllers/dashboardController'); // Adjust path as needed
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
router.post('/createStudent', createStudent); 
router.post('/login', loginUser)
router.post('/logout', authenticate, logoutUser)
router.get('/profile', getProfile)
router.put('/updateprofile', upload.single('profilePicture'), updateProfile);
router.get('/getUserprofile', getUserprofile);

//posting controller
router.post('/createuserposting', upload.single('media'), createUserPosting);
router.get('/getpost', getPost);
router.get('/getpostbyid', getPostbyid);
router.delete('/deletepost/:postId', deletePost);
router.delete('/deletecomment/:commentId', deleteComment);
router.get('/getpostwithcomments', getPostWithComments);

//admin controller
router.get('/getusers', getUsers);
router.get('/getallpost', getAllpost);
router.get('/getlogs', getLogs);
router.put('/editpost/:postId', upload.single('media'), editPost);
router.delete('/admindeletepost/:postId', adminDeletepost);
router.put('/updateuser/:id', updateUser);
router.delete('/deleteuser/:id', deleteUser);
router.post('/createuser', createUser);
router.put('/updatesadminpassword', updateSAdminpassword);


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

//updatesController
router.get('/getupdates', getUpdates);
router.post('/createupdate', createUpdate);
router.delete('/deleteupdate/:id', deleteUpdate);


module.exports = router;
getEngagementMetrics