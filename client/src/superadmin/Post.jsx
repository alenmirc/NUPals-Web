import React, { useState, useEffect, useContext } from 'react';
import { Modal, Table, Input, Button, Form, Spin, List } from 'antd';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const { Search } = Input;

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for create modal
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [createContent, setCreateContent] = useState(''); // State for new post content
  const [base64String, setBase64String] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchPosts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('/getallpost');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error fetching posts');
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`/getcomments/${postId}`);
      setComments(response.data);
      setIsCommentsModalVisible(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error fetching comments');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/deletecomment/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  const filteredPosts = posts.filter(post =>
    Object.values(post).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxSize) {
      toast.error('File size exceeds 10MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      setBase64String(base64); // Save base64 string
      // Update image or video based on file type
      if (file.type.includes('image')) {
        setImage(file);
        setVideo(null); // Clear video if an image is selected
      } else if (file.type.includes('video')) {
        setVideo(file);
        setImage(null); // Clear image if a video is selected
      }
    };

    reader.readAsDataURL(file);
  };

  const showEditModal = (post) => {
    setPostToEdit(post);
    setEditContent(post.content);
    setBase64String(post.media || '');
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', editContent);
    if (base64String) {
      formData.append('media', base64String);
    }

    try {
      await axios.put(`/editpost/${postToEdit._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPosts();
      setIsEditModalVisible(false);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const showCreateModal = () => {
    setCreateContent(''); // Reset content for new post
    setBase64String(''); // Reset media for new post
    setImage(null); // Clear image state
    setVideo(null); // Clear video state
    setIsCreateModalVisible(true);
  };

  const { user } = useContext(UserContext);
  const userId = user?.id;

  const handleCreateSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', createContent);
    if (base64String) {
      formData.append('media', base64String);
    }

    try {
      await axios.post('/createuserposting', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPosts();
      setIsCreateModalVisible(false);
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const showDeleteModal = (postId) => {
    setPostToDelete(postId);
    setIsModalVisible(true);
    setConfirmText(''); // Reset confirmText when the modal is shown
  };

  const handleOk = async () => {
    try {
      await axios.delete(`/deletepost/${postToDelete}`);
      fetchPosts();
      setIsModalVisible(false);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'userId',
      render: (user) => `${user?.firstName || 'N/A'} ${user?.lastName || ''}`.trim(),
      sorter: (a, b) =>
        `${a.userId?.firstName} ${a.userId?.lastName}`.localeCompare(`${b.userId?.firstName} ${b.userId?.lastName}`),
    },
    {
      title: 'Email',
      dataIndex: 'userId',
      render: (userId) => (userId?.email ? userId.email : 'N/A'),
      sorter: (a, b) => a.userId?.email.localeCompare(b.userId?.email),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      sorter: (a, b) => a.content.localeCompare(b.content),
    },
    {
      title: 'Media',
      dataIndex: 'media',
      render: media => {
  
        if (!media) {
          return 'No Media'; 
        }
        
        // Check if the media is an image
        if (media.startsWith('data:image/')) {
          return (
            <img src={media} alt="Media" style={{ width: '80px', height: 'auto' }} />
          );
        } 
        // Check if the media is a video
        else if (media.startsWith('data:video/')) { // This accepts any video format
          return (
            <video controls style={{ width: '80px', height: 'auto' }}>
              <source src={media} type={media.split(';')[0].split(':')[1]} />
              Your browser does not support the video tag.
            </video>
          );
        }
    
        return 'Unsupported Media Type';
      },
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      render: (likes) => (likes ? likes.length : 0),
      sorter: (a, b) => a.likes.length - b.likes.length,
      
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      render: (comments) => comments?.length || 0,
      sorter: (a, b) => (a.comments?.length || 0) - (b.comments?.length || 0),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: createdAt => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: updatedAt => new Date(updatedAt).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div>
          <Button type="primary" size="small" onClick={() => fetchComments(record._id)}>View</Button>
          <Button type="primary" size="small" onClick={() => showEditModal(record)}>Edit</Button>
          <Button type="danger" className="table-delete-button" size="small" onClick={() => showDeleteModal(record._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="app">
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Posts</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Posts</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" onClick={showCreateModal}>Create New Post</Button>
                <div className="left">
                  <Search
                    placeholder="Search posts"
                    enterButton
                    onSearch={value => setSearchQuery(value)}
                    className="search-input"
                    style={{ marginBottom: '20px' }}
                  />
                </div>
              </div>
            {/* Show spinner while loading */}
{loading ? (
  <div className="loading-spinner">
    <Spin /> {/* Removed tip prop */}
  </div>
) : (
  <div className="table-responsive">
    <Table
      columns={columns}
      dataSource={filteredPosts}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  </div>
)}
            </div>
          </div>

          <Modal
            title="Confirm Deletion"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => {
              setIsModalVisible(false);
              setConfirmText('');
              setPostToDelete(null);
            }}
            okButtonProps={{ disabled: confirmText !== 'delete' }}
          >
            <p>Type "delete" to confirm deletion:</p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'delete' to confirm"
            />
          </Modal>

          {/* Edit Modal */}
          <Modal
            title="Edit Post"
            open={isEditModalVisible}
            onOk={handleEditSubmit}
            onCancel={() => setIsEditModalVisible(false)}
            okText="Save"
          >
            <Form layout="vertical">
              <Form.Item label="Content">
                <Input.TextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  placeholder="Enter post content"
                />
              </Form.Item>
              <Form.Item label="Upload Media">
                <Input
                  type="file"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                />
                {image && <p>Selected Image: {image.name}</p>}
                {video && <p>Selected Video: {video.name}</p>}
              </Form.Item>
            </Form>
          </Modal>

          {/* Create Modal */}
          <Modal
            title="Create New Post"
            open={isCreateModalVisible}
            onOk={handleCreateSubmit}
            onCancel={() => setIsCreateModalVisible(false)}
            okText="Create"
          >
            <Form layout="vertical">
              <Form.Item label="Content">
                <Input.TextArea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  rows={4}
                  placeholder="Enter post content"
                />
              </Form.Item>
              <Form.Item label="Upload Media">
                <Input
                  type="file"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                />
                {image && <p>Selected Image: {image.name}</p>}
                {video && <p>Selected Video: {video.name}</p>}
              </Form.Item>
            </Form>
          </Modal>

            {/* Comments Modal */}
            <Modal
  title="Comments"
  open={isCommentsModalVisible}
  onCancel={() => setIsCommentsModalVisible(false)}
  footer={null}
>
  <List
    dataSource={comments}
    renderItem={(comment) => (
      <List.Item
        actions={[
          <Button type="link" danger onClick={() => handleDeleteComment(comment._id)}>Delete</Button>,
        ]}
      >
        <List.Item.Meta
          title={comment.userId?.email || 'Unknown User'}
          description={comment.text} // Display the comment's text here
        />
      </List.Item>
    )}
  />
</Modal>
        </main>
      </section>
    </div>
  );
};

export default Post;
