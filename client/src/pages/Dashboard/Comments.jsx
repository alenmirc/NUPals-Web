import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Spin, Input } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './style.css';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';

const { Search } = Input; // Import Search from Ant Design

const Comments = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  // Fetch posts with comments
  const fetchPostsWithComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getpostwithcomments'); // Assuming this includes comments
      setPosts(response.data);
      // Flatten all comments from posts
      setComments(response.data.flatMap(post => post.comments || []));
    } catch (error) {
      console.error('Error fetching posts with comments:', error);
      toast.error('Error fetching posts and comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsWithComments();
  }, []);

  // Show modal to confirm comment deletion
  const showDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalVisible(true);
  };

   // Filter comments based on search query
   const filteredComments = comments.filter(comment =>
    comment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle comment deletion
  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/deletecomment/${commentToDelete}`);
      fetchPostsWithComments(); // Refresh the data after deletion
      setIsModalVisible(false);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error.response ? error.response.data : error.message);
      toast.error('Failed to delete comment');
    }
  };
  

  // Define table columns
  const columns = [
    {
      title: 'Post Media',
      dataIndex: 'post',
      render: (post) => {
        if (post && post.media) {
          if (post.media.startsWith('data:image/')) {
            return <img src={post.media} alt="Media" style={{ width: '80px', height: 'auto' }} />;
          } else if (post.media.startsWith('data:video/')) {
            return (
              <video controls style={{ width: '80px', height: 'auto' }}>
                <source src={post.media} type={post.media.split(';')[0].split(':')[1]} />
                Your browser does not support the video tag.
              </video>
            );
          }
        }
        return 'No Media';
      },
    },
    {
      title: 'Post Content',
      dataIndex: 'post',
      render: (post) => (post ? post.content : 'No Content'),
    },
    {
      title: 'Commenter Email',
      dataIndex: 'userId',
      render: (userId) => userId?.email || 'N/A',
    },
    {
      title: 'Comment',
      dataIndex: 'text',
      key: 'comment',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button type="danger" className="table-delete-button"  size="small" onClick={() => showDeleteModal(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="app">
    <Sidebar />
    <section id="content">
      <Navbar />
      <main>
        <h1 className="title">Comment Management</h1>
        <ul className="breadcrumbs">
          <li><a href="#">Home</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Comment Management</a></li>
        </ul>

        <div className="data">
          <div className="content-data">
            <div className="head" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="left">
                <Search
                  placeholder="Search logs"
                  enterButton
                  onSearch={value => setSearchQuery(value)}
                  className="search-input"
                  style={{ marginBottom: '20px' }}
                />
              </div>
            </div>
            <div className="comment-table">
      {loading ? (
        <div className="loading-spinner">
          <Spin />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredComments.map(comment => ({
            ...comment,
            post: posts.find(post => post.comments.some(c => c._id === comment._id)), // Match comment to its post
          }))}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDeleteComment}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </div>
          </div>
        </div>
      </main>
    </section>
  </div>
  
  
  
  
  
  );
};

export default Comments;
