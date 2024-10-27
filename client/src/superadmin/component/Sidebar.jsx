import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../assets/logo.png';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Badge } from 'antd'; // Import Badge from antd
import { FaTachometerAlt, FaUserShield,FaExclamationTriangle, FaIdCard, FaTag, FaPencilAlt, FaComments, FaPaperPlane, FaUsers, FaClipboardList } from 'react-icons/fa'; // Import new icons from react-icons

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Adjust based on your mobile breakpoint

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const allDropdown = sidebar.querySelectorAll('.side-dropdown');
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
    const allSideDivider = sidebar.querySelectorAll('.divider');

    const fetchCounts = async () => {
      try {
        const response = await axios.get('/getFeedbackReportCount');
        const data = response.data; 
        setFeedbackCount(data.feedbackCount);
        setReportCount(data.reportCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();

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

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && sidebar.classList.contains('hide')) {
        sidebar.classList.remove('hide'); // Ensure sidebar is visible on larger screens
      }
    };

    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.addEventListener('click', handleClickDropdown);
    });

    toggleSidebar.addEventListener('click', handleClickSidebar);
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => {
      allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.removeEventListener('click', handleClickDropdown);
      });
      toggleSidebar.removeEventListener('click', handleClickSidebar);
      window.removeEventListener('resize', handleResize); // Clean up resize listener
    };
  }, []);

  // Function to check if the current route matches the link's href
  const isActive = (path) => location.pathname === path;

  return (
    <section id="sidebar" ref={sidebarRef} className={isMobile ? 'hide' : ''}>
      <div className="brand">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="text">NU Pals</span>
      </div>
      <ul className="side-menu">
        <li>
          <Link to="/super/dashboard" className={isActive('/super/dashboard') ? 'active' : ''}>
            <FaTachometerAlt className="icon" /> Dashboard
          </Link>
        </li>
        <li className="divider" data-text="main">Main</li>
        <li>
          <Link to="/super/admin" className={isActive('/super/admin') ? 'active' : ''}>
            <FaUserShield className="icon" /> Admin Management
          </Link>
        </li>
        <li>
          <Link to="/super/student" className={isActive('/super/student') ? 'active' : ''}>
            <FaIdCard className="icon" /> Student Management
          </Link>
        </li>
        <li>
          <Link to="/super/post" className={isActive('/super/post') ? 'active' : ''}>
            <FaPencilAlt className="icon" /> Post Management
          </Link>
        </li>
        <li>
          <Link to="/super/comments" className={isActive('/super/comments') ? 'active' : ''}>
            <FaComments className="icon" /> Comment Management
          </Link>
        </li>
        <li>
          <Link to="/super/message" className={isActive('/super/message') ? 'active' : ''}>
            <FaPaperPlane className="icon" /> Message Management
          </Link>
        </li>
        <li>
          <Link to="/super/groupmessage" className={isActive('/super/groupmessage') ? 'active' : ''}>
            <FaUsers className="icon" /> Group Message
          </Link>
        </li>
        <li className="divider" data-text="main">Tools</li>
        <li>
          <Link to="/super/keywords" className={isActive('/super/keywords') ? 'active' : ''}>
            <FaTag className="icon" /> Multi-keywords
          </Link>
        </li>
        <li>
          <Link to="/super/stopwords" className={isActive('/super/stopwords') ? 'active' : ''}>
          <FaExclamationTriangle className="icon" /> Stopwords
          </Link>
        </li>
        <li className="divider" data-text="main">Reports & Feedback</li>
        <li>
          <Link to="/super/reports" className={isActive('/super/reports') ? 'active' : ''}>
            <FaClipboardList className="icon" /> Reports
            <Badge count={reportCount} style={{ marginLeft: 5 }} />
          </Link>
        </li>
        <li>
          <Link to="/super/feedback" className={isActive('/super/feedback') ? 'active' : ''}>
            <FaComments className="icon" /> Feedback
          </Link>
        </li>
        <li className="divider" data-text="main">Logs</li>
        <li>
          <Link to="/super/studentlogs" className={isActive('/super/studentlogs') ? 'active' : ''}>
            <i className='bx bxs-book icon'></i> Student Activity
          </Link>
        </li>
        <li>
          <Link to="/super/adminlogs" className={isActive('/super/adminlogs') ? 'active' : ''}>
            <i className='bx bxs-user-check icon'></i> Admin Activity
          </Link>
        </li>
        <li>
          <Link to="/super/systemlogs" className={isActive('/super/systemlogs') ? 'active' : ''}>
            <i className='bx bxs-cog icon'></i> System Update Logs
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
