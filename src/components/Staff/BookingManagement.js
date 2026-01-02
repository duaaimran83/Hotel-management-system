import React, { useState } from 'react';
import './BookingManagement.css';

const BookingManagement = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706' },
      confirmed: { bg: '#d1fae5', color: '#059669' },
      'checked-in': { bg: '#dbeafe', color: '#2563eb' },
      'checked-out': { bg: '#e5e7eb', color: '#374151' },
      cancelled: { bg: '#fee2e2', color: '#dc2626' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {status}
      </span>
    );
  };

  return (
    <div className="booking-management">
      <h2>Booking Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search bookings by room or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Guest ID</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Booked On</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id.slice(-6)}</td>
                  <td>{booking.roomName}</td>
                  <td>{booking.userId}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td className="amount">${booking.totalAmount}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;

