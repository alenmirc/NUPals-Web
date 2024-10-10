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
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchLogs = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('/getLogs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching Logs:', error); // Log the error
      toast.error('Error fetching Logs'); // Show error notification
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchLogs();
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
      title: 'Admin Name',
      dataIndex: 'adminName',
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
          <h1 className="title">Admin Activity Logs</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Admin Activity Logs</a></li>
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
                {/* Show spinner while loading */}
          {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading posts..." />
                </div>
              ) : (
              <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredLogs}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                sorter={true}
              /></div>
              )}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Logs;
