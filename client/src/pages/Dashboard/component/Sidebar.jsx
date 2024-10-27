import React, { useEffect, useRef, useState} from 'react';
import Logo from '../../../assets/logo.png';
import { useLocation, Link } from 'react-router-dom';
import { FaTachometerAlt, FaIdCard, FaPencilAlt, FaTag, FaComments, FaClipboardList } from 'react-icons/fa'; // Import new icons from react-icons
import axios from 'axios';
import { Badge } from 'antd'; // Import Badge from antd

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
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            <FaTachometerAlt className="icon" />Dashboard
            </Link>
          </li>
          <li className="divider" data-text="main">Main</li>
          <li>
            <Link to="/student" className={isActive('/student') ? 'active' : ''}>
            <FaIdCard className="icon" /> Student Management
            </Link>
          </li>
          <li>
            <Link to="/post" className={isActive('/post') ? 'active' : ''}>
            <FaPencilAlt className="icon" /> Post Management
            </Link>
          </li>
          <li>
            <Link to="/comments" className={isActive('/comments') ? 'active' : ''}>
            <FaComments className="icon" /> Comment Management
            </Link>
          </li>
          <li className="divider" data-text="main">Tools</li>
        <li>
          <Link to="/keywords" className={isActive('/keywords') ? 'active' : ''}>
            <FaTag className="icon" /> Multi-keywords
          </Link>
        </li>
          <li className="divider" data-text="main">Reports & Feedback</li>
        <li>
          <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>
            <FaClipboardList className="icon" /> Reports
            <Badge count={reportCount} style={{ marginLeft: 5 }} />
          </Link>
        </li>
        <li>
          <Link to="/feedback" className={isActive('/feedback') ? 'active' : ''}>
            <FaComments className="icon" /> Feedback

          </Link>
        </li>
          <li className="divider" data-text="main">Logs</li>
        <li>
          <Link to="/studentlogs" className={isActive('/studentlogs') ? 'active' : ''}>
            <i className='bx bxs-book icon'></i> Student Activity
          </Link>
        </li>
        </ul>
      </section>
  );
};

export default Sidebar;
