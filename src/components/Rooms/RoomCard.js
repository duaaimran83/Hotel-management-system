import React, { useState } from 'react'; // 1. Import useState
import './RoomCard.css';

const RoomCard = ({ room, checkIn, checkOut, onBookRoom }) => {
  // 2. State for Guest Count (Default to 1)
  const [guestCount, setGuestCount] = useState(1);

  // --- SAFETY CHECKS ---
  const amenities = room.amenities || [];
  const roomName = room.name || `Room ${room.roomNumber || 'Unknown'}`;
  const roomCategory = room.type || room.category || 'Standard';
  const capacity = room.capacity || 2;
  const beds = room.beds || 1;

  // Shared room properties
  const isShared = room.isShared || false;
  const maxOccupancy = room.maxOccupancy || capacity;
  const currentOccupancy = room.currentOccupancy || 0;
  const availableSpots = maxOccupancy - currentOccupancy;

  // 3. Determine Price based on Shared or Private
  const basePrice = isShared ? (room.basePricePerPerson || room.price) : room.price;
  
  // Calculate display price (Price * Guests)
  const displayPrice = basePrice * guestCount;

  const handleBook = () => {
    // 1. DATE VALIDATION
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    // 2. AVAILABILITY CHECKS
    if (isShared) {
      if (availableSpots <= 0) {
        alert('This shared room is fully booked');
        return;
      }
      // New Check: Do we have enough spots for selected guests?
      if (guestCount > availableSpots) {
        alert(`Only ${availableSpots} beds available. You selected ${guestCount}.`);
        return;
      }
    } else {
      if (room.status !== 'available') {
        alert('This room is not available');
        return;
      }
    }
    
    // 3. PROCEED TO BOOKING - PASS GUEST COUNT!
    // We send 'guestCount' so the parent knows how much to charge
    onBookRoom(room, checkIn, checkOut, guestCount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'partially_booked': return '#3b82f6';
      case 'fully_booked': return '#ef4444';
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
        
        <div className="room-placeholder" style={{ display: room.image ? 'none' : 'flex' }}>
          <span>{roomName}</span>
          {room.isVIP && (
            <div style={{ marginTop: '10px', fontSize: '2rem' }}>⭐</div>
          )}
        </div>

        <div className="room-status" style={{ backgroundColor: getStatusColor(room.status) }}>
          {room.status || 'Available'}
        </div>
        
        {room.isVIP && <div className="vip-overlay-badge">⭐ VIP</div>}
      </div>

      <div className="room-content">
        <div className="room-header">
          <h3>{roomName}</h3>
          <span className="room-category">{roomCategory}</span>
        </div>

        <div className="room-details">
          {isShared ? (
            <>
              <div className="detail-item">
                <span className="icon">👥</span>
                <span>Available: {availableSpots}/{maxOccupancy}</span>
              </div>
              
              {/* --- 4. GUEST SELECTOR (Only for Shared) --- */}
              <div className="detail-item guest-selector">
                <span className="icon">🛏️</span>
                <label style={{ fontSize: '0.9rem', marginRight: '5px' }}>Book Beds:</label>
                <select 
                  value={guestCount} 
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()} // Prevent card click
                  style={{ padding: '2px 5px', borderRadius: '4px' }}
                >
                  {/* Create options based on available spots (e.g., 1 to 4) */}
                  {[...Array(availableSpots).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="detail-item">
                <span className="icon">👥</span>
                <span>Capacity: {capacity}</span>
              </div>
              <div className="detail-item">
                <span className="icon">🛏️</span>
                <span>{beds} beds</span>
              </div>
            </>
          )}
        </div>

        <div className="room-amenities">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">{amenity}</span>
          ))}
        </div>

        <div className="room-footer">
          <div className="room-price">
            {/* Show calculated total for selected guests */}
            <span className="price-amount">${displayPrice}</span>
            <span className="price-unit">
              {isShared ? `/night (${guestCount} ppl)` : '/ night'}
            </span>
          </div>
          <button
            className="book-btn"
            onClick={handleBook}
            disabled={isShared ? availableSpots <= 0 : room.status !== 'available'}
          >
            {isShared
              ? (availableSpots <= 0 ? 'Sold Out' : 'Book Now')
              : (room.status === 'available' ? 'Book Now' : 'Unavailable')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;