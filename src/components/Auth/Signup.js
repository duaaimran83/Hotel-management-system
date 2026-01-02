import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './Login.css';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [wealth, setWealth] = useState('');
  const [nameError, setNameError] = useState('');
  const [serverError, setServerError] = useState(''); // New state for server errors

  // --- YOUR CUSTOM VALIDATION LOGIC ---
  const validateName = (nameValue) => {
    if (!nameValue || nameValue.trim() === '') return 'Name is required.';
    if (/^\d+$/.test(nameValue.trim())) return 'Name cannot contain only numbers. Please include alphabets.';
    if (!/^[a-zA-Z0-9\s]+$/.test(nameValue.trim())) return 'Name can only contain alphabets, numbers, and spaces.';
    if (!/[a-zA-Z]/.test(nameValue.trim())) return 'Name must contain at least one alphabet.';
    if (nameValue.trim().length < 2) return 'Name must be at least 2 characters long.';
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // 1. Client-Side Validation
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      alert(nameValidationError);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // 2. Prepare Data (including Wealth logic)
    const wealthAmount = parseFloat(wealth) || 0;
    const VIP_WEALTH_THRESHOLD = 10000;
    const isVIP = wealthAmount >= VIP_WEALTH_THRESHOLD;

    try {
      // 3. Send to Backend
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          wealth: wealthAmount, // Sending wealth
          isVIP                 // Sending VIP status
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 4. Success: Update App state and redirect
        if (onSignup) {
          onSignup(data.user);
        }
        // Redirect handled by App.js usually, but we can double check
        // navigate(`/${role}`); 
      } else {
        // 5. Server Error (e.g. Email exists)
        setServerError(data.message);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setServerError("Failed to connect to server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>RoomSync</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Display Server Errors here */}
          {serverError && (
             <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
               {serverError}
             </div>
          )}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              className={nameError ? 'error-input' : ''}
              required
            />
            {nameError && <small style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{nameError}</small>}
            {!nameError && name && <small style={{ color: '#059669', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>✓ Valid name format</small>}
            {!nameError && !name && <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Name can contain alphabets and numbers</small>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          {role === 'customer' && (
            <div className="form-group">
              <label>Initial Wealth/Balance ($)</label>
              <input
                type="number"
                value={wealth}
                onChange={(e) => setWealth(e.target.value)}
                placeholder="Enter your wealth amount"
                min="0"
                step="0.01"
              />
              <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                VIP status requires $10,000+ wealth
              </small>
            </div>
          )}

          <div className="form-group">
            <label>Register as</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="staff">Staff / Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
          <button className="back-to-home" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;