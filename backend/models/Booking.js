const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Optional: Room ID (only for room bookings)
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  
  // --- TYPE DEFINITION ---
  type: { type: String, default: 'room' }, // 'room' or 'facility'

  // --- FACILITY SPECIFIC FIELDS (Merged from your file) ---
  facilityName: { type: String },          // e.g. "Grand Ball Room"
  title: { type: String },                 // e.g. "Tech Conference"
  occasion: { type: String },              // e.g. "Wedding"
  numberOfPeople: { type: Number },        // "numberOfGuests" mapped to this
  
  // Time & Notes (From your Sequelize file)
  startTime: { type: String },             // e.g. "14:00"
  endTime: { type: String },               // e.g. "18:00"
  notes: { type: String },                 // Special requests
  
  // --- SHARED FIELDS ---
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