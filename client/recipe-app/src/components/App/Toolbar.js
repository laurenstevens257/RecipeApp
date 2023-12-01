// Toolbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Toolbar.css'; // Import the CSS file for styling

const Toolbar = () => {
  return (
    <div className="toolbar">
      <Link to="/home" className="toolbar-link">Home</Link>
      <Link to="/flavorites" className="toolbar-link">Flavorites</Link>
      <Link to="/search" className="toolbar-link">Search</Link>
    </div>
  );
};

export default Toolbar;
