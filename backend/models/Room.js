const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['available', 'partially_booked', 'fully_booked', 'maintenance'],
    default: 'available'
  },
  image: { type: String }, // image URL

  // Shared room fields
  isShared: { type: Boolean, default: false },
  maxOccupancy: { type: Number, default: 1 }, // Maximum number of people that can stay
  currentOccupancy: { type: Number, default: 0 }, // Current number of people staying
  basePricePerPerson: { type: Number }, // Base price per person for shared rooms
});

module.exports = mongoose.model('Room', roomSchema);