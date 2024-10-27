import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Input, Modal, Spin } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const GroupChatAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [groupChats, setGroupChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentGroupChat, setCurrentGroupChat] = useState(null);
  const [newGroupChat, setNewGroupChat] = useState({ title: '' });
  const [updatedGroupChat, setUpdatedGroupChat] = useState({ title: '' });

  const fetchGroupChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/viewgroupchats');
      setGroupChats(response.data);
    } catch (error) {
      console.error('Error fetching group chats:', error);
      toast.error('Error fetching group chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupChats();
  }, []);

  const handleEditClick = (groupChat) => {
    setCurrentGroupChat(groupChat);
    setUpdatedGroupChat({ title: groupChat.title });
    setShowEditModal(true);
  };

  const handleCreateSubmit = async () => {
    try {
      await axios.post('/createGroupChat', newGroupChat);
      fetchGroupChats();
      setShowCreateModal(false);
      setNewGroupChat({ title: '' });
      toast.success('Group chat created successfully!');
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error('Error creating group chat');
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/updateGroupChat/${currentGroupChat._id}`, updatedGroupChat);
      fetchGroupChats();
      setShowEditModal(false);
      toast.success('Group chat updated successfully!');
    } catch (error) {
      console.error('Error updating group chat:', error);
      toast.error('Error updating group chat');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this group chat?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`/deleteGroupChat/${id}`);
          fetchGroupChats();
          toast.success('Group chat deleted successfully!');
        } catch (error) {
          console.error('Error deleting group chat:', error);
          toast.error('Error deleting group chat');
        }
      },
    });
  };

  // Filtered group chats based on the search query
  const filteredGroupChats = groupChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Action',
      render: (text, chat) => (
        <>
          <Button type="primary" size="small" onClick={() => handleEditClick(chat)}>Edit</Button>
          <Button type="danger" className="table-delete-button" size="small" onClick={() => handleDelete(chat._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="app">
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Group Chat Management</h1>
          <div className="data">
            <div className="content-data">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
              />
              <Button type="primary" onClick={() => setShowCreateModal(true)}>Create New Group Chat</Button>

              {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading group chats..." />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredGroupChats}
                  rowKey="_id"
                  pagination={{
                    current: currentPage,
                    pageSize: itemsPerPage,
                    total: filteredGroupChats.length,
                    onChange: (page) => setCurrentPage(page),
                  }}
                  bordered
                />
              )}
            </div>
          </div>

          {/* Create Modal */}
          <Modal
            title="Create New Group Chat"
            visible={showCreateModal}
            onCancel={() => setShowCreateModal(false)}
            onOk={handleCreateSubmit}
          >
            <Form>
              <Form.Item label="Title">
                <Input
                  value={newGroupChat.title}
                  onChange={(e) => setNewGroupChat({ title: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Modal>

          {/* Edit Modal */}
          <Modal
            title="Edit Group Chat"
            visible={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onOk={handleEditSubmit}
          >
            <Form>
              <Form.Item label="Title">
                <Input
                  value={updatedGroupChat.title}
                  onChange={(e) => setUpdatedGroupChat({ title: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Modal>
        </main>
      </section>
    </div>
  );
};

export default GroupChatAdmin;
    