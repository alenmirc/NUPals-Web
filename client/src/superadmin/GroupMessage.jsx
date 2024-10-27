import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Spin, Select, Typography } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';


const { Title, Paragraph } = Typography;


const GroupMessages = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(false); // Initialize loading as false
    const [groupChats, setGroupChats] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupMessages, setGroupMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState(null);

    const fetchGroupChats = async () => {
        try {
            const response = await axios.get('/groupChats');
            setGroupChats(response.data.groupChats);
        } catch (error) {
            console.error('Error fetching group chats:', error);
            toast.error('Error fetching group chats');
        }
    };

    const fetchGroupMessages = async () => {
        if (!selectedGroupId) return;
        setLoading(true); // Set loading to true when fetching messages
        try {
            const response = await axios.get(`/groupMessages/${selectedGroupId}`);
            setGroupMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching group messages:', error);
            toast.error('Error fetching group messages');
        } finally {
            setLoading(false); // Stop loading after fetching messages
        }
    };

    const showDeleteConfirm = (messageId) => {
        setMessageIdToDelete(messageId);
        setModalVisible(true);
    };

    const deleteMessage = async () => {
        try {
            await axios.delete(`/deleteGroupMessage/${messageIdToDelete}`);
            toast.success('Message deleted successfully');
            fetchGroupMessages(); // Refresh messages after deletion
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Error deleting message');
        } finally {
            setModalVisible(false);
            setMessageIdToDelete(null);
        }
    };

    useEffect(() => {
        fetchGroupChats();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app">
            <Sidebar />
            <section id="content">
                <Navbar />
                <main>
                    <h1 className="title">Group Messages</h1>
                    <div className="data">
                        <div className="content-data">
                        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
                <Title level={5}>Privacy Warning</Title>
                <Paragraph>
                Privacy Warning: As a superadmin, you have access to sensitive group messages. Please handle this information with care.
                </Paragraph>
              </div>
                            <Select
                                placeholder="Select Group Chat"
                                onChange={value => {
                                    setSelectedGroupId(value);
                                    fetchGroupMessages();
                                }}
                                style={{ marginBottom: '20px', width: '100%' }} // Full width for the select
                            >
                                {groupChats.map(groupChat => (
                                    <Select.Option key={groupChat._id} value={groupChat._id}>
                                        {groupChat.title}
                                    </Select.Option>
                                ))}
                            </Select>

                            {/* Message Table Below the Dropdown */}
                            <div className="table-responsive" style={{ width: '100%' }}>
                                {loading ? (
                                    <div className="loading-spinner">
                                        <Spin tip="Loading group messages..." />
                                    </div>
                                ) : (
                                    <Table
                                        columns={[
                                            {
                                                title: 'Sender Email',
                                                dataIndex: 'senderId', // Reference senderId object
                                                key: 'senderEmail',
                                                render: senderId => senderId ? senderId.email : 'Unknown', // Safely access email
                                            },
                                            { 
                                                title: 'Message Content', 
                                                dataIndex: 'content', 
                                                key: 'content',
                                                render: (text) => (
                                                    <div style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                      {text}
                                                    </div>
                                                ),
                                            },
                                            {
                                                title: 'Timestamp',
                                                dataIndex: 'createdAt',
                                                key: 'createdAt',
                                                render: text => new Date(text).toLocaleString(),
                                            },
                                            {
                                                title: 'Action', // New column for Delete action
                                                key: 'action',
                                                render: (text, record) => (
                                                    <Button
                                                        className="table-delete-button"
                                                        size="small"
                                                        type="danger"
                                                        onClick={() => showDeleteConfirm(record._id)} // Pass message ID to showDeleteConfirm
                                                    >
                                                        Delete
                                                    </Button>
                                                ),
                                            },
                                        ]}
                                        dataSource={groupMessages}
                                        rowKey="_id"
                                        pagination={{ pageSize: 10 }}
                                        bordered
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    <Modal
                        title="Confirm Delete"
                        visible={modalVisible}
                        onOk={deleteMessage}
                        onCancel={() => setModalVisible(false)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to delete this message?</p>
                    </Modal>

                </main>
            </section>
        </div>
    );
};

export default GroupMessages;
