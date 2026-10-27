import React from 'react';

const Navbar = ({ email, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Daily Task Manager</div>
      <div className="navbar-user">
        <span>Logged in as: <strong>{email}</strong></span>
        <button onClick={onLogout} className="btn btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
