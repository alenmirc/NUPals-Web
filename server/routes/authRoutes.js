const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, logoutUser, getProfile, updateProfile, getUserprofile} = require('../controllers/authController');
const { createUserPosting, getPost, getPostbyid, deletePost } = require('../controllers/userPostingController');
const { getUsers, getAllpost, adminDeletepost, getLogs, updateUser, createUser, deleteUser } = require('../controllers/adminController');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../middleware/authenticate');

// Apply CORS middleware to all routes
router.use(
  cors({
  credentials: true,
  origin: 'https://nu-palsweb.vercel.app/'
}));

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

//admin controller
router.get('/getusers', getUsers);
router.get('/getallpost', getAllpost);
router.get('/getlogs', getLogs);
router.delete('/admindeletepost/:postId', adminDeletepost);
router.put('/updateuser/:id', updateUser);
router.delete('/deleteuser/:id', deleteUser);
router.post('/createuser', createUser);

module.exports = router;
