import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd'; // Import Spin from Ant Design

const TopInterestsAndCategories = () => {
  const [data, setData] = useState({ specificInterests: [], topCategories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopInterestsAndCategories = async () => {
    try {
      const response = await axios.get('/getTopInterestsAndCategories');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopInterestsAndCategories();
  }, []);

  if (loading) return <Spin size="large" />; // Display loading spinner while fetching data
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Top Interests</h2>

      <ul>
        {data.specificInterests.map((interest, index) => (
          <li key={index}>{interest}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopInterestsAndCategories;
