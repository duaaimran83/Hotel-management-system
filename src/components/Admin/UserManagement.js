import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- API: UPDATE USER ROLE ---
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local UI immediately
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Role Error:", error);
      alert("Server error updating role");
    }
  };

  // --- API: DELETE USER ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove user from local UI
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Server error deleting user");
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        {/* Note: In a real app, admins usually don't create users manually, users sign up themselves. */}
        <div className="user-count-badge">
          Total Users: {users.length}
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role (Edit)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      #{user.id.slice(-6)}
                    </span>
                  </td>
                  <td>
                    {user.name}
                    {user.isVIP && <span style={{ marginLeft: '5px' }}>⭐</span>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {/* ROLE DROPDOWN */}
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                      style={{
                        padding: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        background: user.role === 'admin' ? '#e0f2fe' : 
                                   user.role === 'staff' ? '#f0fdf4' : '#fff'
                      }}
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;