import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import CustomerDashboard from './components/Dashboards/CustomerDashboard';
import StaffDashboard from './components/Dashboards/StaffDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('roomsync_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('roomsync_user', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('roomsync_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('roomsync_user');
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Welcome />} />

            <Route
              path="/login"
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={`/${user.role}`} />}
            />

            <Route
              path="/signup"
              element={!user ? <Signup onSignup={handleSignup} /> : <Navigate to={`/${user.role}`} />}
            />

            <Route
              path="/admin"
              element={user?.role === 'admin'
                ? <AdminDashboard user={user} onLogout={handleLogout} />
                : <Navigate to="/login" />}
            />

            <Route
              path="/customer"
              element={user?.role === 'customer'
                ? <CustomerDashboard user={user} onLogout={handleLogout} />
                : <Navigate to="/login" />}
            />

            <Route
              path="/staff"
              element={user?.role === 'staff'
                ? <StaffDashboard user={user} onLogout={handleLogout} />
                : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;