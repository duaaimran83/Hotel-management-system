import React, { useState } from 'react';
import './FacilityBookingModal.css';

const RegularFacilityBookingModal = ({ facility, onClose, onConfirm, user }) => {
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = () => {
    if (!numberOfPeople || numberOfPeople <= 0) {
      alert('Please enter the number of people');
      return;
    }

    const peopleCount = parseInt(numberOfPeople);

    if (peopleCount > facility.capacity) {
      const message = `The facility "${facility.name}" can only accommodate up to ${facility.capacity} people.\n\n` +
        `You entered ${peopleCount} people.\n\n` +
        `Please either:\n` +
        `1. Select a different facility with higher capacity\n` +
        `2. Reduce the number of people to ${facility.capacity} or less\n` +
        `3. Contact support for assistance with larger venues`;
      alert(message);
      return;
    }

    if (!title.trim()) {
      alert('Please enter a title/event name');
      return;
    }

    if (!occasion.trim()) {
      alert('Please enter the occasion');
      return;
    }

    if (!date) {
      alert('Please select a date');
      return;
    }

    if (!time) {
      alert('Please select a time');
      return;
    }

    const bookingData = {
      facility: facility,
      numberOfPeople: peopleCount,
      title: title.trim(),
      occasion: occasion.trim(),
      date: date,
      time: time,
      totalAmount: facility.price,
      type: 'facility',
      isVIP: false
    };

    onConfirm(bookingData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="facility-booking-modal-overlay" onClick={onClose}>
      <div className="facility-booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book {facility.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="facility-info-card">
            <h3>{facility.name}</h3>
            <div className="facility-info-details">
              <span>👥 Capacity: {facility.capacity} people</span>
              <span>💰 Price: ${facility.price} / event</span>
            </div>
          </div>

          <div className="form-section">
            <label>Number of People *</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => {
                const value = e.target.value;
                setNumberOfPeople(value);
                // Show warning if exceeding capacity
                if (value && parseInt(value) > facility.capacity) {
                  // This will be validated on submit, but we can show a visual indicator
                }
              }}
              placeholder="Enter number of attendees"
              min="1"
              max={facility.capacity}
              required
            />
            <small style={{ 
              color: numberOfPeople && parseInt(numberOfPeople) > facility.capacity ? '#dc2626' : '#666',
              fontWeight: numberOfPeople && parseInt(numberOfPeople) > facility.capacity ? '600' : 'normal'
            }}>
              {numberOfPeople && parseInt(numberOfPeople) > facility.capacity 
                ? `⚠️ Exceeds capacity! Maximum: ${facility.capacity} people`
                : `Maximum capacity: ${facility.capacity} people`}
            </small>
          </div>

          <div className="form-section">
            <label>Event Title / Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Annual Company Meeting"
              required
            />
          </div>

          <div className="form-section">
            <label>Occasion / Event Type *</label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g., Corporate Meeting, Birthday Party, Wedding Reception"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-section">
              <label>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </div>

            <div className="form-section">
              <label>Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-items">
              <div className="summary-item">
                <span>Facility:</span>
                <span>{facility.name}</span>
              </div>
              <div className="summary-item">
                <span>Event:</span>
                <span>{title || 'N/A'}</span>
              </div>
              <div className="summary-item">
                <span>Date & Time:</span>
                <span>{date ? new Date(date).toLocaleDateString() : 'N/A'} {time || ''}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>${facility.price}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="confirm-btn" 
              onClick={handleSubmit}
              disabled={!numberOfPeople || !title.trim() || !occasion.trim() || !date || !time}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularFacilityBookingModal;

