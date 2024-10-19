import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { Spin } from 'antd';

const DailyActiveUsersChart = () => {
  const [data, setData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);

  const fetchDailyActiveUsers = async () => {
    try {
      const response = await axios.get('/getdailyactiveusers');
      const activeUsersCount = response.data.dailyActiveUsers;

      // Here you might want to set up the time range as well. 
      // For simplicity, we're assuming today is the only data point.
      const currentDate = new Date().toLocaleDateString();

      setData({
        series: [{
          name: 'Active Users',
          data: [activeUsersCount] // Replace with your actual data if needed
        }],
        options: {
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: [currentDate], // Replace with an array of dates if needed
          },
        },
      });
    } catch (error) {
      console.error('Error fetching daily active users:', error);
    } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDailyActiveUsers();
  }, []);

  if (loading) {
    return  <div className="loading-spinner"><Spin size="small" /></div>; // Show loading spinner while fetching
  }


  return (
    <div>
      <Chart options={data.options} series={data.series} type="line" height={350} />
    </div>
  );
};

export default DailyActiveUsersChart;
