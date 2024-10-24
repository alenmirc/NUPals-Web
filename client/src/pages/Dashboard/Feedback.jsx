import React, { useState, useEffect } from 'react';
import { Table, Input, Spin, Button, Modal } from 'antd';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getfeedback'); // Update with your API endpoint
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/feedbackmark-as-read/${id}`);
      fetchFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error('Error marking feedback as read:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    Object.values(feedback).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a, b) => a.message.localeCompare(b.message),
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      render: timestamp => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Status',
      dataIndex: 'isRead',
      render: isRead => (isRead ? 'Read' : 'Unread'),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Button onClick={() => handleMarkAsRead(record._id)} disabled={record.isRead}>
          Mark as Read
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
          <h1 className="title">Feedback</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Feedback</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="left">
                  <Search
                    placeholder="Search feedback"
                    enterButton
                    onSearch={value => setSearchQuery(value)}
                    className="search-input"
                    style={{ marginBottom: '20px' }}
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading feedback..." />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={filteredFeedbacks}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    sorter={true}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Feedback;
