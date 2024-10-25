import React, { useState, useEffect } from 'react';
import { Table, Input, Spin } from 'antd';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initial mobile check

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getstudentlogs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching Logs:', error);
      toast.error('Error fetching Logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Update isMobile on window resize
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredLogs = logs.filter(log =>
    Object.values(log).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      sorter: (a, b) => a.level.localeCompare(b.level),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a, b) => a.message.localeCompare(b.message),
    },
    {
      title: 'Student Email',
      dataIndex: 'studentName',
      render: text => text || 'N/A',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      render: timestamp => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
  ];

  return (
    <div className="app">
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Student Activity Logs</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Student Activity Logs</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Search
                  placeholder="Search logs"
                  enterButton
                  onSearch={value => setSearchQuery(value)}
                  className="search-input"
                  style={{ marginBottom: '20px' }}
                />
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading logs..." />
                </div>
              ) : isMobile ? (
                // Mobile view
                <div className="logs-list">
                  {filteredLogs.map(log => (
                    <div className="log-item" key={log._id}>
                      <div><strong>Level:</strong> {log.level}</div>
                      <div><strong>Message:</strong> {log.message}</div>
                      <div><strong>Student Email:</strong> {log.studentName || 'N/A'}</div>
                      <div><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                      <hr />
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop view with Table component
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={filteredLogs}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
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

export default Logs;
