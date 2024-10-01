import React from 'react';
import axios from 'axios';

const FetchStatisticsButton = () => {
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/running-statistics');
      console.log(response.data.statistics); // You can handle the statistics data as needed
      alert('Statistics fetched successfully!');
    } catch (error) {
      console.error('Error fetching statistics:', error);
      alert('Error fetching statistics. Check the console for details.');
    }
  };

  return (
    <button onClick={fetchStatistics}>
      Get Running Statistics
    </button>
  );
};

export default FetchStatisticsButton;