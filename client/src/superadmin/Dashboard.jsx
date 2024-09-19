import React, { useState, useEffect, useRef, useContext } from 'react';
import Chart from 'react-apexcharts';
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
          <li><a href="/super/dashboard" className="active"><i className='bx bxs-dashboard icon'></i> Dashboard</a></li>
          <li className="divider" data-text="main">Main</li>
          <li><a href="/super/admin"><i className='bx bxs-user icon'></i> Admin Management</a></li>
          <li><a href="/super/post"><i className='bx bxs-widget icon'></i>Post Management</a></li>
          <li><a href="/super/logs"><i className='bx bxs-cog icon'></i> System Logs</a></li>

         
        </ul>
      
      </section>

      {/* NAVBAR */}
      <section id="content">
        <nav>
          <i className='bx bx-menu toggle-sidebar'></i>
          <form action="#">
          <div className="welcome-message">
    Super Admin
  </div>
          </form>
          <a href="#" className="nav-link">
            <i className='bx bxs-bell icon'></i>

          </a>
          <a href="#" className="nav-link">
            <i className='bx bxs-message-square-dots icon'></i>
          </a>
          <span className="divider"></span>

<div className="profile" ref={profileRef}>
  <img src={profilePicture || userlogo} alt="" onClick={handleProfileClick} />
  <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}>
    <li className="user-info">
      <span>{firstName} {lastName}</span>
    </li>
    <li><a href="#"><i className='bx bxs-cog'></i> Settings</a></li>
    <li><a href="#" onClick={logout}><i className='bx bxs-log-out-circle'></i> Logout</a></li>
  </ul>
</div>

        </nav>


        {/* MAIN */}
        <main>
          <h1 className="title">Dashboard</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Dashboard</a></li>
          </ul>
          <div className="info-data">
            <div className="card">
              <div className="head">
                <div>
                  <h2>1500</h2>
                  <p>Traffic</p>
                </div>
                <i className='bx bx-trending-up icon'></i>
              </div>
              <span className="progress" data-value="40%"></span>
              <span className="label">40%</span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>234</h2>
                  <p>Sales</p>
                </div>
                <i className='bx bx-trending-down icon down'></i>
              </div>
              <span className="progress" data-value="60%"></span>
              <span className="label">60%</span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>465</h2>
                  <p>Pageviews</p>
                </div>
                <i className='bx bx-trending-up icon'></i>
              </div>
              <span className="progress" data-value="30%"></span>
              <span className="label">30%</span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>235</h2>
                  <p>Visitors</p>
                </div>
                <i className='bx bx-trending-up icon'></i>
              </div>
              <span className="progress" data-value="80%"></span>
              <span className="label">80%</span>
            </div>
          </div>
          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Sales Report</h3>
                <div className="menu">
                  <i className='bx bx-dots-horizontal-rounded icon' onClick={() => handleMenuClick(0)}></i>
                  <ul className={`menu-link ${menuVisible[0] ? 'show' : ''}`}>
                    <li><a href="#">Edit</a></li>
                    <li><a href="#">Save</a></li>
                    <li><a href="#">Remove</a></li>
                  </ul>
                </div>
              </div>
              <div className="chart">
                <div id="chart"></div>
              </div>
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Chatbox</h3>
                <div className="menu">
                  <i className='bx bx-dots-horizontal-rounded icon'></i>
                  <ul className="menu-link">
                    <li><a href="#">Edit</a></li>
                    <li><a href="#">Save</a></li>
                    <li><a href="#">Remove</a></li>
                  </ul>
                </div>
              </div>
              <div className="chat-box">
                <p className="day"><span>Today</span></p>
                <div className="msg">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="" />
                  <div className="chat">
                    <div className="profile">
                      <span className="username">Alan</span>
                      <span className="time">18:30</span>
                    </div>
                    <p>Hello</p>
                  </div>
                </div>
                <div className="msg me">
                  <div className="chat">
                    <div className="profile">
                      <span className="time">18:30</span>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque voluptatum eos quam dolores eligendi exercitationem animi nobis reprehenderit laborum! Nulla.</p>
                  </div>
                </div>
                <div className="msg me">
                  <div className="chat">
                    <div className="profile">
                      <span className="time">18:30</span>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, architecto!</p>
                  </div>
                </div>
                <div className="msg me">
                  <div className="chat">
                    <div className="profile">
                      <span className="time">18:30</span>
                    </div>
                    <p>Lorem ipsum, dolor sit amet.</p>
                  </div>
                </div>
              </div>
              <form action="#">
                <div className="form-group">
                  <input type="text" placeholder="Type..." />
                  <button type="submit" className="btn-send"><i className='bx bxs-send'></i></button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default App;
