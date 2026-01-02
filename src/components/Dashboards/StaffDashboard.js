import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import CheckInOut from '../Staff/CheckInOut';
import RoomStatus from '../Staff/RoomStatus';
import BookingManagement from '../Staff/BookingManagement';
import FacilityApproval from '../Staff/FacilityApproval';
import Footer from '../Footer/Footer';

const StaffDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        // A. Fetch All Rooms
        const roomsRes = await fetch('http://localhost:5000/api/rooms');
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.map(r => ({ ...r, id: r._id })));
        }

        // B. Fetch All Bookings (Using the Admin route to see everything)
        const bookingsRes = await fetch('http://localhost:5000/api/admin/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          // Format for UI
          const formattedBookings = bookingsData.map(b => ({
            ...b,
            id: b._id,
            userName: b.user ? b.user.name : 'Unknown Guest', // Flatten for child components
            roomName: b.room ? (b.room.name || `Room ${b.room.roomNumber}`) : 'Unknown Room',
            roomId: b.room ? b.room._id : null
          }));
          setBookings(formattedBookings);
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, []);

  // --- HELPER: UPDATE ROOM STATUS ---
  const updateRoomStatusAPI = async (roomId, newStatus) => {
    if (!roomId) return;
    try {
      await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Update local room state
      setRooms(prevRooms => prevRooms.map(r => 
        r.id === roomId ? { ...r, status: newStatus } : r
      ));
    } catch (err) {
      console.error("Failed to auto-update room status", err);
    }
  };

  // --- 2. HANDLE CHECK-IN ---
  const handleCheckIn = async (bookingId) => {
    try {
      // 1. Update Booking Status
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'checked_in' }), // Use snake_case for consistency usually, or match your DB
      });
      
      if (response.ok) {
        // 2. Update Local Booking State
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'checked_in', checkInTime: new Date().toISOString() } : b
        ));

        // 3. Auto-update Room to "Occupied"
        const booking = bookings.find(b => b.id === bookingId);
        if (booking && booking.roomId) {
          await updateRoomStatusAPI(booking.roomId, 'occupied');
        }

        alert('Check-in successful!');
      }
    } catch (error) {
      alert("Error processing check-in");
    }
  };

  // --- 3. HANDLE CHECK-OUT ---
  const handleCheckOut = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'checked_out' }),
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'checked_out', checkOutTime: new Date().toISOString() } : b
        ));

        // Auto-update Room to "Available" (or Maintenance if you prefer)
        const booking = bookings.find(b => b.id === bookingId);
        if (booking && booking.roomId) {
          await updateRoomStatusAPI(booking.roomId, 'available');
        }

        alert('Check-out successful!');
      }
    } catch (error) {
      alert("Error processing check-out");
    }
  };

  // --- 4. MANUAL ROOM STATUS CHANGE ---
  const handleRoomStatusChange = async (roomId, newStatus) => {
    try {
      await updateRoomStatusAPI(roomId, newStatus);
      alert(`Room status updated to ${newStatus}`);
    } catch (error) {
      alert("Error updating room status");
    }
  };

  // --- 5. FACILITY APPROVALS ---
  const handleApproveFacilityBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'confirmed', approvedBy: user.id } : b
        ));
        alert('Facility booking approved!');
      }
    } catch (error) {
      alert("Error approving booking");
    }
  };

  const handleRejectFacilityBooking = async (bookingId, reason) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b
        ));
        alert('Facility booking rejected.');
      }
    } catch (error) {
      alert("Error rejecting booking");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>RoomSync - Staff Portal</h1>
          <div className="user-info">
            <span>Staff: {user.name || user.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'checkin' ? 'active' : ''}
          onClick={() => setActiveTab('checkin')}
        >
          Check-In / Check-Out
        </button>
        <button 
          className={activeTab === 'approvals' ? 'active' : ''}
          onClick={() => setActiveTab('approvals')}
        >
          Facility Approvals
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          Room Status
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Booking Management
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'checkin' && (
          <CheckInOut 
            bookings={bookings} 
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}
        {activeTab === 'approvals' && (
          <FacilityApproval 
            bookings={bookings} 
            onApprove={handleApproveFacilityBooking}
            onReject={handleRejectFacilityBooking}
          />
        )}
        {activeTab === 'rooms' && (
          <RoomStatus 
            rooms={rooms}
            onStatusChange={handleRoomStatusChange}
          />
        )}
        {activeTab === 'bookings' && (
          <BookingManagement bookings={bookings} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StaffDashboard;