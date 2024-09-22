import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Input, Modal, Spin } from 'antd'; // Import Ant Design components
import './style.css'; // Import your CSS file here
import axios from 'axios';
import Navbar from './component/Navbar'; // Import the Navbar component
import Sidebar from './component/Sidebar';
import userlogo from '../../assets/userlogo.png';
import { toast } from 'react-hot-toast';

const Student = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchUsers = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('/getusers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setUpdatedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Always set the password to an empty string
    });
    setShowEditModal(true);
  };


   //delete function modals
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [userIdToDelete, setUserIdToDelete] = useState(null);
   const [confirmText, setConfirmText] = useState(''); // Input for confirmation text
   
   const showDeleteConfirm = (userId) => {
     setUserIdToDelete(userId); // Set user ID
     setConfirmText(''); // Reset confirmation input
     setIsModalVisible(true); // Show modal
   };
   
   const handleOk = async () => {
     if (confirmText.toLowerCase() !== 'delete') {
       toast.error('Please type "delete" to confirm deletion.');
       return; // Do not close the modal if the input is incorrect
     }
   
     try {
       await axios.delete(`/deleteuser/${userIdToDelete}`);
       fetchUsers(); // Refresh users list after deletion
       toast.success('User deleted successfully.');
     } catch (error) {
       toast.error('Error deleting user.');
     }
   
     // Clean up state after deletion
     setIsModalVisible(false);
     setUserIdToDelete(null);
     setConfirmText('');
   };
   // end modal delete functions


   //edit function
   const handleEditSubmit = async () => {
    try {
      // Only include the password in the update request if it's not empty
      const updatedData = { ...updatedUser };
      if (!updatedUser.password) {
        delete updatedData.password; // Remove the password field if no new password is provided
      }
  
      await axios.put(`/updateuser/${currentUser._id}`, updatedData);
      fetchUsers();
      setShowEditModal(false);
      toast.success('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };
 //end edit function
 
  // create new admin user

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  });


  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = newUser; // Use newUser
    try {
      const { data } = await axios.post('/register', {
        firstName, lastName, email, password, confirmPassword // Ensure the endpoint matches your backend
      });
  
      if (data.error) {
        toast.error(data.error);
      } else {
        fetchUsers(); // Refresh the users list
        setShowCreateModal(false); // Close the modal
        setNewUser({ // Reset the form
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        toast.success('Account created successfully!');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    }
  };
// end create new admin user


  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const adminUsers = filteredUsers.filter(user => user.role === 'student'); // Filter for admin users
  const paginatedAdminUsers = adminUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Paginate the filtered admin users
  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profilePicture',
      render: (text) => <img src={text || userlogo} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      sorter: (a, b) => {
        const nameA = a.firstName || '';
        const nameB = b.firstName || '';
        return nameA.localeCompare(nameB);
      }
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      sorter: (a, b) => {
        const nameA = a.lastName || '';
        const nameB = b.lastName || '';
        return nameA.localeCompare(nameB);
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => {
        const nameA = a.email || '';
        const nameB = b.email || '';
        return nameA.localeCompare(nameB);
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: timestamp => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: timestamp => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: 'Action',
      render: (text, user) => (
        <>
          <Button type="primary" size="small" onClick={() => handleEditClick(user)}>Edit</Button>
          <Button type="danger" className="table-delete-button" size="small" onClick={() => showDeleteConfirm(user._id, user.email)}>Delete</Button>

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
        <h1 className="title">Student Management</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Student Management</a></li>
          </ul>

          <div className="data">
  <div className="content-data">
    <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button type="primary" onClick={() => setShowCreateModal(true)}>Create New User</Button>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', width: '300px' }}
      /></div>
           {/* Show spinner while loading */}
           {loading ? (
                <div className="loading-spinner">
                  <Spin tip="Loading posts..." />
                </div>
              ) : (
          <div className="table-responsive">
          <Table
  columns={columns}
  dataSource={paginatedAdminUsers} // Use only admin users
  pagination={{
    current: currentPage,
    pageSize: itemsPerPage,
    total: adminUsers.length, // Total should reflect the number of admin users
    onChange: (page) => setCurrentPage(page),
  }}
            rowKey="_id"
          /></div>
)}
</div></div>

         {/* Edit Modal */}
<Modal 
  title="Edit User" 
  open={showEditModal} 
  onCancel={() => setShowEditModal(false)} 
  onOk={handleEditSubmit}
>
  <Form>
    <Form.Item label="First Name">
      <Input
        value={updatedUser.firstName}
        onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Last Name">
      <Input
        value={updatedUser.lastName}
        onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Email">
      <Input
        type="email"
        value={updatedUser.email}
        onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="New Password">
      <Input.Password
        value={updatedUser.password}
        onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
        placeholder="Leave blank to keep current password"
      />
    </Form.Item>
  </Form>
</Modal>


          {/* Create Modal */}
          <Modal
      title="Create New User"
      open={showCreateModal}
      onCancel={() => setShowCreateModal(false)}
      onOk={handleCreateSubmit}
    >
      <Form layout="vertical" onFinish={handleCreateSubmit}>
        <Form.Item label="First Name" required>
          <Input
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Last Name" required>
          <Input
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Email" required>
          <Input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Password" required>
          <Input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Confirm Password" required>
          <Input
            type="password"
            value={newUser.confirmPassword}
            onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
          />
        </Form.Item>
    
        
      </Form>
    </Modal>

    <Modal
  title="Confirm Deletion"
  open={isModalVisible}
  onOk={handleOk} // Trigger delete confirmation
  onCancel={() => setIsModalVisible(false)} // Close the modal when canceled
>
  <p>Type "delete" to confirm deletion:</p>
  <Input 
    value={confirmText} // Use confirmText for the input field
    onChange={(e) => setConfirmText(e.target.value)} // Update confirmText state
    placeholder="Type 'delete' to confirm"
  />
</Modal>

        </main>
      </section>
    </div>
  );
};

export default Student;
