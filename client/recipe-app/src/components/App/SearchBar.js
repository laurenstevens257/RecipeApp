import './SearchPage.css';
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchByUser, setSearchByUser] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, searchByUser);
  };

  return (
    <div>
      <div class='search-container'> 
        <input
          class='search-input'
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button class='search-button' onClick={handleSearch}>Search</button>
      </div>
      <div class='search-checkbox'>
        <input
          type="checkbox"
          checked={searchByUser}
          onChange={() => setSearchByUser(!searchByUser)}
        />
        <label>Search by User</label>
      </div>
    </div>
  );
}

export default SearchBar;