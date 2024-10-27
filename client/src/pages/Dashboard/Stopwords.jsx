import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Input, Modal, Spin } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css';

const { Search } = Input;

const StopwordAdmin = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [stopwords, setStopwords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentStopword, setCurrentStopword] = useState(null);
    const [newStopwords, setNewStopwords] = useState(''); // Updated to hold a string
    const [updatedStopword, setUpdatedStopword] = useState({ word: '' });

    const fetchStopwords = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/viewStopwords'); // Ensure the endpoint is correct
            setStopwords(response.data);
        } catch (error) {
            console.error('Error fetching stopwords:', error);
            toast.error('Error fetching stopwords');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStopwords();
    }, []);

    const handleEditClick = (stopword) => {
        setCurrentStopword(stopword);
        setUpdatedStopword({ word: stopword.word });
        setShowEditModal(true);
    };

    const handleCreateSubmit = async () => {
        const wordsArray = newStopwords.split(/[\s,]+/).filter(Boolean); // Split by spaces or commas

        if (wordsArray.length === 0) {
            toast.error('Please enter at least one stopword');
            return;
        }

        try {
            await axios.post('/createStopword', { words: wordsArray }); // Send as an array
            fetchStopwords();
            setShowCreateModal(false);
            setNewStopwords(''); // Reset to empty string
            toast.success('Stopwords created successfully!');
        } catch (error) {
            console.error('Error creating stopwords:', error);
            const errorMessage = error.response?.data?.message || 'Error creating stopwords';
            toast.error(errorMessage);
        }
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/updateStopword/${currentStopword._id}`, updatedStopword);
            fetchStopwords();
            setShowEditModal(false);
            toast.success('Stopword updated successfully!');
        } catch (error) {
            console.error('Error updating stopword:', error);
            toast.error('Error updating stopword');
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this stopword?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await axios.delete(`/deleteStopword/${id}`);
                    fetchStopwords();
                    toast.success('Stopword deleted successfully!');
                } catch (error) {
                    console.error('Error deleting stopword:', error);
                    toast.error('Error deleting stopword');
                }
            },
        });
    };

    const filteredStopwords = stopwords.filter(stopword =>
        stopword.word.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            title: 'Stopword',
            dataIndex: 'word',
            sorter: (a, b) => a.word.localeCompare(b.word),
        },
        {
            title: 'Action',
            render: (text, stopword) => (
                <>
                    <Button type="primary" size="small" onClick={() => handleEditClick(stopword)}>Edit</Button>
                    <Button type="danger" className="table-delete-button" size="small" onClick={() => handleDelete(stopword._id)}>Delete</Button>
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
                    <h1 className="title">Stopword Management</h1>
                    <div className="data">
                        <div className="content-data">
                            {/* Search Input */}
                            <div className="head" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <Search
                                    placeholder="Search stopwords"
                                    enterButton
                                    onSearch={value => setSearchQuery(value)}
                                    className="search-input"
                                    style={{ width: '300px' }}
                                />
                                <Button type="primary" onClick={() => setShowCreateModal(true)} style={{ marginLeft: '10px' }}>
                                    Create New Stopword
                                </Button>
                            </div>

                            {loading ? (
                                <div className="loading-spinner">
                                    <Spin tip="Loading stopwords..." />
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={filteredStopwords}
                                    rowKey="_id"
                                    pagination={{
                                        current: currentPage,
                                        pageSize: itemsPerPage,
                                        total: filteredStopwords.length,
                                        onChange: (page) => setCurrentPage(page),
                                    }}
                                    bordered
                                />
                            )}
                        </div>
                    </div>

                    {/* Create Modal */}
                    <Modal
                        title="Create New Stopwords"
                        visible={showCreateModal}
                        onCancel={() => setShowCreateModal(false)}
                        onOk={handleCreateSubmit}
                    >
                        <Form>
                            <Form.Item label="Stopwords (comma or new line separated)">
                                <Input.TextArea
                                    value={newStopwords}
                                    onChange={(e) => setNewStopwords(e.target.value)}
                                    rows={4}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Edit Modal */}
                    <Modal
                        title="Edit Stopword"
                        visible={showEditModal}
                        onCancel={() => setShowEditModal(false)}
                        onOk={handleEditSubmit}
                    >
                        <Form>
                            <Form.Item label="Stopword">
                                <Input
                                    value={updatedStopword.word}
                                    onChange={(e) => setUpdatedStopword({ word: e.target.value })}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </main>
            </section>
        </div>
    );
};

export default StopwordAdmin;
