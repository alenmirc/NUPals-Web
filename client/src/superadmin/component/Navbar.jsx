// Navbar.js
import React, { useState, useRef, useContext, useEffect } from 'react';
import { UserContext } from '../../../context/userContext';
import userlogo from '../../assets/userlogo.png';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';

const Navbar = () => {
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // Add profilePicture state

  const { user, logout } = useContext(UserContext); // Get user info from context
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      axios.get(`/getUserprofile?userId=${userId}`)
        .then(response => {
          setFirstName(response.data.firstName || '');
          setLastName(response.data.lastName || '');
          setEmail(response.data.email || '');
          setProfilePicture(response.data.profilePicture);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userId]);

  const handleProfileClick = () => {
    setProfileDropdownVisible((prev) => !prev);
  };

  return (
    <nav>
      <i className='bx bx-menu toggle-sidebar'></i>
      <form action="#">
        <div className="welcome-message">Super Admin</div>
      </form>
      <a href="#" className="nav-link">
        <i className='bx bxs-bell icon'></i>
      </a>
      <a href="#" className="nav-link">
        <i className='bx bxs-message-square-dots icon'></i>
      </a>
      <span className="divider"></span>

      <div className="profile" ref={profileRef}>
        <img
          src={profilePicture || userlogo}
          alt=""
          onClick={handleProfileClick}
        />
        <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}>
          <li className="user-info">
            <span>{firstName} {lastName}</span>
          </li>
          <li><a href="#"><i className='bx bxs-cog'></i> Settings</a></li>
          <li><a href="#" onClick={logout}><i className='bx bxs-log-out-circle'></i> Logout</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
