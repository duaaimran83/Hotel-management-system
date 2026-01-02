import React, { useState, useEffect } from 'react';
import './AdminOverview.css';
import RoomManagement from './RoomManagement';
import UserManagement from './UserManagement';
import FacilityApproval from './FacilityApproval';
import Reports from './Reports';

const AdminOverview = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for Data
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  // --- 1. FETCH ALL DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Stats
        const statsRes = await fetch('http://localhost:5000/api/admin/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // B. Fetch Rooms
        const roomsRes = await fetch('http://localhost:5000/api/rooms');
        const roomsData = await roomsRes.json();
        setRooms(roomsData.map(r => ({ ...r, id: r._id })));

        // C. Fetch Users
        const usersRes = await fetch('http://localhost:5000/api/admin/users');
        const usersData = await usersRes.json();
        setUsers(usersData.map(u => ({ ...u, id: u._id })));

        // D. Fetch Bookings (CRITICAL for Approvals)
        const bookingsRes = await fetch('http://localhost:5000/api/admin/bookings');
        const bookingsData = await bookingsRes.json();
        
        // Format bookings for UI
        const formattedBookings = bookingsData.map(b => ({
          ...b,
          id: b._id,
          userName: b.user ? b.user.name : 'Unknown User',
          roomName: b.room ? (b.room.name || `Room ${b.room.roomNumber}`) : 'Unknown Room',
          // Preserve Facility Data
          type: b.type || 'room',
          title: b.title,
          startTime: b.startTime,
          endTime: b.endTime,
          notes: b.notes,
          facilityName: b.facilityName
        }));
        setBookings(formattedBookings);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []); // Run once on load

  // --- 2. APPROVE EVENT (Saves to DB) ---
  const handleApproveFacility = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }), // Update status to CONFIRMED
      });

      const data = await response.json();

      if (data.success) {
        // Update Local State Immediately
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        ));
        alert("Event Approved Successfully!");
      } else {
        alert("Failed to approve: " + data.message);
      }
    } catch (error) {
      alert("Server error approving event.");
    }
  };

  // --- 3. REJECT EVENT (Saves to DB) ---
  const handleRejectFacility = async (bookingId, reason) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      const data = await response.json();

      if (data.success) {
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'rejected' } : b
        ));
        alert("Event Rejected.");
      }
    } catch (error) {
      alert("Server error rejecting event.");
    }
  };

  // --- 4. CALCULATE OVERVIEW STATS ---
  const occupancyRate = rooms.length > 0 
    ? ((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100).toFixed(1)
    : 0;

  const dashboardStats = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue || 0}`, icon: '💰', color: '#10b981' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: '📊', color: '#3b82f6' },
    { label: 'Total Bookings', value: stats.totalBookings || 0, icon: '📅', color: '#8b5cf6' },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#06b6d4' }
  ];

  return (
    <div className="admin-overview">
      <header className="admin-header">
        <h1>RoomSync - Admin Portal</h1>
        <div className="admin-actions">
          <span>Admin: Admin User</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="admin-nav">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview & Analytics</button>
        <button className={activeTab === 'approvals' ? 'active' : ''} onClick={() => setActiveTab('approvals')}>VIP Facility Approvals</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>User Management</button>
        <button className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>Room Management</button>
        <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>Reports & Analytics</button>
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && (
          <>
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              {dashboardStats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-card" style={{ marginTop: '20px' }}>
              <h3>Recent Bookings</h3>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Detail</th>
                      <th>Guest</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.type === 'facility' ? '🎉 Event' : '🛏️ Room'}</td>
                        <td>{booking.roomName}</td>
                        <td>{booking.userName}</td>
                        <td>{new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* --- CONNECTED COMPONENTS --- */}
        {activeTab === 'approvals' && (
          <FacilityApproval 
            bookings={bookings} 
            onApprove={handleApproveFacility} 
            onReject={handleRejectFacility} 
          />
        )}

        {activeTab === 'users' && <UserManagement users={users} setUsers={setUsers} />}
        {activeTab === 'rooms' && <RoomManagement rooms={rooms} setRooms={setRooms} />}
        {activeTab === 'reports' && <Reports bookings={bookings} />}
      </main>
    </div>
  );
};

export default AdminOverview;