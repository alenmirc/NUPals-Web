const Posts = require('../models/posting');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; 

//CREATE POST
const createUserPosting = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const media = req.body.media; // Use req.body.media instead of req.file.buffer
    const newPost = new Posts({ userId, content, media });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error creating post' });
  }
};

//GETPOST
const getPost = async (req , res) => {
  try {
    const posts = await Posts.find().populate('userId', 'firstName lastName profilePicture');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
  };
  
//get post by userid
const getPostbyid = async (req, res) => {
  const { userId } = req.query; // Access userId from query parameters
  
  try {
    const posts = await Posts.find({ userId }).populate('userId', 'firstName lastName profilePicture');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
};

//delete post
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the post by ID and delete it
    await Posts.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

//deletecomment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Use the new keyword to create a new ObjectId instance
    const commentObjectId = new ObjectId(commentId);

    // Find the post containing the comment
    const post = await Posts.findOne({ 'comments._id': commentObjectId });

      if (!post) {
        return res.status(404).json({ message: 'Comment not found' });
      }

    // Remove the comment from the post's comments array
    post.comments = post.comments.filter(comment => !comment._id.equals(commentObjectId));

    await post.save(); // Save the updated post

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Error deleting comment' });
  }
};


// GET post with comments, including the email from userId
const getPostWithComments = async (req, res) => {
  try {
    const posts = await Posts.find()
      .populate({
        path: 'comments.userId',
        select: 'email' // Only fetch the email field
      })
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts with comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    createUserPosting,
    getPost,
    getPostbyid,
    deletePost,
    deleteComment,
    getPostWithComments
};
