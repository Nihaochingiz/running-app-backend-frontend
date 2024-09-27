import React, { useState } from 'react';
import './RecordForm.css'; // Import the CSS file for styles

const RecordForm = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    date: '',
    distance: '',
    time: '',
    createdAt: new Date().toISOString()
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, { ...formData, createdAt: new Date().toISOString() }]);
    setFormData({
      date: '',
      distance: '',
      time: '',
    });
  };

  return (
    <div className="record-form">
      <h1>Create Running Statistic</h1>
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
        <button type="submit">Add Record</button>
      </form>
      <div className="statistics-container">
        <h2>Running Statistics</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              <div className="record-item">
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString('en-CA')}</p>
                <p><strong>Distance:</strong> {record.distance} km</p>
                <p><strong>Time:</strong> {record.time} min</p>
                <p><strong>Created At:</strong> {new Date(record.createdAt).toLocaleString('ru-RU')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecordForm;
