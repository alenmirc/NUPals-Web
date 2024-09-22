import React, { useEffect, useState, useContext } from 'react';
import './style.css'; // Import your CSS file here
import Navbar from './component/Navbar'; // Import the Navbar component
import Sidebar from './component/Sidebar'; 
import axios from 'axios';
import Chart from 'react-apexcharts';
import {toast} from 'react-hot-toast'
import { UserContext } from '../../../context/userContext';



const Dashboard = () => {

  const { user  } = useContext(UserContext); // Get user info from context
const userId = user?.id;

  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalAdmin: 0,
    totalStudent: 0,
    totalPosts: 0,
    totalLogs: 0,
    newUsersToday: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('/counts');
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  //apex chart

  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: [],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

  useEffect(() => {
    const fetchLoggedInCounts = async () => {
      try {
        const response = await axios.get('/getloggedin'); // Adjust the route
        setData(response.data);

        // Prepare the chart data
        const dates = response.data.map(entry => entry._id); // Dates
        const counts = response.data.map(entry => entry.count); // Counts

        setChartOptions(prevOptions => ({
          ...prevOptions,
          xaxis: {
            categories: dates,
          },
        }));

        setSeries([{ name: 'Logged In Users', data: counts }]);
      } catch (error) {
        console.error('Error fetching logged-in users count:', error);
      }
    };

    fetchLoggedInCounts();
  }, []);

  const [series, setSeries] = useState([]);

  //post
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
       <Sidebar /> {/* Sidebar component */}

      {/* NAVBAR */}
      <section id="content">
        <Navbar /> {/* Use the Navbar component here */}

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
                  <h2 style={{ fontSize: '30px' }}>{counts.totalStudent}</h2>
                  <p>Total Students</p>
                </div>           
                <i className='bx bx-user icon' style={{ color: 'blue' }}></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                <h2 style={{ fontSize: '30px' }}>{counts.totalAdmin}</h2>
                  <p>Total Admin</p>
                </div>
                <i className='bx bx-user-circle icon' style={{ color: 'blue' }}></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2 style={{ fontSize: '30px' }}>{counts.totalPosts}</h2>
                  <p>Total Post</p>
                </div>
                <i className='bx bx-news icon' style={{ color: 'blue' }}></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2 style={{ fontSize: '30px' }}>{counts.totalLogs}</h2>
                  <p>Total Logs</p>
                </div>
                <i className='bx bx-cog icon' style={{ color: 'blue' }}></i>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Logged In Users</h3>
              </div>
              <div className="chart">
                <div id="chart">
                <Chart
        options={chartOptions}
        series={series}
        type="line"
        height={350}
      />
                </div>
              </div>
            </div>
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

export default Dashboard;
