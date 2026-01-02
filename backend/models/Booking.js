const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Primary user (for single bookings) - optional for shared bookings
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // For shared room bookings - multiple customers
  customers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String },
    isPrimary: { type: Boolean, default: false } // Marks the main booker
  }],

  // Optional: Room ID (only for room bookings)
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  
  // --- TYPE DEFINITION ---
  type: { type: String, default: 'room' }, // 'room' or 'facility'

  // --- FACILITY SPECIFIC FIELDS ---
  facilityName: { type: String },           // e.g. "Grand Ball Room"
  title: { type: String },                 // e.g. "Tech Conference"
  occasion: { type: String },              // e.g. "Wedding"
  numberOfPeople: { type: Number },        // For Events/Facilities
  
  // Time & Notes
  startTime: { type: String },             // e.g. "14:00"
  endTime: { type: String },               // e.g. "18:00"
  notes: { type: String },                 // Special requests
  
  // --- SHARED ROOM FIELDS (New Additions) ---
  isSharedBooking: { type: Boolean, default: false }, // Identifies if this is a dorm bed booking
  guestCount: { type: Number, default: 1 },           // Tracks number of beds booked
  
  // --- COMMON FIELDS ---
  checkInDate: { type: Date, required: true }, // For facilities, this is the Booking Date
  checkOutDate: { type: Date },                // Optional for facilities
  
  totalAmount: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'pending_approval', 'rejected'], 
    default: 'pending' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);