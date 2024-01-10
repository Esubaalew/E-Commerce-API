// LandingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  const [userId, setUserId] = useState('123');
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const preferencesResponse = await axios.get(`http://localhost:3001/api/preferences/${userId}`);
        setPreferences(preferencesResponse.data);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  return (
    <div className="landing-page">
      <h1>User Preferences</h1>
      <p>User ID: {userId}</p>
      <p>Budget: {preferences.budget}</p>
      <p>Categories: {preferences.categories}</p>
      <p>Time Spent - Clothing: {preferences.timeSpentClothing}</p>
      <p>Time Spent - Cars: {preferences.timeSpentCars}</p>
      <p>Time Spent - Electronics: {preferences.timeSpentElectronics}</p>
    </div>
  );
};

export default LandingPage;
