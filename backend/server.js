const express = require('express');
const mongoose = require('mongoose'); // 1. Import Mongoose
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const cors = require('cors');

const app = express();

require('dotenv').config(); // Add this at the very top
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());


// 2. Connect to Database
// Best practice: Connect BEFORE defining routes or starting the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

// Simple Route to test if server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists in MongoDB
    const user = await User.findOne({ email });
    
    // 2. If no user found OR password doesn't match
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 3. Login Success: Send back the user's role and name
    res.json({ 
      success: true, 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- SIGNUP ROUTE ---
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role, wealth, isVIP } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // 2. Create a new User
    // Note: We force the role to 'customer' for security, unless you want to allow creating admins
    const newUser = new User({
      name,
      email,
      password, // In a real app, encrypt this!
      role: role || 'customer' ,
      wealth,
      isVIP
    });

    await newUser.save();

    // 3. Send success response
    res.status(201).json({ 
      success: true, 
      user: { 
        id: newUser._id,
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// --- GET ALL ROOMS ROUTE ---
app.get('/api/rooms', async (req, res) => {
  try {
    // 1. Fetch all rooms from MongoDB
    const rooms = await Room.find();

    // 2. Send them to the frontend
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch rooms" });
  }
});

// --- GET SHARED ROOMS ROUTE ---
app.get('/api/rooms/shared', async (req, res) => {
  try {
    // 1. Fetch only shared rooms from MongoDB
    const sharedRooms = await Room.find({ isShared: true });

    // 2. Send them to the frontend
    res.json(sharedRooms);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch shared rooms" });
  }
});

// --- CREATE BOOKING ROUTE (UPDATED FOR SHARED GUEST COUNT) ---
app.post('/api/bookings', async (req, res) => {
  const {
    userId,
    roomId,
    checkIn,
    checkOut,
    totalAmount,
    guestCount, // <--- Now receiving this from frontend!
    isSharedBooking
  } = req.body;

  try {
    // 1. Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // 2. SHARED ROOM LOGIC
    if (room.isShared && isSharedBooking) {
      // Use guestCount directly (defaults to 1 if missing)
      const guests = guestCount || 1;

      // Check Capacity
      if (room.currentOccupancy + guests > room.maxOccupancy) {
        return res.status(400).json({
          success: false,
          message: `Not enough beds! Only ${room.maxOccupancy - room.currentOccupancy} left.`
        });
      }

      // Create Booking
      const newBooking = new Booking({
        user: userId, // The main user booking the beds
        room: roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalAmount: totalAmount,
        guestCount: guests, // Store the count
        isSharedBooking: true,
        status: 'confirmed'
      });

      await newBooking.save();

      // Update Room Occupancy
      const newOccupancy = room.currentOccupancy + guests;
      const newStatus = newOccupancy >= room.maxOccupancy ? 'fully_booked' : 'partially_booked';
      
      await Room.findByIdAndUpdate(roomId, {
        currentOccupancy: newOccupancy,
        status: newStatus
      });

      return res.status(201).json({ success: true, booking: newBooking });
    }

    // 3. PRIVATE ROOM LOGIC (Standard)
    const newBooking = new Booking({
      user: userId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount: totalAmount,
      guestCount: 1,
      status: 'confirmed'
    });

    await newBooking.save();

    // Mark room as occupied
    await Room.findByIdAndUpdate(roomId, { status: 'fully_booked' });

    res.status(201).json({ success: true, booking: newBooking });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Could not create booking" });
  }
});

// --- GET USER BOOKINGS ROUTE ---
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find bookings where user is either the primary user OR in the customers array
    const bookings = await Booking.find({
      $or: [
        { user: userId }, // Single bookings
        { 'customers.userId': userId } // Shared bookings where user is in customers array
      ]
    }).populate('room');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
});

// --- ADMIN: GET ALL BOOKINGS ---
app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Populate both User (name/email) and Room (roomNumber) details
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'roomNumber type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// --- ADMIN: GET USERS ---
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords!
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// --- ADMIN: DASHBOARD STATS ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Calculate Total Revenue
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    res.json({
      totalUsers,
      totalRooms,
      totalBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// --- ADMIN: ADD A NEW ROOM ---
app.post('/api/rooms', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating room" });
  }
});

// --- ADMIN: UPDATE A ROOM ---
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated version
    );
    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating room" });
  }
});

// --- ADMIN: DELETE A ROOM ---
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting room" });
  }
});

// --- ADMIN: DELETE USER ---
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// --- ADMIN: UPDATE USER ROLE (Promote/Demote) ---
app.put('/api/users/:id/role', async (req, res) => {
  const { role } = req.body; // e.g., { role: 'staff' }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true }
    );
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating role" });
  }
});

// --- STAFF: UPDATE BOOKING STATUS (Check In/Out) ---
app.put('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body; // e.g. 'checked_in', 'checked_out', 'cancelled'
  
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating booking" });
  }
});

// --- USER: UPDATE PROFILE ---
app.put('/api/users/:id', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // 1. Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Update fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // In a real app, hash this again!

    // 3. Save updates
    const updatedUser = await user.save();

    res.json({ 
      success: true, 
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role,
        isVIP: updatedUser.isVIP,
        wealth: updatedUser.wealth
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// 3. Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});