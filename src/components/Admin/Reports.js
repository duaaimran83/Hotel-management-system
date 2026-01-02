import React from 'react';
import './Reports.css';

const Reports = ({ bookings, rooms }) => {
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'checked-out')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const confirmedRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const completedBookings = bookings.filter(b => b.status === 'checked-out').length;
  const averageBookingValue = bookings.length > 0 
    ? (totalRevenue / bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-out').length).toFixed(2)
    : 0;

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <button className="export-btn">Export Report</button>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Revenue Summary</h3>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Revenue:</span>
              <span className="report-value revenue">${totalRevenue}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Confirmed Bookings Revenue:</span>
              <span className="report-value">${confirmedRevenue}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Average Booking Value:</span>
              <span className="report-value">${averageBookingValue}</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Occupancy Report</h3>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Rooms:</span>
              <span className="report-value">{rooms.length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Available:</span>
              <span className="report-value available">{rooms.filter(r => r.status === 'available').length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Occupied:</span>
              <span className="report-value occupied">{rooms.filter(r => r.status === 'occupied').length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Under Maintenance:</span>
              <span className="report-value maintenance">{rooms.filter(r => r.status === 'maintenance').length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Occupancy Rate:</span>
              <span className="report-value">
                {((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Booking Statistics</h3>
          <div className="report-content">
            <div className="report-item">
              <span className="report-label">Total Bookings:</span>
              <span className="report-value">{bookings.length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Pending:</span>
              <span className="report-value">{bookings.filter(b => b.status === 'pending').length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Confirmed:</span>
              <span className="report-value">{bookings.filter(b => b.status === 'confirmed').length}</span>
            </div>
            <div className="report-item">
              <span className="report-label">Completed:</span>
              <span className="report-value">{completedBookings}</span>
            </div>
          </div>
        </div>

        <div className="report-card full-width">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {bookings.slice(0, 10).map(booking => (
              <div key={booking.id} className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-content">
                  <p className="activity-title">
                    Booking #{booking.id.slice(-6)} - {booking.roomName}
                  </p>
                  <p className="activity-date">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="activity-amount">${booking.totalAmount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

