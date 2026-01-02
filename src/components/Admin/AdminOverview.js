import React from 'react';
import './AdminOverview.css';

const AdminOverview = ({ bookings, rooms, users }) => {
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'checked-out')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const occupancyRate = ((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100).toFixed(1);
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: '💰', color: '#10b981' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: '📊', color: '#3b82f6' },
    { label: 'Total Bookings', value: totalBookings, icon: '📅', color: '#8b5cf6' },
    { label: 'Pending Bookings', value: pendingBookings, icon: '⏳', color: '#f59e0b' },
    { label: 'Active Rooms', value: rooms.filter(r => r.status === 'available' || r.status === 'occupied').length, icon: '🏨', color: '#ec4899' },
    { label: 'Total Users', value: users.length, icon: '👥', color: '#06b6d4' }
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
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

      <div className="overview-sections">
        <div className="section-card">
          <h3>Recent Bookings</h3>
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id.slice(-6)}</td>
                      <td>{booking.roomName}</td>
                      <td>User {booking.userId}</td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card">
          <h3>Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Confirmed Bookings:</span>
              <span className="quick-stat-value">{confirmedBookings}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Available Rooms:</span>
              <span className="quick-stat-value">{rooms.filter(r => r.status === 'available').length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Occupied Rooms:</span>
              <span className="quick-stat-value">{rooms.filter(r => r.status === 'occupied').length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Under Maintenance:</span>
              <span className="quick-stat-value">{rooms.filter(r => r.status === 'maintenance').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;