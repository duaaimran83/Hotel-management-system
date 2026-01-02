const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  
  // 'type' is good for filtering (e.g., 'Single', 'Dorm', 'Suite')
  type: { type: String, required: true }, 

  // 1. Remove 'required: true' from price so it doesn't conflict with shared logic
  price: { type: Number }, 

  description: { type: String },
  
  status: {
    type: String,
    enum: ['available', 'partially_booked', 'fully_booked', 'maintenance', 'occupied'],
    default: 'available'
  },
  
  image: { type: String },

  // --- Shared Room Logic ---
  isShared: { type: Boolean, default: false },
  
  // 2. Default maxOccupancy to 1 (safe for private rooms)
  maxOccupancy: { type: Number, default: 1 }, 
  
  currentOccupancy: { type: Number, default: 0 },
  
  // 3. This is the correct field for dorm pricing
  basePricePerPerson: { type: Number } 
});

// Create a validation to ensure we have at least ONE price
roomSchema.pre('save', function(next) {
  if (!this.price && !this.basePricePerPerson) {
    return next(new Error('Room must have either a price (private) or basePricePerPerson (shared)'));
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);