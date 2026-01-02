import React, { useState } from 'react';
import './RoomManagement.css';
import EditRoomModal from './EditRoomModal';
import AddRoomModal from './AddRoomModal';

const RoomManagement = ({ rooms, setRooms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // --- SAFE FILTERING ---
  const filteredRooms = rooms.filter(room => {
    // Handle missing names safely
    const roomName = room.name || `Room ${room.roomNumber}` || '';
    const roomType = room.type || room.category || ''; // Check both DB fields

    const matchesSearch = roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- API: UPDATE STATUS ---
  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect change immediately
        setRooms(rooms.map(room =>
          room.id === roomId ? { ...room, status: newStatus } : room
        ));
        alert(`Room status updated to ${newStatus}`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("Server error updating status");
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
  };

  // --- API: SAVE EDITED ROOM ---
  const handleSaveRoom = async (updatedRoomData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${updatedRoomData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoomData),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with the server's response
        setRooms(rooms.map(room =>
          room.id === updatedRoomData.id ? { ...data.room, id: data.room._id } : room
        ));
        setEditingRoom(null);
        alert('Room details updated successfully!');
      } else {
        alert("Failed to save room changes");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Server error saving room");
    }
  };

  // --- API: ADD NEW ROOM ---
  const handleAddRoom = async (newRoomData) => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoomData),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new room (with its new MongoDB _id) to our list
        const newRoomWithId = { ...data.room, id: data.room._id };
        setRooms([...rooms, newRoomWithId]);
        setShowAddRoom(false);
        alert('New room added successfully!');
      } else {
        alert("Failed to add room: " + data.message);
      }
    } catch (error) {
      console.error("Add Error:", error);
      alert("Server error adding room");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="room-management">
      <div className="section-header">
        <h2>Room Management</h2>
        <button className="add-room-btn" onClick={() => setShowAddRoom(!showAddRoom)}>
          + Add New Room
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search rooms..."
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

      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <div key={room.id} className="room-management-card">
            <div className="room-card-header">
              <h3>{room.name || `Room ${room.roomNumber}`}</h3>
              <span 
                className="room-status-badge"
                style={{ backgroundColor: `${getStatusColor(room.status)}20`, color: getStatusColor(room.status) }}
              >
                {room.status}
              </span>
            </div>

            <div className="room-details">
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value">{room.type || room.category || 'Standard'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Capacity:</span>
                <span className="value">{room.capacity || 2} guests</span>
              </div>
              <div className="detail-item">
                <span className="label">Beds:</span>
                <span className="value">{room.beds || 1}</span>
              </div>
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">${room.price}/night</span>
              </div>
            </div>

            <div className="room-actions">
              <label>Change Status:</label>
              <select
                value={room.status}
                onChange={(e) => handleStatusChange(room.id, e.target.value)}
                className="status-select"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <button className="edit-btn" onClick={() => handleEditRoom(room)}>Edit Details</button>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="no-rooms">
          <p>No rooms found matching your criteria.</p>
        </div>
      )}

      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={handleSaveRoom}
        />
      )}

      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onSave={handleAddRoom}
        />
      )}
    </div>
  );
};

export default RoomManagement;