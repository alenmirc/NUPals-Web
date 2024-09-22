import React, { useEffect, useState } from 'react';
import './style.css'; // Import your CSS file here
import Navbar from './component/Navbar'; // Import the Navbar component
import Sidebar from './component/Sidebar'; 
import axios from 'axios';
import Chart from 'react-apexcharts';

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
                <h3>News</h3>
              
              </div>
            
          
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
