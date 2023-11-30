import React, { useState } from 'react';
import './SearchPage.css'; // Make sure the path to the CSS file is correct

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement your search logic here
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleInputChange} 
        onKeyDown={handleKeyDown} 
        placeholder="Search..." 
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
  );
};

export default SearchPage;
