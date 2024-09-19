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


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/getallpost'); // Changed endpoint to /getallposts
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSort = (column) => {
    const direction = sortedColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortedColumn(column);
    setSortDirection(direction);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (!sortedColumn) return 0;
    const aValue = a[sortedColumn];
    const bValue = b[sortedColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post =>
    Object.values(post).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleDelete = async () => {
    try {
      await axios.delete(`/admindeletepost/${postIdToDelete}`);
      setPosts(posts.filter(post => post._id !== postIdToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting post:', error);
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
          <li><a href="/users" ><i className='bx bxs-user icon'></i> Users</a></li>
          <li><a href="/post" className="active"><i className='bx bxs-widget icon'></i> Posting</a></li>
      

         
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
          <h1 className="title">Posting</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Posting</a></li>
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

          <Table striped bordered hover>
            <thead>
              <tr>
                <th onClick={() => handleSort('userId.firstName')}>User First Name</th>
                <th onClick={() => handleSort('userId.lastName')}>User Last Name</th>
                <th onClick={() => handleSort('content')}>Content</th>
                <th onClick={() => handleSort('media')}>Media</th>
                <th onClick={() => handleSort('createdAt')}>Created At</th>
                <th onClick={() => handleSort('updatedAt')}>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map(post => (
                
                <tr key={post._id}>
        
                  <td>{post.userId.firstName}</td>
                  <td>{post.userId.lastName}</td>
                  <td>{post.content}</td>
                  <td>
                    {post.media && (
                      <img src={post.media} alt="Media" style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>{new Date(post.updatedAt).toLocaleString()}</td>
                  <td>
                    <Button variant="primary" size="sm">Edit</Button>
                    <Button variant="danger" size="sm" className="ml-2" onClick={() => {
                      setShowDeleteModal(true);
                      setPostIdToDelete(post._id);
                    }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between">
            <div>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPosts.length)} of {filteredPosts.length} entries
            </div>
            <div>
              <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
              <span className="mx-2">{currentPage}</span>
              <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>  </div></div>
        </main>
      </section>

       {/* Delete confirmation modal */}
       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>


    </div>
  
  );
};

export default App;
