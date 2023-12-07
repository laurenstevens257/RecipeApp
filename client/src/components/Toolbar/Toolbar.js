// Toolbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Toolbar.css'; // Import the CSS file for styling

const Toolbar = ({ onLogout }) => (
  <div>
    {/* First Toolbar */}
    <div className="toolbar">
      <Link to="/" className="toolbar-link">Home</Link>
      <Link to="/flavorites" className="toolbar-link">Flavorites</Link>
      <Link to="/search" className="toolbar-link">Search</Link>
      <Link to="/random-recipe" className="toolbar-link">Random</Link> 
    </div>
    
    {/* Second Toolbar */}
    <div className="secondary-toolbar">
    <Link to="/groceryList" className="toolbar-link">Grocery List</Link>

    <Link to="/calculatorPage" className="toolbar-link">Measurement Converter</Link>

    <div onClick={onLogout} className="toolbar-link" style={{ cursor: 'pointer' }}>Logout</div>
    </div>
    <div className="header-container">
      <img className="png-iframe" src='Banner.png' alt='Banner'></img>
    </div>
  </div>  
);

export default Toolbar;
