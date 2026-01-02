import React, { useState } from 'react';
import './CheckInOut.css';

const CheckInOut = ({ bookings, onCheckIn, onCheckOut }) => {
  const [filter, setFilter] = useState('pending');

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'pending' || booking.status === 'confirmed';
    return booking.status === filter;
  });

  const canCheckIn = (booking) => {
    const today = new Date().toISOString().split('T')[0];
    return (booking.status === 'pending' || booking.status === 'confirmed') && 
           booking.checkIn <= today;
  };

  const canCheckOut = (booking) => {
    return booking.status === 'checked-in';
  };

  return (
    <div className="checkinout">
      <h2>Check-In / Check-Out Management</h2>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Bookings
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Ready for Check-in
        </button>
        <button
          className={filter === 'checked-in' ? 'active' : ''}
          onClick={() => setFilter('checked-in')}
        >
          Checked In
        </button>
      </div>

      <div className="bookings-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-info">
                <div className="booking-header">
                  <h3>{booking.roomName}</h3>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Booking ID:</span>
                    <span>#{booking.id.slice(-6)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Guest ID:</span>
                    <span>{booking.userId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Check-in:</span>
                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Check-out:</span>
                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <span className="amount">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                {canCheckIn(booking) && (
                  <button
                    className="checkin-btn"
                    onClick={() => onCheckIn(booking.id)}
                  >
                    ✓ Check In
                  </button>
                )}
                {canCheckOut(booking) && (
                  <button
                    className="checkout-btn"
                    onClick={() => onCheckOut(booking.id)}
                  >
                    ✗ Check Out
                  </button>
                )}
                {!canCheckIn(booking) && !canCheckOut(booking) && (
                  <span className="no-action">No action available</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <p>No bookings found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;

