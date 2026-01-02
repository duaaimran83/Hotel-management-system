import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import AdminOverview from '../Admin/AdminOverview';
import UserManagement from '../Admin/UserManagement';
import RoomManagement from '../Admin/RoomManagement';
import Reports from '../Admin/Reports';
import FacilityApproval from '../Admin/FacilityApproval';
import Footer from '../Footer/Footer';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // 1. Initialize with empty arrays (Waiting for DB data)
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  // 2. FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // A. Fetch All Users
        const usersRes = await fetch('http://localhost:5000/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Map _id to id for frontend compatibility
          setUsers(usersData.map(u => ({ ...u, id: u._id })));
        }

        // B. Fetch All Rooms (Re-using the public API)
        const roomsRes = await fetch('http://localhost:5000/api/rooms');
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.map(r => ({ ...r, id: r._id })));
        }

        // C. Fetch All Bookings
        const bookingsRes = await fetch('http://localhost:5000/api/admin/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          
          // Format booking data for the Admin Table
          const formattedBookings = bookingsData.map(b => ({
            ...b,
            id: b._id,
            // Handle nested populated data safely
            userName: b.user ? b.user.name : 'Unknown User',
            userEmail: b.user ? b.user.email : 'No Email',
            roomName: b.room ? `Room ${b.room.roomNumber}` : 'Unknown Room',
            roomType: b.room ? b.room.type : 'N/A'
          }));
          
          setBookings(formattedBookings);
        }

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  // --- Handlers for Facility Approvals (Local State Updates for now) ---
  // Note: To make this permanent, you would need a backend route like PUT /api/bookings/:id
  const handleApproveFacilityBooking = (bookingId) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'confirmed', approvedAt: new Date().toISOString(), approvedBy: user.id }
        : booking
    );
    setBookings(updatedBookings);
    alert('VIP facility booking approved successfully!');
  };

  const handleRejectFacilityBooking = (bookingId, reason) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'rejected', rejectedAt: new Date().toISOString(), rejectedBy: user.id, rejectionReason: reason || 'No reason provided' }
        : booking
    );
    setBookings(updatedBookings);
    alert('VIP facility booking rejected.');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>RoomSync - Admin Portal</h1>
          <div className="user-info">
            <span>Admin: {user.name || user.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Analytics
        </button>
        <button 
          className={activeTab === 'approvals' ? 'active' : ''}
          onClick={() => setActiveTab('approvals')}
        >
          VIP Facility Approvals
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          Room Management
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports & Analytics
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Pass the REAL fetched data down to child components */}
        {activeTab === 'overview' && (
          <AdminOverview bookings={bookings} rooms={rooms} users={users} />
        )}
        {activeTab === 'approvals' && (
          <FacilityApproval 
            bookings={bookings} 
            onApprove={handleApproveFacilityBooking}
            onReject={handleRejectFacilityBooking}
          />
        )}
        {activeTab === 'users' && (
          <UserManagement users={users} setUsers={setUsers} />
        )}
        {activeTab === 'rooms' && (
          <RoomManagement rooms={rooms} setRooms={setRooms} />
        )}
        {activeTab === 'reports' && (
          <Reports bookings={bookings} rooms={rooms} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;