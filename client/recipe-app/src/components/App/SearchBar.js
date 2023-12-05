import './SearchPage.css';
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchByUser, setSearchByUser] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, searchByUser);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className='search-container'>
        <input
          className='search-input'
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress} // Handle Enter key press
        />
        <button className='search-button' onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className='search-container'>
      <div className='search-user'>
        <input
          type="checkbox"
          checked={searchByUser}
          onChange={() => setSearchByUser(!searchByUser)}
        />
        <label className='search-user'>Search by User</label>
      </div>
      </div>
    </div>
  );
}

export default SearchBar;