const mongoose = require('mongoose');

// 1. Import your Models
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// 2. Paste your Connection String here (Same as server.js)
const MONGO_URI = "mongodb+srv://adminfswd:fswdproject@trycluster0.rawptfn.mongodb.net/RoomSync?appName=TryCluster0";

// 3. Sample Data
const users = [
  {
    name: "Admin User",
    email: "admin@roomsync.com",
    password: "123", 
    role: "admin"
  },
  {
    name: "Staff Member",
    email: "staff@roomsync.com",
    password: "123",
    role: "staff"
  },
  {
    name: "Aeman",
    email: "aeman@gmail.com",
    password: "123",
    role: "customer"
  }
];

const rooms = [
  {
    roomNumber: "101",
    type: "Single",
    price: 100,
    description: "A cozy room for one person.",
    status: "available",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=60"
  },
  {
    roomNumber: "102",
    type: "Double",
    price: 150,
    description: "Perfect for couples.",
    status: "available",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=60"
  },
  {
    roomNumber: "201",
    type: "Suite",
    price: 300,
    description: "Luxury suite with city view.",
    status: "available",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=60"
  },
  {
    roomNumber: "202",
    type: "Single",
    price: 110,
    description: "Standard single room.",
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=500&q=60"
  },
  // Shared Rooms
  {
    roomNumber: "DORM-01",
    type: "Shared Dormitory",
    price: 250, // Total price for the room
    basePricePerPerson: 50, // Price per person
    description: "Comfortable shared dormitory for up to 6 people. Perfect for groups, families, or budget travelers.",
    status: "available",
    isShared: true,
    maxOccupancy: 6,
    currentOccupancy: 0,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=60"
  },
  {
    roomNumber: "SHARED-01",
    type: "Shared Suite",
    price: 400, // Total price for the room
    basePricePerPerson: 80, // Price per person
    description: "Spacious shared suite for up to 4 people with common living area. Great for friends or small groups.",
    status: "available",
    isShared: true,
    maxOccupancy: 4,
    currentOccupancy: 0,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=60"
  }
];

// 4. The Seeding Logic
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB...");

    // CLEAR existing data to avoid duplicates
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing data");

    // INSERT new data
    await User.insertMany(users);
    console.log("Users added");

    await Room.insertMany(rooms);
    console.log("Rooms added");

    console.log("Database seeded successfully!");
    
    process.exit(); // Stop the script
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();