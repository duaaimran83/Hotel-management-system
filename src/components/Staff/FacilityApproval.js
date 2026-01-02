import React, { useState } from 'react';
import './FacilityApproval.css';

const FacilityApproval = ({ bookings, onApprove, onReject }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter for regular (non-VIP) facility bookings pending approval
  const pendingRegularFacilityBookings = bookings.filter(booking => 
    booking.type === 'facility' && 
    booking.status === 'pending_approval' &&
    (booking.isVIP === false || booking.isVIP === undefined)
  );

  const filteredBookings = pendingRegularFacilityBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.facilityName?.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower) ||
      booking.title?.toLowerCase().includes(searchLower) ||
      booking.userId.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending_approval: { bg: '#fef3c7', color: '#d97706' },
      approved: { bg: '#d1fae5', color: '#059669' },
      rejected: { bg: '#fee2e2', color: '#dc2626' }
    };
    const style = styles[status] || styles.pending_approval;
    return (
      <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const handleApprove = (bookingId) => {
    if (window.confirm('Are you sure you want to approve this facility booking?')) {
      onApprove(bookingId);
    }
  };

  const handleReject = (bookingId) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) {
      onReject(bookingId, reason);
    }
  };

  return (
    <div className="facility-approval">
      <div className="approval-header">
        <h2>Regular Facility Booking Approvals</h2>
        <div className="pending-count">
          <span className="count-badge">{filteredBookings.length}</span>
          <span>Pending Approvals</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by facility name, booking ID, title, or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-pending">
          <p>No regular facility bookings pending approval.</p>
        </div>
      ) : (
        <div className="approvals-list">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="approval-card">
              <div className="approval-card-header">
                <div>
                  <h3>{booking.facilityName}</h3>
                  <p className="booking-id">Booking ID: #{booking.id.slice(-6)}</p>
                  <span className="regular-badge">Regular Booking</span>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="approval-card-body">
                <div className="booking-info-grid">
                  <div className="info-item">
                    <span className="label">User ID:</span>
                    <span className="value">{booking.userId}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Number of People:</span>
                    <span className="value">{booking.numberOfPeople} people</span>
                  </div>
                  {booking.title && (
                    <div className="info-item">
                      <span className="label">Event Title:</span>
                      <span className="value">{booking.title}</span>
                    </div>
                  )}
                  {booking.occasion && (
                    <div className="info-item">
                      <span className="label">Occasion:</span>
                      <span className="value">{booking.occasion}</span>
                    </div>
                  )}
                  {booking.date && (
                    <div className="info-item">
                      <span className="label">Date:</span>
                      <span className="value">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {booking.time && (
                    <div className="info-item">
                      <span className="label">Time:</span>
                      <span className="value">{booking.time}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="label">Total Amount:</span>
                    <span className="value amount">${booking.totalAmount}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Booked On:</span>
                    <span className="value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {booking.facility && (
                  <div className="facility-details">
                    <h4>Facility Details:</h4>
                    <ul>
                      <li>
                        {booking.facility.name} - Capacity: {booking.facility.capacity} people - ${booking.facility.price}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="approval-card-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(booking.id)}
                >
                  ✓ Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(booking.id)}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityApproval;

