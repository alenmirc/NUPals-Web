import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Form, Button, InputGroup, Modal  } from 'react-bootstrap';
import './style.css'; // Import your CSS file here
import { UserContext } from '../../../context/userContext';
import Logo from '../../assets/logo.png';
import userlogo from '../../assets/userlogo.png';
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS
import axios from 'axios';

const App = () => {
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  const sidebarRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const allDropdown = sidebar.querySelectorAll('.side-dropdown');
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
    const allSideDivider = sidebar.querySelectorAll('.divider');

    const handleClickDropdown = (e) => {
      e.preventDefault();
      const item = e.target.closest('a');
      if (!item.classList.contains('active')) {
        allDropdown.forEach(i => {
          const aLink = i.parentElement.querySelector('a:first-child');
          aLink.classList.remove('active');
          i.classList.remove('show');
        });
      }
      item.classList.toggle('active');
      item.nextElementSibling.classList.toggle('show');
    };

    const handleClickSidebar = () => {
      sidebar.classList.toggle('hide');
      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
        allDropdown.forEach(item => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
      } else {
        allSideDivider.forEach(item => {
          item.textContent = item.dataset.text;
        });
      }
    };

    const handleMouseLeaveSidebar = () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
      }
    };

    const handleMouseEnterSidebar = () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
        allSideDivider.forEach(item => {
          item.textContent = item.dataset.text;
        });
      }
    };

    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.addEventListener('click', handleClickDropdown);
    });

    toggleSidebar.addEventListener('click', handleClickSidebar);
    sidebar.addEventListener('mouseleave', handleMouseLeaveSidebar);
    sidebar.addEventListener('mouseenter', handleMouseEnterSidebar);

    return () => {
      // Cleanup event listeners
      allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.removeEventListener('click', handleClickDropdown);
      });
      toggleSidebar.removeEventListener('click', handleClickSidebar);
      sidebar.removeEventListener('mouseleave', handleMouseLeaveSidebar);
      sidebar.removeEventListener('mouseenter', handleMouseEnterSidebar);
    };
  }, []);

  const handleProfileClick = () => {
    setProfileDropdownVisible(prev => !prev);
  };

  const handleMenuClick = (index) => {
    setMenuVisible(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/getusers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (column) => {
    const direction = sortedColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortedColumn(column);
    setSortDirection(direction);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortedColumn) return 0;
    const aValue = a[sortedColumn];
    const bValue = b[sortedColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    Object.values(user).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    skills: [],
    roles: [],
    profilePicture: ''
  });
  const [updatedUser, setUpdatedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    skills: [],
    roles: [],
    profilePicture: ''
  });

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setUpdatedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`/deleteuser/${userId}`);
      fetchUsers();
      toast.success('Profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/updateuser/${currentUser._id}`, updatedUser);
      fetchUsers();
      setShowEditModal(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await axios.post('/createuser', newUser);
      fetchUsers();
      setShowCreateModal(false);
      toast.success('New user created!');
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        department: '',
        skills: [],
        roles: [],
        profilePicture: ''
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };


const [userData, setUserData] = useState(null);
const [firstName, setFirstName] = useState('');
const [email, setEmail] = useState('');
const [lastName, setLastName] = useState('');
const [profilePicture, setProfilePicture] = useState(''); // Add profilePicture state

const { user, logout } = useContext(UserContext); // Get user info from context
const userId = user?.id;

useEffect(() => {
  if (userId) {
    axios.get(`/getUserprofile?userId=${userId}`)
      .then(response => {
        console.log(response.data); // Log the userData received from the API
        setUserData(response.data);
        setFirstName(response.data.firstName || ''); // Ensure empty string if data is not available
        setLastName(response.data.lastName || '');
        setEmail(response.data.email || ''); // Ensure empty string if data is not available
        setProfilePicture(response.data.profilePicture);
      })
      .catch(error => {
        console.error(error);
      });
  }
}, [userId]);

  useEffect(() => {
    // Progress bar
    const allProgress = document.querySelectorAll('main .card .progress');
    allProgress.forEach(item => {
      item.style.setProperty('--value', item.dataset.value);
    });

    // ApexCharts
    const options = {
      series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }, []);

  
  return (
    <div className="app">
      {/* SIDEBAR */}
      <section id="sidebar" ref={sidebarRef}>
      <div className="brand">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="text">NU Pals</span>
        </div>
        <ul className="side-menu">
          <li><a href="/dashboard"><i className='bx bxs-dashboard icon'></i> Dashboard</a></li>
          <li className="divider" data-text="main">Main</li>
          <li><a href="/users" className="active"><i className='bx bxs-user icon'></i> Users</a></li>
          <li><a href="/post"><i className='bx bxs-widget icon'></i> Posting</a></li>
      

         
        </ul>
      
      </section>

      {/* NAVBAR */}
      <section id="content">
      <nav>
          <i className='bx bx-menu toggle-sidebar'></i>
          <form action="#">
          <div className="welcome-message">
    Admin
  </div>
          </form>
          <a href="#" className="nav-link">
            <i className='bx bxs-bell icon'></i>

          </a>
          <a href="#" className="nav-link">
            <i className='bx bxs-message-square-dots icon'></i>
          </a>
          <span className="divider"></span>
          <div className="welcome-message">
    Welcome, {firstName}!
  </div>
          <div className="profile" ref={profileRef}>
          <img src={profilePicture || userlogo} alt="" onClick={handleProfileClick} />
            <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}>
              <li><a href="#"><i className='bx bxs-user-circle icon'></i> Profile</a></li>
              <li><a href="#"><i className='bx bxs-cog'></i> Settings</a></li>
              <li><a href="#" onClick={logout}><i className='bx bxs-log-out-circle'></i> Logout</a></li>
            </ul>
          </div>
        </nav>


        {/* MAIN */}
        <main>
          <h1 className="title">Users</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Users</a></li>
          </ul>
         
          <div className="data">
  <div className="content-data">
    <div className="head">
      <div className="left">
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>
      <div className="right">
        <Button variant="success" onClick={() => setShowCreateModal(true)}>Create New User</Button>
      </div>
    </div>

    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Profile</th>
            <th onClick={() => handleSort('firstName')}>First Name</th>
            <th onClick={() => handleSort('lastName')}>Last Name</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th onClick={() => handleSort('department')}>Department</th>
            <th style={{ width: '150px' }} onClick={() => handleSort('skills')}>Skills</th>
            <th onClick={() => handleSort('roles')}>Roles</th>
            <th onClick={() => handleSort('createdAt')}>Created At</th>
            <th onClick={() => handleSort('updatedAt')}>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id}>
              <td>
                <img src={user.profilePicture || userlogo} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td className="text-truncate" style={{ maxWidth: '150px' }}>{user.skills}</td>
              <td>{user.roles}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDeleteClick(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
            {/* Pagination controls */}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.firstName}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.lastName}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.department}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, department: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formSkills">
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.skills.join(', ')}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, skills: e.target.value.split(', ') })}
                  />
                </Form.Group>
                <Form.Group controlId="formRoles">
                  <Form.Label>Roles</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.roles.join(', ')}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, roles: e.target.value.split(', ') })}
                  />
                </Form.Group>
                <Form.Group controlId="formProfilePicture">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.profilePicture}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, profilePicture: e.target.value })}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleEditSubmit}>
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formSkills">
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.skills.join(', ')}
                    onChange={(e) => setNewUser({ ...newUser, skills: e.target.value.split(', ') })}
                  />
                </Form.Group>
                <Form.Group controlId="formRoles">
                  <Form.Label>Roles</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.roles.join(', ')}
                    onChange={(e) => setNewUser({ ...newUser, roles: e.target.value.split(', ') })}
                  />
                </Form.Group>
                <Form.Group controlId="formProfilePicture">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.profilePicture}
                    onChange={(e) => setNewUser({ ...newUser, profilePicture: e.target.value })}
                  />
                </Form.Group>
                <Button variant="success" onClick={handleCreateSubmit}>
                  Create User
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <div className="d-flex justify-content-between mt-3">
      <div>
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
      </div>
      <div>
        <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
        <span className="mx-2">{currentPage}</span>
        <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
      </div>        
    </div>
  </div>
</div>
        </main>
      </section>
    </div>
  );
};

export default App;
