const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, 
  price: { type: Number, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'booked', 'maintenance'], 
    default: 'available' 
  },
  image: { type: String } // image URL
});

module.exports = mongoose.model('Room', roomSchema);