import './SearchPage.css';
import '../Home/HomeDisplay.css';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Make sure this path is correct

function SearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // State to track if a search has been performed

  const fetchRecipes = async (searchTerm = '', searchByUser = false) => {
    try {
      const response = await fetch(`http://localhost:8080/search?search=${searchTerm}&searchByUser=${searchByUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const recipesData = await response.json();
        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
        setNoResultsFound(recipesData.length === 0);
      } else {
        console.error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (searchTerm, searchByUser) => {
    setSearchPerformed(true); // Set that a search has been performed here
    fetchRecipes(searchTerm, searchByUser);
  };

  return (
    <div>
      <div>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className='home-display'>
        <div className="recipe-list">
          {searchPerformed && filteredRecipes.length === 0 && (
            <div className="no-results">No results found</div>
          )}
          {filteredRecipes.map((recipe, index) => (
            <div key={index} className="recipe-item">
              <h3>{recipe.name}</h3>
              <p>Author: {recipe.createdBy ? recipe.createdBy.username : 'Unknown'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;