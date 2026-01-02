import React, { useState, useEffect } from 'react';
import './BookingModal.css'; // Make sure to create some basic CSS for this

const BookingModal = ({ isOpen, onClose, room, onConfirm }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Reset state when the modal opens with a new room
  useEffect(() => {
    if (isOpen) {
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setTotalPrice(0);
    }
  }, [isOpen, room]);

  // Calculate Total Price whenever inputs change
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const timeDiff = end.getTime() - start.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

      if (nights > 0) {
        let price = 0;
        
        if (room.isShared) {
          // Shared Room Formula: Price Per Person * Guests * Nights
          // Fallback to room.price if basePricePerPerson is missing (safety)
          const rate = room.basePricePerPerson || room.price;
          price = rate * guests * nights;
        } else {
          // Private Room Formula: Room Price * Nights
          price = room.price * nights;
        }
        
        setTotalPrice(price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, guests, room]);

  if (!isOpen || !room) return null;

  const availableBeds = room.maxOccupancy - room.currentOccupancy;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate Dates
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out date must be after check-in date");
      return;
    }

    // Build the booking object
    const bookingData = {
      roomId: room._id,
      checkIn,
      checkOut,
      totalAmount: totalPrice,
      isSharedBooking: room.isShared,
      // If shared, we need to know how many beds to reserve
      guestCount: room.isShared ? guests : 1 
    };

    onConfirm(bookingData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>Book {room.roomNumber}</h2>
        <p className="room-type-badge">{room.isShared ? "Shared Dormitory" : "Private Room"}</p>

        <form onSubmit={handleSubmit}>
          {/* --- SHARED ROOM SPECIFIC FIELD --- */}
          {room.isShared && (
            <div className="form-group">
              <label>Number of Guests (Beds):</label>
              <select 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))}
                required
              >
                {/* Create options based on available beds */}
                {[...Array(availableBeds).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1} Guest{num > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
              <small>Only {availableBeds} beds left!</small>
            </div>
          )}

          {/* --- STANDARD DATE FIELDS --- */}
          <div className="form-group">
            <label>Check-In Date:</label>
            <input 
              type="date" 
              value={checkIn} 
              onChange={(e) => setCheckIn(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Check-Out Date:</label>
            <input 
              type="date" 
              value={checkOut} 
              onChange={(e) => setCheckOut(e.target.value)} 
              required 
            />
          </div>

          {/* --- PRICE SUMMARY --- */}
          <div className="price-summary">
            <h3>Total: ${totalPrice}</h3>
            {room.isShared && (
              <p className="price-breakdown">
                (${room.basePricePerPerson} x {guests} guests x nights)
              </p>
            )}
          </div>

          <button type="submit" className="confirm-btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;