import React, { useState } from 'react';
import FacilityCard from './FacilityCard';
import './FacilitySearch.css';
import { mockConferenceRoomsVIP, mockHallsVIP, mockConferenceRoomsRegular, mockHallsRegular } from '../../data/mockData';

const FacilitySearch = ({ onBookFacility, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  // Get facilities based on VIP status
  const conferenceRooms = user?.isVIP ? mockConferenceRoomsVIP : mockConferenceRoomsRegular;
  const halls = user?.isVIP ? mockHallsVIP : mockHallsRegular;
  const allFacilities = [...conferenceRooms, ...halls];

  // Filter facilities
  const filteredFacilities = allFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || facility.type === typeFilter;
    const matchesCapacity = capacityFilter === 'all' || 
      (capacityFilter === 'small' && facility.capacity < 50) ||
      (capacityFilter === 'medium' && facility.capacity >= 50 && facility.capacity < 150) ||
      (capacityFilter === 'large' && facility.capacity >= 150);
    
    return matchesSearch && matchesType && matchesCapacity;
  });

  return (
    <div className="facility-search">
      <div className="search-header">
        <h2>Book Conference Rooms & Halls</h2>
        <p>Host your events, meetings, and celebrations with our premium facilities</p>
        {user?.isVIP && (
          <div className="vip-info-banner">
            ⭐ VIP Privilege: You can book up to 2 conference rooms and/or 1 hall (select based on your needs)
          </div>
        )}
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="conference-room">Conference Rooms</option>
            <option value="hall">Halls</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Capacity</label>
          <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)}>
            <option value="all">All Capacities</option>
            <option value="small">Small (&lt;50)</option>
            <option value="medium">Medium (50-150)</option>
            <option value="large">Large (&gt;150)</option>
          </select>
        </div>
      </div>

      <div className="facilities-grid">
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map(facility => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onBookFacility={onBookFacility}
              user={user}
            />
          ))
        ) : (
          <div className="no-facilities">
            <p>No facilities found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitySearch;

