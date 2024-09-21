import React, { useEffect, useRef } from 'react';
import Logo from '../../assets/logo.png';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();

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

    allDropdown.forEach(item => {
      const a = item.parentElement.querySelector('a:first-child');
      a.addEventListener('click', handleClickDropdown);
    });

    toggleSidebar.addEventListener('click', handleClickSidebar);

    return () => {
      allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.removeEventListener('click', handleClickDropdown);
      });
      toggleSidebar.removeEventListener('click', handleClickSidebar);
    };
  }, []);

   // Function to check if the current route matches the link's href
   const isActive = (path) => location.pathname === path;

  return (
    <section id="sidebar" ref={sidebarRef}>
        <div className="brand">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="text">NU Pals</span>
        </div>
        <ul className="side-menu">
          <li>
            <Link to="/super/dashboard" className={isActive('/super/dashboard') ? 'active' : ''}>
              <i className='bx bxs-dashboard icon'></i> Dashboard
            </Link>
          </li>
          <li className="divider" data-text="main">Main</li>
          <li>
            <Link to="/super/admin" className={isActive('/super/admin') ? 'active' : ''}>
              <i className='bx bxs-user icon'></i> Admin Management
            </Link>
          </li>
          <li>
            <Link to="/super/post" className={isActive('/super/post') ? 'active' : ''}>
              <i className='bx bxs-widget icon'></i> Post Management
            </Link>
          </li>
          <li>
            <Link to="/super/logs" className={isActive('/super/logs') ? 'active' : ''}>
              <i className='bx bxs-cog icon'></i> System Logs
            </Link>
          </li>
        </ul>
      </section>
  );
};

export default Sidebar;
