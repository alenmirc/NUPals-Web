import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spin } from 'antd';

const MostCommentedPost = () => {
  const [mostCommentedPost, setMostCommentedPost] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMostCommentedPost = async () => {
      try {
        const response = await axios.get('/getmostcommentedposts'); // Adjust the endpoint if necessary
        if (response.data.length > 0) {
          setMostCommentedPost(response.data[0]); // Get only the first post
        }
      } catch (error) {
        console.error('Error fetching the most commented post:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMostCommentedPost();
  }, []);

  if (loading) {
    return  <div className="loading-spinner"><Spin size="small" /></div>; // Show loading spinner while fetching
  }

  if (!mostCommentedPost) {
    return <p>No posts available.</p>; // Message if no posts found
  }

  const { content, media, userId, createdAt, comments } = mostCommentedPost;
  const shortContent = content.length > 50 ? `${content.slice(0, 50)}...` : content; // Truncate long content

  return (
      <Row gutter={16}>
        <Col span={8}>
          {media && (
            media.endsWith('.mp4') ? ( // Check if media is a video
              <video controls style={{maxWidth: '100%', height: '130px' }}>
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={media} alt="Post Media" style={{ maxWidth: '100%', height: '130px' }} />
            )
          )}
        </Col>
        <Col span={16}>
          <p><strong>Posted by:</strong> {userId.firstName} {userId.lastName}</p>
          <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p><strong>Content:</strong> {shortContent}</p>
          <p>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</p>
        </Col>
      </Row>
 
  );
};

export default MostCommentedPost;
