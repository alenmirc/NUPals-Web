import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Spin } from 'antd';

const EngagementMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/getengagementmetrics');
        if (response.data && Array.isArray(response.data)) {
          setMetrics(response.data);
        } else {
          setMetrics([]); // Ensure metrics is always an array
        }
      } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        setMetrics([]); // Handle errors gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return  <div className="loading-spinner"><Spin size="small" /></div>; // Show loading spinner while fetching
  }

  if (metrics.length === 0) {
    return <p>No metrics available.</p>; // Message if no metrics found
  }

  const dates = metrics.map((item) => item._id || 'Unknown Date'); // Ensure dates are not undefined
  const likes = metrics.map((item) => item.totalLikes || 0); // Fallback to 0 if likes are missing
  const comments = metrics.map((item) => item.totalComments || 0); // Fallback to 0 if comments are missing

  const chartOptions = {
    chart: {
      id: 'engagement-metrics',
      type: 'line', // Adjust chart type as needed
    },
    xaxis: {
      categories: dates, // Dates as X-axis categories
      labels: {
        rotate: -45, // Optional: Rotate labels for better readability
      },
    },
    yaxis: {
      title: {
        text: 'Engagement Metrics',
      },
    },
    dataLabels: {
      enabled: true, // Display values on data points
    },
    markers: {
      size: 5, // Marker size for data points
    },
    stroke: {
      curve: 'smooth', // Optional: Smooth out the lines
    },
  };

  const chartSeries = [
    {
      name: 'Likes',
      data: likes, // Data for likes
    },
    {
      name: 'Comments',
      data: comments, // Data for comments
    },
  ];

  return (
  
      <Chart options={chartOptions} series={chartSeries} type="line" />
  
  );
};

export default EngagementMetrics;
