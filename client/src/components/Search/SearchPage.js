import './SearchPage.css';
import '../Home/HomeDisplay.css';
import RecipeList from '../Home/RecipeList';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; 

function SearchPage() {
  const [expandRecipe, setExpandRecipe] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); 
  const [isFetching, setIsFetching] = useState(false);

  const [update, setUpdate] = useState(0);

  const handleUpdate = () => {
    setUpdate(prev => prev + 1);
  };

  useEffect(() => {
    setExpandRecipe(Array(filteredRecipes.length).fill(false));
  }, [filteredRecipes]);

  
  const fetchRecipes = async (searchTerm = '', searchByUser = false, searchByTags = false) => {
    setIsFetching(true); // Set isFetching to true when fetch starts
    try {
      const response = await fetch(`http://localhost:8080/search?search=${searchTerm}&searchByUser=${searchByUser}&searchByTags=${searchByTags}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const recipesData = await response.json();
        setFilteredRecipes(recipesData);
        setNoResultsFound(recipesData.length === 0);
      } else {
        console.error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsFetching(false); // Set isFetching to false when fetch completes
  };
  


  const handleSearch = (searchTerm, searchByUser, searchByTags) => {
    setSearchPerformed(true); // Set that a search has been performed here
    fetchRecipes(searchTerm, searchByUser, searchByTags);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className='search-display'>
        {!isFetching && searchPerformed && noResultsFound && (
          <div className="no-results">No results found</div>
        )}
        <RecipeList recipes={filteredRecipes} 
          expandToggles={expandRecipe} 
          showAuthor={true}
          reRender={handleUpdate}
        />
      </div>
    </div>
  );
}

export default SearchPage;