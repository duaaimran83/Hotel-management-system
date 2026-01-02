import React from 'react';
import './RoomCard.css';

const RoomCard = ({ room, checkIn, checkOut, onBookRoom }) => {
  // --- SAFETY CHECKS ---
  // If data is missing from DB, use these defaults
  const amenities = room.amenities || []; 
  const roomName = room.name || `Room ${room.roomNumber || 'Unknown'}`;
  const roomCategory = room.type || room.category || 'Standard';
  const capacity = room.capacity || 2;
  const beds = room.beds || 1;

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    if (room.status !== 'available') {
      alert('This room is not available');
      return;
    }
    onBookRoom(room, checkIn, checkOut);
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
    <div className="room-card" data-vip={room.isVIP}>
      <div className="room-image">
        {room.image ? (
          <img 
            src={room.image} 
            alt={roomName}
            className="room-image-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Placeholder if no image */}
        <div className="room-placeholder" style={{ display: room.image ? 'none' : 'flex' }}>
          <span>{roomName}</span>
          {room.isVIP && (
            <div style={{ 
              marginTop: '10px', 
              fontSize: '2rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              ⭐
            </div>
          )}
        </div>

        <div className="room-status" style={{ backgroundColor: getStatusColor(room.status) }}>
          {room.status || 'Available'}
        </div>
        
        {room.isVIP && (
          <div className="vip-overlay-badge">
            ⭐ VIP
          </div>
        )}
      </div>

      <div className="room-content">
        <div className="room-header">
          <h3>
            {roomName}
            {room.isVIP && (
              <span style={{ 
                marginLeft: '8px', 
                padding: '2px 8px', 
                background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
                color: '#013328',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ⭐ VIP
              </span>
            )}
          </h3>
          <span className="room-category">{roomCategory}</span>
        </div>

        <div className="room-details">
          <div className="detail-item">
            <span className="icon">👥</span>
            <span>Capacity: {capacity}</span>
          </div>
          <div className="detail-item">
            <span className="icon">🛏️</span>
            <span>{beds} beds</span>
          </div>
        </div>

        <div className="room-amenities">
          {/* SAFE AMENITIES LOOP */}
          {amenities.length > 0 ? (
            <>
              {amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="amenity-tag">{amenity}</span>
              ))}
              {amenities.length > 3 && (
                <span className="amenity-tag">+{amenities.length - 3} more</span>
              )}
            </>
          ) : (
             <span className="amenity-tag">Basic Amenities</span>
          )}
        </div>

        <div className="room-footer">
          <div className="room-price">
            <span className="price-amount">${room.price}</span>
            <span className="price-unit">/ night</span>
          </div>
          <button 
            className="book-btn"
            onClick={handleBook}
            disabled={room.status !== 'available'}
          >
            {room.status === 'available' ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;