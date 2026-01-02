import React, { useState } from 'react';
import { mockConferenceRoomsVIP, mockHallsVIP } from '../../data/mockData';
import './FacilityBookingModal.css';

const VIPFacilityBookingModal = ({ onClose, onConfirm, user }) => {
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [selectedConferenceRooms, setSelectedConferenceRooms] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);

  // Filter halls based on capacity (within ±20% of requested capacity)
  const getMatchingHalls = () => {
    if (!numberOfPeople || numberOfPeople <= 0) return [];
    const capacity = parseInt(numberOfPeople);
    const lowerBound = Math.floor(capacity * 0.8);
    const upperBound = Math.ceil(capacity * 1.2);
    
    return mockHallsVIP.filter(hall => 
      hall.status === 'available' && 
      hall.capacity >= lowerBound && 
      hall.capacity <= upperBound
    ).sort((a, b) => Math.abs(a.capacity - capacity) - Math.abs(b.capacity - capacity));
  };

  const matchingHalls = getMatchingHalls();
  const availableConferenceRooms = mockConferenceRoomsVIP.filter(cr => cr.status === 'available');

  const handleConferenceRoomToggle = (room) => {
    if (selectedConferenceRooms.find(r => r.id === room.id)) {
      setSelectedConferenceRooms(selectedConferenceRooms.filter(r => r.id !== room.id));
    } else {
      if (selectedConferenceRooms.length < 2) {
        setSelectedConferenceRooms([...selectedConferenceRooms, room]);
      } else {
        alert('You can only select up to 2 conference rooms');
      }
    }
  };

  const handleHallSelect = (hall) => {
    setSelectedHall(hall);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedConferenceRooms.forEach(room => total += room.price);
    if (selectedHall) total += selectedHall.price;
    return total;
  };

  const handleSubmit = () => {
    if (!numberOfPeople || numberOfPeople <= 0) {
      alert('Please enter the number of people');
      return;
    }

    const peopleCount = parseInt(numberOfPeople);

    if (selectedConferenceRooms.length === 0 && !selectedHall) {
      alert('Please select at least one conference room or hall');
      return;
    }

    // Validate capacity for selected hall
    if (selectedHall && peopleCount > selectedHall.capacity) {
      const message = `The selected hall "${selectedHall.name}" can only accommodate up to ${selectedHall.capacity} people.\n\n` +
        `You entered ${peopleCount} people.\n\n` +
        `Please either:\n` +
        `1. Select a different hall with higher capacity\n` +
        `2. Reduce the number of people\n` +
        `3. Contact support for assistance`;
      alert(message);
      return;
    }

    // Validate capacity for selected conference rooms
    const insufficientCapacityRooms = selectedConferenceRooms.filter(room => peopleCount > room.capacity);
    if (insufficientCapacityRooms.length > 0) {
      const roomNames = insufficientCapacityRooms.map(r => r.name).join(', ');
      const capacities = insufficientCapacityRooms.map(r => r.capacity).join(', ');
      const message = `The following conference room(s) cannot accommodate ${peopleCount} people:\n\n` +
        `${roomNames}\n\n` +
        `Maximum capacity: ${capacities} people\n\n` +
        `Please either:\n` +
        `1. Select different conference room(s) with higher capacity\n` +
        `2. Reduce the number of people\n` +
        `3. Contact support for assistance`;
      alert(message);
      return;
    }

    const bookingData = {
      numberOfPeople: peopleCount,
      conferenceRooms: selectedConferenceRooms,
      hall: selectedHall,
      totalAmount: calculateTotal(),
      type: 'facility',
      isVIP: true
    };

    onConfirm(bookingData);
  };

  return (
    <div className="facility-booking-modal-overlay" onClick={onClose}>
      <div className="facility-booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⭐ VIP Facility Booking</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="info-banner">
            <p>As a VIP customer, you can book up to 2 conference rooms and/or 1 hall. Select based on your needs - you can choose conference rooms only, hall only, or both.</p>
          </div>

          <div className="form-section">
            <label>Number of People *</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              placeholder="Enter number of attendees"
              min="1"
              required
            />
            <small style={{ 
              color: numberOfPeople && selectedHall && parseInt(numberOfPeople) > selectedHall.capacity ? '#dc2626' : '#666',
              fontWeight: numberOfPeople && selectedHall && parseInt(numberOfPeople) > selectedHall.capacity ? '600' : 'normal'
            }}>
              {numberOfPeople && selectedHall && parseInt(numberOfPeople) > selectedHall.capacity
                ? `⚠️ Exceeds selected hall capacity! Maximum: ${selectedHall.capacity} people`
                : numberOfPeople && selectedHall
                ? `✓ Selected hall capacity: ${selectedHall.capacity} people`
                : "We'll show halls with capacity matching your needs"}
            </small>
            {numberOfPeople && selectedConferenceRooms.length > 0 && (
              <small style={{ 
                display: 'block', 
                marginTop: '5px',
                color: selectedConferenceRooms.some(cr => parseInt(numberOfPeople) > cr.capacity) ? '#dc2626' : '#666',
                fontWeight: selectedConferenceRooms.some(cr => parseInt(numberOfPeople) > cr.capacity) ? '600' : 'normal'
              }}>
                {selectedConferenceRooms.some(cr => parseInt(numberOfPeople) > cr.capacity)
                  ? `⚠️ Exceeds some conference room capacities!`
                  : `✓ All selected conference rooms can accommodate ${numberOfPeople} people`}
              </small>
            )}
          </div>

          {numberOfPeople && numberOfPeople > 0 && (
            <>
              <div className="form-section">
                <label>Select Conference Rooms (Up to 2) - Optional</label>
                <div className="facility-selection-grid">
                  {availableConferenceRooms.map(room => {
                    const isSelected = selectedConferenceRooms.find(r => r.id === room.id);
                    return (
                      <div
                        key={room.id}
                        className={`facility-option ${isSelected ? 'selected' : ''} ${selectedConferenceRooms.length >= 2 && !isSelected ? 'disabled' : ''}`}
                        onClick={() => handleConferenceRoomToggle(room)}
                      >
                        <div className="facility-option-header">
                          <h4>{room.name}</h4>
                          <span className="capacity-badge">👥 {room.capacity}</span>
                        </div>
                        <div className="facility-option-price">${room.price}</div>
                        {isSelected && <div className="selected-indicator">✓ Selected</div>}
                      </div>
                    );
                  })}
                </div>
                {selectedConferenceRooms.length > 0 && (
                  <div className="selected-summary">
                    Selected: {selectedConferenceRooms.map(r => r.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="form-section">
                <label>Select Hall (Capacity: {numberOfPeople} people) - Optional</label>
                {matchingHalls.length > 0 ? (
                  <>
                    <div className="facility-selection-grid">
                      {matchingHalls.map(hall => {
                        const isSelected = selectedHall?.id === hall.id;
                        return (
                          <div
                            key={hall.id}
                            className={`facility-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleHallSelect(hall)}
                          >
                            <div className="facility-option-header">
                              <h4>{hall.name}</h4>
                              <span className="capacity-badge">👥 {hall.capacity}</span>
                            </div>
                            <div className="facility-option-details">
                              <span>Capacity: {hall.capacity} people</span>
                              <span className="capacity-match">
                                {Math.abs(hall.capacity - parseInt(numberOfPeople)) <= 10 ? 'Perfect Match' : 'Good Match'}
                              </span>
                            </div>
                            <div className="facility-option-price">${hall.price}</div>
                            {isSelected && <div className="selected-indicator">✓ Selected</div>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="no-matching-facilities">
                    <p>No halls available with capacity near {numberOfPeople} people.</p>
                    <p>Please try a different number or contact support.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {(selectedConferenceRooms.length > 0 || selectedHall) && (
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-items">
                {selectedConferenceRooms.map(room => (
                  <div key={room.id} className="summary-item">
                    <span>{room.name}</span>
                    <span>${room.price}</span>
                  </div>
                ))}
                {selectedHall && (
                  <div className="summary-item">
                    <span>{selectedHall.name}</span>
                    <span>${selectedHall.price}</span>
                  </div>
                )}
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="confirm-btn" 
              onClick={handleSubmit}
              disabled={selectedConferenceRooms.length === 0 && !selectedHall}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPFacilityBookingModal;

