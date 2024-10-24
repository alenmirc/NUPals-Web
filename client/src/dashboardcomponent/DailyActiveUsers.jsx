import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { Spin } from 'antd';

const DailyActiveUsersChart = () => {
  const [data, setData] = useState({
    series: [{ name: 'Active Users', data: [] }],
    options: {
      chart: { type: 'line', height: 350 },
      xaxis: { categories: [] }
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchDailyActiveUsers = async () => {
    try {
      const response = await axios.get('/getdailyactiveusers');
      const weeklyReport = response.data.weeklyActiveUsers;

      // Extract the data needed for the chart
      const dates = weeklyReport.map(item => item.date); // Array of dates
      const activeUsersCounts = weeklyReport.map(item => item.activeUsers); // Array of active users counts

      setData({
        series: [{
          name: 'Active Users',
          data: activeUsersCounts // Active users per day
        }],
        options: {
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: dates, // Dates for the x-axis
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
    return <div className="loading-spinner"><Spin size="small" /></div>; // Show loading spinner while fetching
  }

  return (
    <div>
      <Chart options={data.options} series={data.series} type="line" height={350} />
    </div>
  );
};

export default DailyActiveUsersChart;
