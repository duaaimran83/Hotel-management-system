import React from 'react';
import './BookingHistory.css';

const BookingHistory = ({ bookings }) => {
  // Sort bookings: Newest first
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.checkIn) - new Date(a.checkIn)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';       // Green
      case 'checked_in': return '#3b82f6';      // Blue
      case 'checked_out': return '#6b7280';     // Gray
      case 'pending': return '#f59e0b';         // Orange
      case 'pending_approval': return '#8b5cf6';// Purple (VIP)
      case 'rejected': return '#ef4444';        // Red
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'UNKNOWN';
    if (status === 'pending_approval') return 'Waiting for Approval';
    return status.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
  };

  return (
    <div className="booking-history">
      <h2>My Bookings</h2>
      
      {sortedBookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            Start exploring our rooms and facilities!
          </span>
        </div>
      ) : (
        <div className="bookings-list">
          {sortedBookings.map((booking) => {
            const isFacility = booking.type === 'facility';
            
            // Calculate nights safely (only for rooms)
            const start = new Date(booking.checkIn);
            const end = new Date(booking.checkOut);
            const isValidDates = !isNaN(start.getTime()) && !isNaN(end.getTime());
            
            const nights = isValidDates 
              ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) 
              : 1; // Default to 1 night if date is missing

            return (
              <div key={booking.id} className="booking-card">
                {/* --- HEADER --- */}
                <div className="booking-header">
                  <div className="booking-main-info">
                    {isFacility ? (
                      <span className="type-badge facility">🎉 Event</span>
                    ) : (
                      <span className="type-badge room">🛏️ Room</span>
                    )}
                    {/* Added margin-left for spacing */}
                    <span className="booking-date" style={{ marginLeft: '10px' }}>
                      {formatDate(booking.checkIn)}
                      {!isFacility && booking.checkOut && ` - ${formatDate(booking.checkOut)}`}
                    </span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                {/* --- BODY --- */}
                <div className="booking-body">
                  {isFacility ? (
                    // LAYOUT FOR FACILITIES / EVENTS
                    <>
                      <h3>{booking.title || booking.facilityName || 'Event Booking'}</h3>
                      <p className="room-name">📍 {booking.facilityName || 'Conference Center'}</p>
                      <div className="booking-meta">
                        <span>🕒 {booking.startTime || 'All Day'} - {booking.endTime || 'End'}</span>
                        <span>👥 Guests: {booking.numberOfPeople || 0}</span>
                      </div>
                    </>
                  ) : (
                    // LAYOUT FOR ROOMS
                    <>
                      <h3>{booking.roomName && booking.roomName !== 'Unknown Room' ? booking.roomName : 'Standard Room'}</h3>
                      <div className="booking-meta">
                        <span>🌙 {nights} Night{nights !== 1 ? 's' : ''}</span>
                        <span>💰 Total: ${booking.totalAmount}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;