// client/src/App.js
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the server message
    fetch('http://localhost:5000/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Fetch error:', err));
    
    // Fetch achievements from database
    fetch('http://localhost:5000/api/achievements')
      .then(res => res.json())
      .then(data => {
        setAchievements(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Achievement fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Math Adventure Game</h1>
      <p>{message ? message : 'Loading server message...'}</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Achievements from Database</h2>
        {loading ? (
          <p>Loading achievements...</p>
        ) : achievements.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {achievements.map(achievement => (
              <li key={achievement.achievement_id} style={{ 
                margin: '10px', 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                <p>Points required: {achievement.points_required}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No achievements found in database</p>
        )}
      </div>
    </div>
  );
}

export default App;