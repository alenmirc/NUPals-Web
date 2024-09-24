import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spin } from 'antd';

const MostLikedPost = () => {
  const [mostLikedPost, setMostLikedPost] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMostLikedPost = async () => {
      try {
        const response = await axios.get('/getmostlikedposts'); // Ensure this matches your API endpoint
        if (response.data.length > 0) {
          setMostLikedPost(response.data[0]); // Get only the first post
        }
      } catch (error) {
        console.error('Error fetching the most liked post:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMostLikedPost();
  }, []);

  if (loading) {
    return <div className="loading-spinner"><Spin size="small" /></div>; // Show loading spinner while fetching
  }

  if (!mostLikedPost) {
    return <p>No posts available.</p>; // Message if no posts found
  }

  const { content, media, userId, createdAt, likesCount } = mostLikedPost;
  const shortContent = content.length > 50 ? `${content.slice(0, 50)}...` : content; // Truncate long content

  return (
  
      <Row gutter={16}>
        <Col span={8}>
          {media && (
            media.endsWith('.mp4') ? (
              <video controls style={{ maxWidth: '100%', height: '130px' }}>
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
          <p>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
        </Col>
      </Row>
  
  );
};

export default MostLikedPost;
