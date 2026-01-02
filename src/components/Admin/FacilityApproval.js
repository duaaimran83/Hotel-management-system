import React from 'react';
import './FacilityApproval.css';

const FacilityApproval = ({ bookings, onApprove, onReject }) => {
  // 1. Filter for bookings that need approval
  const pendingBookings = bookings.filter(b => 
    b.type === 'facility' && b.status === 'pending_approval'
  );

  console.log("DEBUG: All Bookings:", bookings);
  console.log("DEBUG: Pending Filtered:", pendingBookings);
  bookings.forEach(b => {
      if (b.status === 'pending_approval') {
          console.log(`Found a pending booking! ID: ${b.id}, Type: ${b.type}`);
      }
  });

  return (
    <div className="facility-approval">
      <div className="section-header">
        <h2>VIP & Facility Booking Requests</h2>
        <span className="count-badge">{pendingBookings.length} Pending</span>
      </div>

      <div className="approval-grid">
        {pendingBookings.length > 0 ? (
          pendingBookings.map(booking => (
            <div key={booking.id} className="approval-card">
              <div className="approval-header">
                <span className="booking-type-badge">{booking.occasion || 'Event'}</span>
                <span className="booking-date">
                  {new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()}
                </span>
              </div>

              <div className="approval-body">
                <h3>{booking.title || 'Untitled Event'}</h3>
                
                <div className="detail-row">
                  <span className="label">Facility:</span>
                  <span className="value">{booking.facilityName}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Host:</span>
                  <span className="value">{booking.userName || booking.user?.name || 'Unknown User'}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Time:</span>
                  <span className="value">
                    {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="label">Guests:</span>
                  <span className="value">{booking.numberOfPeople} people</span>
                </div>

                {booking.notes && (
                  <div className="detail-row notes">
                    <span className="label">Notes:</span>
                    <p className="value note-text">"{booking.notes}"</p>
                  </div>
                )}

                <div className="detail-row total">
                  <span className="label">Total Price:</span>
                  <span className="value price">${booking.totalAmount}</span>
                </div>
              </div>

              <div className="approval-actions">
                <button 
                  className="reject-btn"
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) onReject(booking.id, reason);
                  }}
                >
                  Reject
                </button>
                <button 
                  className="approve-btn"
                  onClick={() => onApprove(booking.id)}
                >
                  Approve Request
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-approvals">
            <p>✅ No pending facility requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityApproval;