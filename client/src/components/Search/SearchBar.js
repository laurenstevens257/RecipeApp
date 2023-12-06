import React, { useState } from 'react';
import './SearchPage.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchByUser, setSearchByUser] = useState(false);
  const [searchByTags, setSearchByTags] = useState(false); // State for searching by tags

  const handleSearch = () => {
    if(searchTerm.startsWith('#')){
      const newTerm = searchTerm.substring(1);
      onSearch(newTerm, searchByUser, searchByTags);
    } else{
      onSearch(searchTerm, searchByUser, searchByTags); // Pass both searchByUser and searchByTags to onSearch
    }
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
      <p>options:</p>
      <div className='search-options-container'>
        <div className='search-option'>
          <input
            type="checkbox"
            checked={searchByUser}
            onChange={handleUserCheckbox}
          />
          <label>Search by User</label>
        </div>
        <div className='search-option'>
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
