import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Spin, Input, Typography } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;
const { Title, Paragraph } = Typography;

const Messages = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [userIds, setUserIds] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState(null);
  const [legalReason, setLegalReason] = useState('');
  const [showLegalReason, setShowLegalReason] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/getmessages');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserIdsByEmail = async () => {
    // Check if legal reason is provided
    if (!legalReason) {
      toast.error('Please enter a legal reason before searching.');
      return;
    }

    try {
      const [senderResponse, receiverResponse] = await Promise.all([
        axios.get(`/getUserIdByEmail?email=${senderEmail}`),
        axios.get(`/getUserIdByEmail?email=${receiverEmail}`),
      ]);

      setUserIds({
        senderId: senderResponse.data.userId,
        receiverId: receiverResponse.data.userId,
      });

      // Log the legal reason
      await axios.post('/logLegalReason', { legalReason, senderEmail, receiverEmail });

    } catch (error) {
      console.error('Error fetching user IDs:', error);
      toast.error('Error fetching user IDs');
    }
  };

  const showDeleteConfirm = (messageId) => {
    setMessageIdToDelete(messageId);
    setModalVisible(true);
  };

  const deleteMessage = async () => {
    try {
      await axios.delete(`/deletemessage/${messageIdToDelete}`);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Error deleting message');
    } finally {
      setModalVisible(false);
      setMessageIdToDelete(null);
    }
  };

  useEffect(() => {
    fetchMessages();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredMessages = messages.filter(message =>
    (message.senderId === userIds.senderId && message.receiverId === userIds.receiverId) ||
    (message.senderId === userIds.receiverId && message.receiverId === userIds.senderId)
  );

  return (
    <div className="app">
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Messages</h1>

          <div className="data">
            <div className="content-data">
              <div className="head">
                <Input
                  placeholder="Sender Email"
                  value={senderEmail}
                  onChange={e => setSenderEmail(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <Input
                  placeholder="Receiver Email"
                  value={receiverEmail}
                  onChange={e => setReceiverEmail(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <Button 
                  onClick={fetchUserIdsByEmail} 
                  type="primary" 
                  style={{ marginBottom: '20px' }} 
                  disabled={!legalReason} // Disable if no legal reason
                >
                  Search Messages
                </Button>
              </div>

              {/* Legal Reason Disclaimer */}
              <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
                <Title level={5}>Privacy Warning</Title>
                <Paragraph>
                  Please note that all communications are monitored for legal reasons. 
                  You must provide a legal reason for accessing the messages.
                </Paragraph>
                <Input
                  placeholder="Enter Legal Reason"
                  value={legalReason}
                  onChange={e => setLegalReason(e.target.value)}
                  onFocus={() => setShowLegalReason(true)}
                  style={{ marginBottom: '10px' }}
                />
              </div>

              {loading ? (
              <div className="loading-spinner">
              <Spin tip="Loading logs..." />
            </div>
              ) : (
                <div className="table-responsive">
                  {isMobile ? (
                    <div className="messages-list">
                      {filteredMessages.map(message => (
                        <div className="message-item" key={message._id}>
                          <div><strong>Sender Email:</strong> {message.senderEmail}</div>
                          <div><strong>Receiver Email:</strong> {message.receiverEmail}</div>
                          <div><strong>Content:</strong> {message.content}</div>
                          <div><strong>Timestamp:</strong> {new Date(message.createdAt).toLocaleString()}</div>
                          <Button 
                            className="table-delete-button" 
                            size="small"
                            type="danger" 
                            onClick={() => showDeleteConfirm(message._id)}
                            style={{ marginTop: '10px' }} 
                          >
                            Delete
                          </Button>
                          <hr />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table
                      columns={[
                        { title: 'Sender Email', dataIndex: 'senderEmail', key: 'senderEmail' },
                        { title: 'Receiver Email', dataIndex: 'receiverEmail', key: 'receiverEmail' },
                        { 
                          title: 'Message Content', 
                          dataIndex: 'content', 
                          key: 'content',
                          width: '30%', 
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
                          render: (text) => new Date(text).toLocaleString() 
                        },
                        {
                          title: 'Action',
                          key: 'action',
                          render: (text, record) => (
                            <Button 
                              className="table-delete-button" 
                              size="small"
                              type="danger" 
                              onClick={() => showDeleteConfirm(record._id)}
                            >
                              Delete
                            </Button>
                          ),
                        },
                      ]}
                      dataSource={filteredMessages}
                      rowKey="_id"
                      pagination={{ pageSize: 10 }}
                      bordered
                    />
                  )}
                </div>
              )}
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

export default Messages;
