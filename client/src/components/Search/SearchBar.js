import './SearchPage.css';
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchByUser, setSearchByUser] = useState(false);
  const [searchByTags, setSearchByTags] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, searchByUser);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserCheckbox = () => {
    setSearchByUser(!searchByUser);
    if (searchByTags) setSearchByTags(false); // Uncheck searchByTags if it's checked
  };

  const handleTagCheckbox = () => {
    setSearchByTags(!searchByTags);
    if (searchByUser) setSearchByUser(false); // Uncheck searchByUser if it's checked
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
            onChange={() => handleUserCheckbox}
          />
          <label className='search-user'>Search by User</label>
        </div>
      </div>
      <div className='search-container'>
        <div className='search-tag'>
            <input
              type="checkbox"
              checked={searchByTags}
              onChange={handleTagCheckbox}
            />
            <label>Search by Tags</label>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;