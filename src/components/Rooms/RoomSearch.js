import React, { useState } from 'react';
import RoomCard from './RoomCard';
import './RoomSearch.css';

const RoomSearch = ({ rooms, onBookRoom, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sharedRoomOnly, setSharedRoomOnly] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // --- SAFE FILTERING LOGIC ---
  const filteredRooms = rooms.filter(room => {
    // CRITICAL FIX: Handle missing data safely
    // 1. If 'name' is missing, use "Room 101"
    // 2. If 'type' or 'category' is missing, use "Standard"
    // 3. Ensure we always have a string before calling .toLowerCase()
    
    const safeName = (room.name || `Room ${room.roomNumber || 'Unknown'}`).toString();
    const safeCategory = (room.type || room.category || 'Standard').toString();
    const safeSearchTerm = (searchTerm || '').toString().toLowerCase();

    // 1. VIP Filter
    const matchesVIPStatus = user?.isVIP ? room.isVIP : !room.isVIP;
    
    // 2. Search Filter (Safe Version)
    const matchesSearch = 
      safeName.toLowerCase().includes(safeSearchTerm) ||
      safeCategory.toLowerCase().includes(safeSearchTerm);

    // 3. Category/Type Filter
    const matchesCategory = categoryFilter === 'all' || safeCategory === categoryFilter;

    // 4. Price Filter
    const matchesPrice = priceRange === 'all' || 
      (user?.isVIP 
        ? (
          (priceRange === 'low' && room.price >= 500 && room.price < 700) ||
          (priceRange === 'medium' && room.price >= 700 && room.price < 1000) ||
          (priceRange === 'high' && room.price >= 1000)
        )
        : (
          (priceRange === 'low' && room.price < 100) ||
          (priceRange === 'medium' && room.price >= 100 && room.price < 200) ||
          (priceRange === 'high' && room.price >= 200)
        )
      );
    
    // 5. Shared Room Filter
    const matchesSharedRoom = !sharedRoomOnly || room.isSharedRoom;
    
    return matchesVIPStatus && matchesSearch && matchesCategory && matchesPrice && matchesSharedRoom;
  });

  // --- DYNAMIC CATEGORY LIST ---
  // Safely extract categories from available rooms
  const availableRooms = rooms.filter(room => user?.isVIP ? room.isVIP : !room.isVIP);
  
  const categories = ['all', ...new Set(availableRooms.map(r => 
    (r.type || r.category || 'Standard').toString()
  ))];

  return (
    <div className="room-search">
      <div className="search-header">
        <h2>Search & Book Rooms</h2>
        <p>Find your perfect stay with our premium accommodations</p>
        {!user?.isVIP && user?.wealth !== undefined && (
          <div className="vip-upgrade-banner">
            💎 Upgrade to VIP status by reaching $10,000 in wealth. Current: ${user.wealth?.toLocaleString() || 0}
          </div>
        )}
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Check-in Date</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
          />
        </div>

        <div className="filter-group">
          <label>Check-out Date</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || tomorrow}
          />
        </div>

        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Room Type</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="all">All Prices</option>
            {user?.isVIP ? (
              <>
                <option value="low">$500 - $700</option>
                <option value="medium">$700 - $1000</option>
                <option value="high">Above $1000</option>
              </>
            ) : (
              <>
                <option value="low">Under $100</option>
                <option value="medium">$100 - $200</option>
                <option value="high">Above $200</option>
              </>
            )}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sharedRoomOnly}
              onChange={(e) => setSharedRoomOnly(e.target.checked)}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            Shared Rooms Only (3 Beds)
          </label>
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              // CRITICAL: We pass the safe name down to the card too!
              room={{
                ...room,
                name: room.name || `Room ${room.roomNumber}`,
                category: room.type || room.category || 'Standard'
              }}
              checkIn={checkIn}
              checkOut={checkOut}
              onBookRoom={onBookRoom}
            />
          ))
        ) : (
          <div className="no-rooms">
            <p>
              {user?.isVIP 
                ? "No VIP rooms found matching your criteria." 
                : "No rooms found matching your criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSearch;