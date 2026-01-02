import React from 'react';
import './FacilityCard.css';

const FacilityCard = ({ facility, onBookFacility, user }) => {
  const handleBook = () => {
    if (facility.status !== 'available') {
      alert('This facility is not available');
      return;
    }
    onBookFacility(facility);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getFacilityIcon = (type) => {
    return type === 'conference-room' ? '🏢' : '🎪';
  };

  return (
    <div className="facility-card" data-vip={facility.isVIP}>
      <div className="facility-image">
        <div className="facility-status" style={{ backgroundColor: getStatusColor(facility.status) }}>
          {facility.status}
        </div>
        <div className="facility-placeholder">
          <span style={{ fontSize: '3rem' }}>{getFacilityIcon(facility.type)}</span>
          <span style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: '700' }}>{facility.name}</span>
          {facility.isVIP && (
            <div style={{ 
              marginTop: '10px', 
              fontSize: '2rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              ⭐
            </div>
          )}
        </div>
      </div>

      <div className="facility-content">
        <div className="facility-header">
          <h3>
            {facility.name}
            {facility.isVIP && (
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
          <span className="facility-type">{facility.type === 'conference-room' ? 'Conference Room' : 'Hall'}</span>
        </div>

        <div className="facility-details">
          <div className="detail-item">
            <span className="icon">👥</span>
            <span>Capacity: {facility.capacity} people</span>
          </div>
        </div>

        <div className="facility-amenities">
          {facility.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">{amenity}</span>
          ))}
          {facility.amenities.length > 3 && (
            <span className="amenity-tag">+{facility.amenities.length - 3} more</span>
          )}
        </div>

        <div className="facility-footer">
          <div className="facility-price">
            <span className="price-amount">${facility.price}</span>
            <span className="price-unit">/ event</span>
          </div>
          <button 
            className="book-btn"
            onClick={handleBook}
            disabled={facility.status !== 'available'}
          >
            {facility.status === 'available' ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

