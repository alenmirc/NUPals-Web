import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Input, Modal, Spin } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;

const MultiKeywordAdmin = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentKeyword, setCurrentKeyword] = useState(null);
    const [newKeyword, setNewKeyword] = useState({ keyword: '' });
    const [updatedKeyword, setUpdatedKeyword] = useState({ keyword: '' });

    const fetchKeywords = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/viewKeywords');
            setKeywords(response.data);
        } catch (error) {
            console.error('Error fetching keywords:', error);
            toast.error('Error fetching keywords');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords();
    }, []);

    const handleEditClick = (keyword) => {
        setCurrentKeyword(keyword);
        setUpdatedKeyword({ keyword: keyword.keyword });
        setShowEditModal(true);
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/createKeyword', newKeyword);
            fetchKeywords();
            setShowCreateModal(false);
            setNewKeyword({ keyword: '' });
            toast.success('Keyword created successfully!');
        } catch (error) {
            console.error('Error creating keyword:', error);
            toast.error('Error creating keyword');
        }
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/updateKeyword/${currentKeyword._id}`, updatedKeyword);
            fetchKeywords();
            setShowEditModal(false);
            toast.success('Keyword updated successfully!');
        } catch (error) {
            console.error('Error updating keyword:', error);
            toast.error('Error updating keyword');
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this keyword?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await axios.delete(`/deleteKeyword/${id}`);
                    fetchKeywords();
                    toast.success('Keyword deleted successfully!');
                } catch (error) {
                    console.error('Error deleting keyword:', error);
                    toast.error('Error deleting keyword');
                }
            },
        });
    };

    const filteredKeywords = keywords.filter(keyword =>
        keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            sorter: (a, b) => a.keyword.localeCompare(b.keyword),
        },
        {
            title: 'Action',
            render: (text, keyword) => (
                <>
                    <Button type="primary" size="small" onClick={() => handleEditClick(keyword)}>Edit</Button>
                    <Button type="danger" className="table-delete-button" size="small" onClick={() => handleDelete(keyword._id)}>Delete</Button>
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
                    <h1 className="title">Multi-keywords Management</h1>
                    <div className="data">
                        <div className="content-data">
                            {/* Search Input */}
                            <div className="head" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <Search
                                    placeholder="Search keywords"
                                    enterButton
                                    onSearch={value => setSearchQuery(value)}
                                    className="search-input"
                                    style={{ width: '300px' }}
                                />
                                <Button type="primary" onClick={() => setShowCreateModal(true)} style={{ marginLeft: '10px' }}>
                                    Create New Keyword
                                </Button>
                            </div>

                            {loading ? (
                                <div className="loading-spinner">
                                    <Spin tip="Loading keywords..." />
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={filteredKeywords}
                                    rowKey="_id"
                                    pagination={{
                                        current: currentPage,
                                        pageSize: itemsPerPage,
                                        total: filteredKeywords.length,
                                        onChange: (page) => setCurrentPage(page),
                                    }}
                                    bordered
                                />
                            )}
                        </div>
                    </div>

                    {/* Create Modal */}
                    <Modal
                        title="Create New Keyword"
                        visible={showCreateModal}
                        onCancel={() => setShowCreateModal(false)}
                        onOk={handleCreateSubmit}
                    >
                        <Form>
                            <Form.Item label="Keyword">
                                <Input
                                    value={newKeyword.keyword}
                                    onChange={(e) => setNewKeyword({ keyword: e.target.value })}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Edit Modal */}
                    <Modal
                        title="Edit Keyword"
                        visible={showEditModal}
                        onCancel={() => setShowEditModal(false)}
                        onOk={handleEditSubmit}
                    >
                        <Form>
                            <Form.Item label="Keyword">
                                <Input
                                    value={updatedKeyword.keyword}
                                    onChange={(e) => setUpdatedKeyword({ keyword: e.target.value })}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </main>
            </section>
        </div>
    );
};

export default MultiKeywordAdmin;