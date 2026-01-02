import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import RoomSearch from '../Rooms/RoomSearch';
import BookingHistory from '../Bookings/BookingHistory';
import Profile from '../Profile/Profile';
import Reviews from '../Reviews/Reviews';
import PaymentModal from '../Payment/PaymentModal';
import Footer from '../Footer/Footer';
import FacilitySearch from '../Facilities/FacilitySearch';
import VIPFacilityBookingModal from '../Facilities/VIPFacilityBookingModal';
import RegularFacilityBookingModal from '../Facilities/RegularFacilityBookingModal';
import SharedRoomBookingModal from '../Rooms/SharedRoomBookingModal';

const CustomerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Initialize with empty array, we will fill this from DB
  const [rooms, setRooms] = useState([]); 
  const [bookings, setBookings] = useState([]); 
  
  const [showFacilityBookingModal, setShowFacilityBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [showSharedBookingModal, setShowSharedBookingModal] = useState(false);
  const [sharedBookingData, setSharedBookingData] = useState(null);

  // --- 1. FETCH DATA (Rooms & Bookings) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Rooms
        const roomRes = await fetch('http://localhost:5000/api/rooms');
        const roomData = await roomRes.json();
        const formattedRooms = roomData.map(room => ({ ...room, id: room._id }));
        setRooms(formattedRooms);

        // B. Fetch Bookings (Only if user is logged in)
        if (user && (user.id || user._id)) {
          const userId = user.id || user._id;
          const bookingRes = await fetch(`http://localhost:5000/api/bookings/${userId}`);
          
          if (bookingRes.ok) {
            const bookingData = await bookingRes.json();
            
            // Format for UI
            const formattedBookings = bookingData.map(b => ({
              ...b,
              id: b._id,
              // Handle room name safely (it might be populated or null)
              roomName: b.room ? (b.room.name || `Room ${b.room.roomNumber}`) : 'Unknown Room',
              status: b.status,
              totalAmount: b.totalAmount,
              checkIn: b.checkInDate,
              checkOut: b.checkOutDate
            }));
            setBookings(formattedBookings);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [user]); // Re-run if user changes


  // --- 2. HANDLE ROOM BOOKING FLOW ---
  const handleBookRoom = (room, checkIn, checkOut, isShared = false) => {
    if (isShared) {
      // For shared rooms, show the shared booking modal
      setSharedBookingData({ room, checkIn, checkOut });
      setShowSharedBookingModal(true);
      setActiveTab('search'); // Keep user on search tab
    } else {
      // For regular rooms, proceed with normal payment flow
      const newBooking = {
        // Temporary ID for UI until saved to DB
        id: Date.now().toString(),
        roomId: room.id, // Ensure this matches MongoDB _id
        roomName: room.name || `Room ${room.roomNumber}`,
        checkIn,
        checkOut,
        totalAmount: room.price * Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)),
        status: 'pending',
        userId: user.id || user._id,
        createdAt: new Date().toISOString()
      };

      // Add to local state temporarily so PaymentModal can see it
      setSelectedBooking(newBooking);
      setShowPaymentModal(true);
      setActiveTab('bookings');
    }
  };

  // --- 3. HANDLE SHARED ROOM BOOKING ---
  const handleSharedBooking = async (bookingData) => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh bookings data
        const userId = user.id || user._id;
        const bookingRes = await fetch(`http://localhost:5000/api/bookings/${userId}`);
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          const formattedBookings = bookingData.map(b => ({
            ...b,
            id: b._id,
            roomName: b.room ? (b.room.name || `Room ${b.room.roomNumber}`) : 'Unknown Room',
          }));
          setBookings(formattedBookings);
        }

        // Refresh rooms data to update occupancy
        const roomRes = await fetch('http://localhost:5000/api/rooms');
        const roomData = await roomRes.json();
        const formattedRooms = roomData.map(room => ({ ...room, id: room._id }));
        setRooms(formattedRooms);

        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      }
    } catch (error) {
      console.error('Shared booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  // --- 4. HANDLE FACILITY BOOKING FLOW ---
  const handleBookFacility = (facility) => {
    setSelectedFacility(facility);
    setShowFacilityBookingModal(true);
  };

  // --- 4. PREPARE FACILITY BOOKING (Don't save yet) ---
  const handleFacilityBookingConfirm = (bookingData) => {
    // Prepare the data object with ALL fields (Type, Time, Notes)
    const facilityBooking = {
      id: Date.now().toString(), // Temp ID for UI
      userId: user.id || user._id,
      type: 'facility', // CRITICAL: This tells DB it's an event
      
      // Map Facility Data
      title: bookingData.title || 'Event Booking',
      occasion: bookingData.occasion || 'General',
      facilityName: bookingData.facility?.name || bookingData.hall?.name || 'Conference Room',
      numberOfPeople: bookingData.numberOfPeople || bookingData.guests,
      
      // New Fields (Time, Notes)
      startTime: bookingData.startTime, 
      endTime: bookingData.endTime,
      notes: bookingData.notes,
      
      checkIn: bookingData.date, 
      checkOut: bookingData.date, // Same day for events
      totalAmount: bookingData.totalAmount,
      status: 'pending_approval',
    };

    // Store this in state so handlePayment can access it later
    setSelectedBooking(facilityBooking);
    
    // Close facility modal and open payment modal
    setShowFacilityBookingModal(false);
    setSelectedFacility(null);
    setShowPaymentModal(true);
  };

  // --- 5. SAVE TO DATABASE ON PAYMENT (Unified for Rooms & Facilities) ---
  const handlePayment = async (paymentDetails) => {
    // CRITICAL FIX: Spread 'selectedBooking' first to keep type, notes, etc.
    const bookingData = {
      ...selectedBooking, 
      userId: user.id || user._id,
      paymentDetails
    };

    // Remove the temporary ID so MongoDB can generate a real one
    delete bookingData.id; 

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        // Success: Use the real booking from DB
        const confirmedBooking = { 
            ...selectedBooking, 
            id: data.booking._id, // Use real DB ID
            status: data.booking.status, // Use status from backend
            paymentDetails 
        };

        // Update list
        setBookings(prev => [...prev, confirmedBooking]);
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        setSelectedBooking(null); // Clear selection
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Server error. Check if backend is running.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>RoomSync - Customer Portal</h1>
          <div className="user-info">
            <span>
              Welcome, {user.name || user.email}
              {user.isVIP && (
                <span style={{ marginLeft: '10px', padding: '4px 12px', background: 'linear-gradient(135deg, #ffd700, #ffed4e)', color: '#013328', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  ⭐ VIP
                </span>
              )}
            </span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>Search & Book Rooms</button>
        <button className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}>Conference Rooms & Halls</button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>My Bookings</button>
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews & Feedback</button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'search' && <RoomSearch rooms={rooms} onBookRoom={handleBookRoom} user={user} />}
        {activeTab === 'facilities' && <FacilitySearch onBookFacility={handleBookFacility} user={user} />}
        {activeTab === 'bookings' && <BookingHistory bookings={bookings} user={user} />}
        {activeTab === 'reviews' && <Reviews user={user} />}
        {activeTab === 'profile' && <Profile user={user} />}
      </main>

      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => { setShowPaymentModal(false); setSelectedBooking(null); }}
          onPayment={handlePayment}
        />
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed.</p>
            <button className="success-btn" onClick={() => { setShowSuccessModal(false); setSelectedBooking(null); }}>Close</button>
          </div>
        </div>
      )}

      {showFacilityBookingModal && (
        user?.isVIP ?
        <VIPFacilityBookingModal onClose={() => setShowFacilityBookingModal(false)} onConfirm={handleFacilityBookingConfirm} user={user} /> :
        <RegularFacilityBookingModal facility={selectedFacility} onClose={() => setShowFacilityBookingModal(false)} onConfirm={handleFacilityBookingConfirm} user={user} />
      )}

      {showSharedBookingModal && sharedBookingData && (
        <SharedRoomBookingModal
          room={sharedBookingData.room}
          checkIn={sharedBookingData.checkIn}
          checkOut={sharedBookingData.checkOut}
          onClose={() => {
            setShowSharedBookingModal(false);
            setSharedBookingData(null);
          }}
          onConfirmBooking={handleSharedBooking}
        />
      )}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;