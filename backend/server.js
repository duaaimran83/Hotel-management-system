const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// REPLACE THIS STRING WITH YOUR OWN FROM ATLAS
const MONGO_URI = "mongodb+srv://adminfswd:fswdproject@trycluster0.rawptfn.mongodb.net/RoomSync?appName=TryCluster0";

// Connect to Database
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("DB Connection Error:", err));

app.get('/', (req, res) => res.send('API is running...'));

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    res.json({ 
      success: true, 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role,
        isVIP: user.isVIP,
        wealth: user.wealth
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      password,
      role: role || 'customer',
      wealth,
      isVIP
    });
    await newUser.save();
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
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// --- GET ALL ROOMS ---
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find(); 
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch rooms" });
  }
});

// --- CREATE BOOKING ROUTE (UPDATED FOR FACILITIES) ---
app.post('/api/bookings', async (req, res) => {
  // Destructure ALL fields including new Facility ones
  const { 
    userId, 
    roomId, 
    checkIn, 
    checkOut, 
    totalAmount, 
    // Facility Fields:
    type, 
    title, 
    occasion, 
    facilityName, 
    numberOfPeople, 
    startTime, 
    endTime, 
    notes 
  } = req.body;

  try {
    const newBooking = new Booking({
      user: userId,
      room: roomId || null, // Room ID is null for facilities
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount: totalAmount,
      
      // CRITICAL: Save the new fields!
      type: type || 'room', 
      status: type === 'facility' ? 'pending_approval' : 'confirmed', // Auto-confirm rooms, wait for events
      title,
      occasion,
      facilityName,
      numberOfPeople,
      startTime,
      endTime,
      notes
    });

    await newBooking.save();

    // Update Room status ONLY if it's a Room booking
    if (type !== 'facility' && roomId) {
      await Room.findByIdAndUpdate(roomId, { status: 'booked' });
    }

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Could not create booking" });
  }
});

// --- GET USER BOOKINGS ---
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate('room');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
});

// --- ADMIN: GET ALL BOOKINGS ---
app.get('/api/admin/bookings', async (req, res) => {
  try {
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
    const users = await User.find().select('-password');
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
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    res.json({ totalUsers, totalRooms, totalBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// --- ADMIN: ROOM MANAGEMENT ---
app.post('/api/rooms', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating room" });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating room" });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting room" });
  }
});

// --- ADMIN: USER MANAGEMENT ---
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

app.put('/api/users/:id/role', async (req, res) => {
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating role" });
  }
});

// --- STAFF: UPDATE BOOKING STATUS ---
app.put('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating booking" });
  }
});

// --- USER: UPDATE PROFILE ---
app.put('/api/users/:id', async (req, res) => {
  const { name, email, password, wealth, isVIP } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    // Update Wealth/VIP if provided
    if (wealth !== undefined) user.wealth = wealth;
    if (isVIP !== undefined) user.isVIP = isVIP;

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});