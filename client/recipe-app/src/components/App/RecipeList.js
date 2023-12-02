// RecipeList.js
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Make sure this path is correct

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm = '') => {
    try {
      const response = await fetch(`http://localhost:8080/recipe-list?search=${searchTerm}`);
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

  const handleSearch = (searchTerm) => {
    fetchRecipes(searchTerm);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="recipe-list">
        {filteredRecipes.map((recipe, index) => (
          <div key={index} className="recipe-item">
            <h3>{recipe.name}</h3>
            <p>Author: {recipe.createdBy ? recipe.createdBy.username : 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
