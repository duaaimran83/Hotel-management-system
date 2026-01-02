import React, { useState } from 'react';
import './CheckInOut.css';

const CheckInOut = ({ bookings, onCheckIn, onCheckOut }) => {
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'checked_in'
  const [searchTerm, setSearchTerm] = useState('');

  // --- FILTER LOGIC ---
  const filteredBookings = bookings.filter(booking => {
    // 1. Status Filter
    let matchesFilter = false;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'pending') matchesFilter = booking.status === 'confirmed' || booking.status === 'pending';
    else matchesFilter = booking.status === filter; // e.g., 'checked_in'

    // 2. Search Filter (Name, Room, or ID)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (booking.userName && booking.userName.toLowerCase().includes(searchLower)) ||
      (booking.roomName && booking.roomName.toLowerCase().includes(searchLower)) ||
      (booking.id && booking.id.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  // --- LOGIC HELPERS ---
  const canCheckIn = (booking) => {
    // Check if status is correct AND date is today or in the past
    // Note: ensure backend uses 'confirmed' for ready-to-arrive guests
    const isReadyStatus = booking.status === 'confirmed' || booking.status === 'pending';
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkInDate = new Date(booking.checkIn || booking.checkInDate);
    checkInDate.setHours(0,0,0,0);

    return isReadyStatus && checkInDate <= today;
  };

  const canCheckOut = (booking) => {
    // Note: Backend likely uses 'checked_in' (snake_case)
    return booking.status === 'checked_in';
  };

  return (
    <div className="checkinout-container">
      <div className="header-controls">
        <h2>Check-In / Check-Out</h2>
        
        {/* SEARCH BAR */}
        <input 
          type="text" 
          placeholder="🔍 Search Guest, Room, or ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABS */}
      <div className="filter-tabs">
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          📅 Arrivals (Pending)
        </button>
        <button
          className={filter === 'checked_in' ? 'active' : ''}
          onClick={() => setFilter('checked_in')}
        >
          🏨 In-House (Checked In)
        </button>
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Lists
        </button>
      </div>

      {/* CARDS GRID */}
      <div className="bookings-grid">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className={`booking-card status-${booking.status}`}>
              <div className="card-header">
                <h3>{booking.roomName}</h3>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span className="label">Guest:</span>
                  <span className="value bold">{booking.userName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Booking ID:</span>
                  <span className="value">#{booking.id.slice(-6)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Dates:</span>
                  <span className="value">
                    {new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()} — 
                    {new Date(booking.checkOutDate || booking.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Total:</span>
                  <span className="value amount">${booking.totalAmount}</span>
                </div>
              </div>

              <div className="card-actions">
                {canCheckIn(booking) && (
                  <button
                    className="btn-action checkin-btn"
                    onClick={() => onCheckIn(booking.id)}
                  >
                    ✅ Check In
                  </button>
                )}
                
                {canCheckOut(booking) && (
                  <button
                    className="btn-action checkout-btn"
                    onClick={() => onCheckOut(booking.id)}
                  >
                    👋 Check Out
                  </button>
                )}

                {!canCheckIn(booking) && !canCheckOut(booking) && (
                  <div className="status-note">
                    {booking.status === 'checked_out' ? 'Completed' : 'Wait for date'}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <p>No bookings found matching filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;