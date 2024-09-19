import React, { useState, useEffect, useRef, useContext } from 'react';
import './style.css'; // Import your CSS file here
import { UserContext } from '../../../context/userContext';
import Logo from '../../assets/logo.png';
import userlogo from '../../assets/userlogo.png';
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS
import axios from 'axios';
import {toast} from 'react-hot-toast'


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

 
  }, []);

  const [postContent, setPostContent] = useState('');  // Text content state
  const [image, setImage] = useState(null);            // Image upload state
  const [video, setVideo] = useState(null);            // Video upload state
  const [base64String, setBase64String] = useState(''); // Base64 for file upload

  // Handle file input (image or video)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxSize) {
      toast.error('File size exceeds 10MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      setBase64String(base64);  // Save base64 string
    };

    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
      setImage(file);
      setVideo(null); // Clear video if an image is selected
    } else if (file.type.includes('video')) {
      reader.readAsDataURL(file);
      setVideo(file);
      setImage(null); // Clear image if a video is selected
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', postContent);
    formData.append('media', base64String);

    axios.post('/createuserposting', formData)
      .then((response) => {
        setPostContent('');  // Reset form fields
        setImage(null);
        setVideo(null);
        setBase64String('');
        toast.success('Post created successfully');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error creating post');
      });
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <section id="sidebar" ref={sidebarRef}>
      <div className="brand">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="text">NU Pals</span>
        </div>
        <ul className="side-menu">
          <li><a href="/dashboard" className="active"><i className='bx bxs-dashboard icon'></i> Dashboard</a></li>
          <li className="divider" data-text="main">Main</li>
          <li><a href="/users"><i className='bx bxs-user icon'></i> Users</a></li>
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
                  <p>Total Users</p>
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
                  <p>Total Post</p>
                </div>
                <i className='bx bx-trending-down icon down'></i>
              </div>
              <span className="progress" data-value="60%"></span>
              <span className="label">60%</span>
            </div>

          </div>
          <div className="data">

          <div className="content-data">
      <div className="head">
        <h3>Create a Post</h3>
      </div>

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="postContent" className="form-label">Post Content</label>
          <textarea 
            className="form-control" 
            id="postContent" 
            rows="3" 
            placeholder="What's on your mind?" 
            value={postContent} 
            onChange={(e) => setPostContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="postImage" className="form-label">Upload Image / Video</label>
          <input 
            className="form-control" 
            type="file" 
            id="postImage" 
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview Image */}
        {image && (
          <div className="displayImg">
            <img src={URL.createObjectURL(image)} alt="Uploaded Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        {/* Preview Video */}
        {video && (
          <div className="displayImg">
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <button type="submit" className="btn btn-primary">Post</button>
      </form>
    </div>


</div>

        </main>
      </section>
    </div>
  );
};

export default App;
