const mongoose = require('mongoose');

// 1. Import your Models
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// 2. Connection String
const MONGO_URI = "mongodb+srv://adminfswd:fswdproject@trycluster0.rawptfn.mongodb.net/RoomSync?appName=TryCluster0";

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB...");

    // A. CLEAR EXISTING DATA
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log("Old data cleared...");

    // --- B. CREATE USERS ---
    const createdUsers = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@roomsync.com",
        password: "123",
        role: "admin",
        wealth: 0
      },
      {
        name: "Sarah Staff",
        email: "staff@roomsync.com",
        password: "123",
        role: "staff",
        wealth: 0
      },
      {
        name: "Ali Tareen (VIP)",
        email: "ali@vip.com",
        password: "123",
        role: "customer",
        wealth: 500000, // VIP Status
        isVIP: true
      },
      {
        name: "Aeman Student",
        email: "aeman@student.com",
        password: "123",
        role: "customer",
        wealth: 500
      },
      {
        name: "Maheen Traveler",
        email: "maheen@traveler.com",
        password: "123",
        role: "customer",
        wealth: 2000
      },
      {
        name: "Duaa Explorer",
        email: "duaa@explorer.com",
        password: "123",
        role: "customer",
        wealth: 20000
      }
    ]);
    
    // CORRECTLY DESTRUCTURE THE USERS ARRAY
    const [admin, staff, ali, aeman, maheen, duaa] = createdUsers;
    console.log("Users added: Admin, Staff, Ali(VIP), Aeman, Maheen, Duaa");

    // --- C. CREATE ROOMS ---
    const createdRooms = await Room.insertMany([
      // 1. SHARED DORM (Partially Full)
      {
        roomNumber: "DORM-01",
        type: "Shared Dormitory",
        basePricePerPerson: 50,
        status: "partially_booked",
        isShared: true,
        maxOccupancy: 6,
        currentOccupancy: 2, 
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=60",
        amenities: ["Bunk Beds", "Lockers", "WiFi"]
      },
      // 2. SHARED SUITE (Empty)
      {
        roomNumber: "DORM-02",
        type: "Female Dorm",
        basePricePerPerson: 40,
        status: "available",
        isShared: true,
        maxOccupancy: 4,
        currentOccupancy: 0,
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500&q=60",
        amenities: ["Ensuite Bath", "Quiet Zone"]
      },
      // 3. STANDARD PRIVATE ROOM (Occupied by Aeman)
      {
        roomNumber: "101",
        type: "Single",
        price: 100,
        status: "fully_booked", 
        isShared: false,
        maxOccupancy: 1,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=60",
        amenities: ["TV", "City View"]
      },
      // 4. MAINTENANCE ROOM (For Staff Demo)
      {
        roomNumber: "102",
        type: "Double",
        price: 150,
        status: "maintenance", 
        isShared: false,
        maxOccupancy: 2,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=60"
      },
      // 5. VIP PENTHOUSE (Only for Ali)
      {
        roomNumber: "VIP-PENTHOUSE",
        type: "Presidential Suite",
        price: 2500,
        status: "available",
        isShared: false,
        isVIP: true, 
        maxOccupancy: 4,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=60",
        amenities: ["Private Pool", "Butler", "Ocean View"]
      }
    ]);

    const [dorm1, dorm2, room101, room102, vipRoom] = createdRooms;
    console.log("Rooms added (Dorms, Private, & VIP)");

    // --- D. CREATE BOOKINGS ---
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const lastMonth = new Date(today); lastMonth.setDate(today.getDate() - 30);

    await Booking.insertMany([
      // 1. ARRIVING TODAY -> Maheen (Staff needs to Check In)
      {
        user: maheen._id,
        room: dorm1._id,
        checkInDate: today,
        checkOutDate: tomorrow,
        totalAmount: 50,
        status: 'confirmed', 
        isSharedBooking: true,
        guestCount: 1,
        type: 'room'
      },
      // 2. LEAVING TODAY -> Aeman (Staff needs to Check Out)
      {
        user: aeman._id,
        room: room101._id,
        checkInDate: yesterday,
        checkOutDate: today,
        totalAmount: 100,
        status: 'checked_in', 
        isSharedBooking: false,
        guestCount: 1,
        type: 'room'
      },
      // 3. PAST HISTORY -> Ali (For his profile)
      {
        user: ali._id,
        room: room102._id, 
        checkInDate: lastMonth,
        checkOutDate: new Date(lastMonth.getTime() + 86400000),
        totalAmount: 150,
        status: 'checked_out',
        isSharedBooking: false,
        guestCount: 2,
        type: 'room'
      },
      // 4. FUTURE BOOKING -> Duaa
      {
        user: duaa._id,
        room: dorm2._id, 
        checkInDate: tomorrow,
        checkOutDate: new Date(tomorrow.getTime() + 86400000),
        totalAmount: 40,
        status: 'pending',
        isSharedBooking: true,
        guestCount: 1,
        type: 'room'
      }
    ]);
    console.log("Bookings added for Maheen, Aeman, Ali, and Duaa");

    // --- E. FINISH ---
    console.log("------------------------------------------------");
    console.log("DATABASE SEEDED FOR VIVA!");
    console.log("ADMIN:   admin@roomsync.com   / 123");
    console.log("STAFF:   staff@roomsync.com   / 123");
    console.log("VIP:     ali@vip.com          / 123");
    console.log("STUDENT: aeman@student.com    / 123");
    console.log("GUEST:   maheen@traveler.com  / 123");
    console.log("------------------------------------------------");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();