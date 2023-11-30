// Toolbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Toolbar.css'; // Import the CSS file for styling

const Toolbar = () => {
  return (
    <div className="toolbar">
      <Link to="/favorites" className="toolbar-link">Favorites</Link>
      <Link to="/search" className="toolbar-link">Search</Link>
      <Link to="/create" className="toolbar-link">Create</Link>
    </div>
  );
};

export default Toolbar;
