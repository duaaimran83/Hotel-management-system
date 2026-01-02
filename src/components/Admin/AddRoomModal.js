import React, { useState } from 'react';
import './EditRoomModal.css';

const AddRoomModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    capacity: '',
    beds: '',
    price: '',
    amenities: '',
    status: 'available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: Date.now().toString(),
      ...formData,
      capacity: parseInt(formData.capacity),
      beds: parseInt(formData.beds),
      price: parseFloat(formData.price),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a)
    };
    onSave(newRoom);
  };

  return (
    <div className="edit-room-modal-overlay" onClick={onClose}>
      <div className="edit-room-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Room</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-room-form">
          <div className="form-row">
            <div className="form-group">
              <label>Room Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacity (guests)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Beds</label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Price per Night ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amenities (comma-separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="WiFi, TV, Mini Bar, Air Conditioning"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;

