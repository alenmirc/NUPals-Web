import React, { useState, useEffect } from 'react';
import { Table, Input, Spin, Button, Modal, Form } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import react-hot-toast
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', link: '' });

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getupdates');
      setUpdates(response.data);
    } catch (error) {
      toast.error('Error fetching updates');
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUpdate = async () => {
    try {
      await axios.post('/createupdate', newUpdate);
      fetchUpdates(); // Refresh updates
      toast.success('Update created successfully');
      setIsModalVisible(false);
      setNewUpdate({ title: '', description: '', link: '' });
    } catch (error) {
      toast.error('All fields are required');
      console.error('Error creating update:', error);
    }
  };

  const handleDeleteUpdate = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this update?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await axios.delete(`/deleteupdate/${id}`); // Make sure this matches the backend route
          fetchUpdates(); // Refresh updates
          toast.success('Update deleted successfully');
        } catch (error) {
          toast.error('Error deleting update');
          console.error('Error deleting update:', error);
        }
      },
    });
  };
  

  useEffect(() => {
    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(update =>
    Object.values(update).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Link',
      dataIndex: 'link',
      render: link => <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      render: createdAt => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id) => (
        <Button type="primary" danger onClick={() => handleDeleteUpdate(id)}>
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
          <h1 className="title">System Updates</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">System Updates</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Search
                  placeholder="Search updates"
                  enterButton
                  onSearch={value => setSearchQuery(value)}
                  className="search-input"
                  style={{ marginBottom: '20px' }}
                />
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  Create Update
                </Button>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading updates..." />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={filteredUpdates}
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

      {/* Modal for creating new update */}
      <Modal
        title="Create New Update"
        visible={isModalVisible}
        onOk={handleCreateUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Title" required>
            <Input
              value={newUpdate.title}
              onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Description" required>
            <Input
              value={newUpdate.description}
              onChange={e => setNewUpdate({ ...newUpdate, description: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Link" required>
            <Input
              value={newUpdate.link}
              onChange={e => setNewUpdate({ ...newUpdate, link: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Updates;
