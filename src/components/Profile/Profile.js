import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || ''); // Note: Add 'phone' to User Schema if you want to save this permanently
  const [address, setAddress] = useState(user.address || ''); // Note: Add 'address' to User Schema if you want to save this permanently
  const [wealth, setWealth] = useState(user.wealth || 0);
  const [password, setPassword] = useState(''); // Allow password change

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Calculate new VIP status locally for feedback (Backend also handles this)
    const VIP_WEALTH_THRESHOLD = 10000;
    const updatedWealth = parseFloat(wealth) || 0;
    const updatedIsVIP = updatedWealth >= VIP_WEALTH_THRESHOLD;

    const userId = user.id || user._id;

    try {
      // 2. Send Update to Backend
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          wealth: updatedWealth,
          isVIP: updatedIsVIP,
          // Only send password if the user actually typed a new one
          ...(password ? { password } : {})
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 3. Update Local Storage so the session stays fresh
        // In a real app, you'd update a global Context here too.
        const updatedUserSession = { ...user, ...data.user };
        localStorage.setItem('roomsync_user', JSON.stringify(updatedUserSession));

        alert(`Profile updated successfully! ${updatedIsVIP ? 'You now have VIP status! 🌟' : ''}`);
        // Optional: Reload page to reflect changes everywhere
        window.location.reload(); 
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("Server error updating profile.");
    }
  };

  return (
    <div className="profile">
      <h2>My Profile</h2>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
          </div>
          <h3>{name || email}</h3>
          <p className="user-role">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            {(user.isVIP || wealth >= 10000) && (
              <span style={{ 
                marginLeft: '10px', 
                padding: '4px 12px', 
                background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
                color: '#013328',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ⭐ VIP
              </span>
            )}
          </p>
          {user.role === 'customer' && (
            <p style={{ marginTop: '8px', fontSize: '1rem', color: '#666' }}>
              Wealth: <strong style={{ color: '#013328' }}>${Number(wealth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled // Keep email disabled for safety, or allow change if you want
            />
          </div>

          <div className="form-group">
            <label>New Password (Optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password to change"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              rows="3"
            />
          </div>

          {user.role === 'customer' && (
            <div className="form-group">
              <label>Wealth/Balance ($)</label>
              <input
                type="number"
                value={wealth}
                onChange={(e) => setWealth(e.target.value)}
                placeholder="Enter your wealth amount"
                min="0"
                step="0.01"
              />
              <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                {wealth >= 10000 ? (
                  <span style={{ color: '#02604b', fontWeight: '600' }}>✓ You qualify for VIP status!</span>
                ) : (
                  `Need $${(10000 - wealth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more for VIP status`
                )}
              </small>
            </div>
          )}

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;