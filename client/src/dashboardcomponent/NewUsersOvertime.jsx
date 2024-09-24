import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {  Spin } from 'antd';
import axios from 'axios';



const NewUsersOverTime = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/newusersovertime'); // Adjust the endpoint as needed
        setData(response.data);
      } catch (error) {
        console.error('Error fetching new users data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const chartData = {
    options: {
      chart: {
        id: 'new-users-chart',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: data.map(item => item.date),
        title: {
          text: 'Date',
        },
      },
      yaxis: {
        title: {
          text: 'New Users',
        },
      },

    },
    series: [
      {
        name: 'New Users',
        data: data.map(item => item.newUsers),
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <div className="loading-spinner"><Spin size="small" /></div>
      ) : (
        <Chart options={chartData.options} series={chartData.series} type="line" height={300} />
      )}
    </div>
  );
};

export default NewUsersOverTime;
