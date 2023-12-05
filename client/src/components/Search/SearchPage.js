import './SearchPage.css';
import '../Home/HomeDisplay.css';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Make sure this path is correct

function SearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm /*= ''*/, searchByUser /*= false*/) => {
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
      } else {
        console.error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (searchTerm, searchByUser) => {
    fetchRecipes(searchTerm, searchByUser);
  };

  return (
    <div>
      <div>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div class='home-display'>
        <div className="recipe-list">
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

