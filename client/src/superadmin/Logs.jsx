import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import './style.css'; // Import your CSS file here
import { UserContext } from '../../context/userContext';
import Logo from '../assets/logo.png';
import userlogo from '../assets/userlogo.png';
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
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/getLogs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching Logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSort = (column) => {
    const direction = sortedColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortedColumn(column);
    setSortDirection(direction);
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (!sortedColumn) return 0;
    const aValue = a[sortedColumn];
    const bValue = b[sortedColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLogs = sortedLogs.filter(log =>
    Object.values(log).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);


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

  return (
    <div className="app">
      {/* SIDEBAR */}
      <section id="sidebar" ref={sidebarRef}>
        <div className="brand">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="text">NU Pals</span>
        </div>
        <ul className="side-menu">
          <li><a href="/super/dashboard"><i className='bx bxs-dashboard icon'></i> Dashboard</a></li>
          <li className="divider" data-text="main">Main</li>
          <li><a href="/super/admin" ><i className='bx bxs-user icon'></i> Admin Management</a></li>
          <li><a href="/super/post"><i className='bx bxs-widget icon'></i>Post Management</a></li>
          <li><a href="/super/logs" className="active"><i className='bx bxs-cog icon'></i> System Logs</a></li>

         
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
          <h1 className="title">System Logs</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">System Logs</a></li>
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
              </div>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('level')}>Level</th>
                      <th onClick={() => handleSort('message')}>Message</th>
                      <th onClick={() => handleSort('adminName')}>Admin Name</th>
                      <th onClick={() => handleSort('timestamp')}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map(log => (
                      <tr key={log._id}>
                        <td>{log.level}</td>
                        <td>{log.message}</td>
                        <td>{log.adminName || 'N/A'}</td>
                        <td>{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
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
