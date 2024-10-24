import React, { useState, useEffect } from 'react';
import { Table, Input, Spin, Button, Modal } from 'antd';
import axios from 'axios';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import './style.css'; 
import { toast } from 'react-hot-toast';

const { Search } = Input;

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching Reports:', error);
      toast.error('Error fetching Reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId) => {
    Modal.confirm({
      title: 'Confirm Resolve',
      content: 'Are you sure you want to mark this report as resolved?',
      onOk: async () => {
        try {
          setConfirmLoading(true);
          await axios.put(`/reports/${reportId}/resolve`);
          toast.success('Report marked as resolved');
          fetchReports(); // Refresh reports list
        } catch (error) {
          console.error('Error resolving report:', error);
          toast.error('Error resolving report');
        } finally {
          setConfirmLoading(false);
        }
      },
      onCancel() {},
    });
  };

  const filteredReports = reports.filter(report =>
    Object.values(report).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'Reported User',
      dataIndex: ['reportedUser', 'email'],
      render: email => email || 'N/A',
    },
    {
      title: 'Reported By',
      dataIndex: ['reportedBy', 'email'],
      render: email => email || 'N/A',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      sorter: (a, b) => a.reason.localeCompare(b.reason),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: date => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleResolve(record._id)}
          loading={confirmLoading}
          disabled={record.resolved}
        >
          {record.resolved ? 'Resolved' : 'Mark as Resolved'}
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
          <h1 className="title">User Reports</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">User Reports</a></li>
          </ul>

          <div className="data">
            <div className="content-data">
              <div className="head" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="left">
                  <Search
                    placeholder="Search reports"
                    enterButton
                    onSearch={value => setSearchQuery(value)}
                    className="search-input"
                    style={{ marginBottom: '20px' }}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading reports..." />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={filteredReports}
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

export default Reports;
 