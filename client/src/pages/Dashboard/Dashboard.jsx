import React, { useEffect, useState } from 'react';
import './style.css'; // Import your CSS file here
import Navbar from './component/Navbar'; // Import the Navbar component
import Sidebar from './component/Sidebar'; 
import axios from 'axios';
import NewUsersOverTime from '../../dashboardcomponent/NewUsersOvertime';
import CreatePost from '../../dashboardcomponent/CreatePost';
import MostLikedPost from '../../dashboardcomponent/MostLikedPost';
import MostCommentedPost from '../../dashboardcomponent/MostCommentedPost';
import EngagementMetrics from '../../dashboardcomponent/EngagementMetrics';



const Dashboard = () => {

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
                <h3>New Users Overtime</h3>
              </div>
              <NewUsersOverTime />  
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Engagement Metrics</h3>
              
              </div>
              <EngagementMetrics />  
          
            </div>
          </div>
          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Most Liked Post</h3>
              </div>
              <MostLikedPost />  
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Most Commented Post</h3>
              
              </div>
              <MostCommentedPost />  
            </div>
            
          </div>
          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Create Post</h3>
              </div>
              <CreatePost />  
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Reports Overview</h3>
              </div>
   
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
