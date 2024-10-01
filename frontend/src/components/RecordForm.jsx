import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './RecordForm.css';

const RecordForm = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    date: '',
    distance: '',
    time: '',
  });

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Function to fetch all statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:3000/running-statistics');
      setRecords(response.data.statistics); // Adjust based on your response structure
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateStatistic(formData);
      } else {
        await createStatistic(formData);
      }
      // Reset form and fetch updated statistics
      resetForm();
      fetchStatistics();
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  // Create a new running statistic
  const createStatistic = async (stat) => {
    try {
      await axios.post('http://localhost:8000/running-statistics', stat);
    } catch (error) {
      console.error('Error creating statistic:', error);
    }
  };

  // Update an existing running statistic
  const updateStatistic = async (stat) => {
    try {
      await axios.put(`http://localhost:8000/running-statistics/${stat.id}`, {
        date: stat.date,
        distance: stat.distance,
        time: stat.time,
      });
    } catch (error) {
      console.error('Error updating statistic:', error);
    }
  };

  // Populate form with record data for editing
  const handleEdit = (record) => {
    const { id, date, distance, time } = record;
    setFormData({ id, date, distance, time });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({ id: '', date: '', distance: '', time: '' });
  };

  return (
    <div className="record-form">
      <h1>Create or Update Running Statistic</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="distance"
          placeholder="Distance (km)"
          value={formData.distance}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="time"
          placeholder="Time (min)"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <button type="submit">{formData.id ? 'Update Record' : 'Add Record'}</button>
      </form>

      <div className="statistics-container">
        <h2>Running Statistics</h2>
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <div className="record-item">
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString('ru-RU')}</p>
                <p><strong>Distance:</strong> {record.distance} km</p>
                <p><strong>Time:</strong> {record.time} min</p>
                <p><strong>Created At:</strong> {new Date(record.created_at).toLocaleString('ru-RU')}</p>
                <button onClick={() => handleEdit(record)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecordForm;
