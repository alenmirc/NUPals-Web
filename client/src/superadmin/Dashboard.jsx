import React, { useEffect, useState } from 'react';
import './style.css'; // Import your CSS file here
import Navbar from './component/Navbar'; // Import the Navbar component
import Sidebar from './component/Sidebar'; 
import axios from 'axios';
import NewUsersOverTime from '../dashboardcomponent/NewUsersOvertime';
import CreatePost from '../dashboardcomponent/CreatePost';
import MostLikedPost from '../dashboardcomponent/MostLikedPost';
import MostCommentedPost from '../dashboardcomponent/MostCommentedPost';
import EngagementMetrics from '../dashboardcomponent/EngagementMetrics';
import DailyActiveUsers from '../dashboardcomponent/DailyActiveUsers';
import TopInterest from '../dashboardcomponent/TopInterest';
import TopCategories from '../dashboardcomponent/TopCategories';
import { Skeleton } from 'antd'; // Import Skeleton from Ant Design

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalAdmin: 0,
    totalStudent: 0,
    totalPosts: 0,
    totalLogs: 0,
    newUsersToday: 0,
  });
  
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('/counts');
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
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
            {/* Display Skeleton if loading, otherwise show counts */}
            <div className="card">
              <div className="head">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <>
                    <div>
                      <h2 style={{ fontSize: '30px' }}>{counts.totalAdmin}</h2>
                      <p>Total Admin</p>
                    </div>
                    <i className='bx bx-user-circle icon' style={{ color: 'blue' }}></i>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="head">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <>
                    <div>
                      <h2 style={{ fontSize: '30px' }}>{counts.totalStudent}</h2>
                      <p>Total Students</p>
                    </div>           
                    <i className='bx bx-user icon' style={{ color: 'blue' }}></i>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="head">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <>
                    <div>
                      <h2 style={{ fontSize: '30px' }}>{counts.totalPosts}</h2>
                      <p>Total Posts</p>
                    </div>
                    <i className='bx bx-news icon' style={{ color: 'blue' }}></i>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="head">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <>
                    <div>
                      <h2 style={{ fontSize: '30px' }}>{counts.totalLogs}</h2>
                      <p>Total Logs</p>
                    </div>
                    <i className='bx bx-cog icon' style={{ color: 'blue' }}></i>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>Daily Active Users</h3>
              </div>
              <DailyActiveUsers />  
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Engagement Metrics</h3>
              </div>
              <EngagementMetrics />  
            </div>
          </div>

          <div className="info-data">
            <div className="card">
              <div className="head">
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Most Liked Post</h2>
                <div></div>
              </div>
              <MostLikedPost />  
            </div>
            <div className="card">
              <div className="head">
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Most Commented Post</h2>
                <div></div>
              </div>
              <MostCommentedPost />  
            </div>
            <div className="card">
              <div className="head">
                <div></div>
              </div>
              <TopInterest />  
            </div>
            <div className="card">
              <div className="head">
                <div></div>
              </div>
              <TopCategories />  
            </div>
          </div>

          <div className="data">
            <div className="content-data">
              <div className="head">
                <h3>New Users Over Time</h3>
              </div>
              <NewUsersOverTime />  
            </div>
            <div className="content-data">
              <div className="head">
                <h3>Create Post</h3>
              </div>
              <CreatePost />  
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
