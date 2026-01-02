import React, { useState } from 'react';
import './RoomStatus.css';

const RoomStatus = ({ rooms, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      available: { bg: '#d1fae5', color: '#059669' },
      occupied: { bg: '#fee2e2', color: '#dc2626' },
      maintenance: { bg: '#fef3c7', color: '#d97706' }
    };
    const style = styles[status] || styles.available;
    return (
      <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {status}
      </span>
    );
  };

  return (
    <div className="room-status">
      <h2>Room Status Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search rooms by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="rooms-table-container">
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Beds</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.category.charAt(0).toUpperCase() + room.category.slice(1)}</td>
                  <td>{room.capacity} guests</td>
                  <td>{room.beds}</td>
                  <td className="price">${room.price}/night</td>
                  <td>{room.isVIP ? 'VIP' : 'Regular'}</td>
                  <td>{getStatusBadge(room.status)}</td>
                  <td>
                    <select
                      value={room.status}
                      onChange={(e) => onStatusChange(room.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomStatus;

