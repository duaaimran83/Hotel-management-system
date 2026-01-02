import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './Login.css';

// 1. Accept the 'onLogin' prop from App.js
const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 2. Call your Backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 3. CRITICAL FIX: Tell App.js the user is logged in
        // App.js will update its state and automatically redirect you
        onLogin(data.user);
        
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>RoomSync</h1>
          <p>Hotel Management & Booking Portal</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px' 
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-info">
          <p><strong>Demo:</strong> Use admin@roomsync.com / 123</p>
        </div>

        <div className="login-footer">
          <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
          <button className="back-to-home" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;