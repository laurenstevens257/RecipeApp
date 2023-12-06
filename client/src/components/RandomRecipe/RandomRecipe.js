// RandomRecipeDisplay.js
import React, { useState } from 'react';
import RecipeList from '../Home/RecipeList'; // Update the import path as needed

const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [expandRecipe, setExpandRecipe] = useState([true]); // Always expanded for the random recipe

  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch('http://localhost:8080/random-recipe');
      if (response.ok) {
        const recipeData = await response.json();
        setRandomRecipe([recipeData]); // Set an array with a single recipe
      } else {
        console.error('Failed to fetch random recipe');
      }
    } catch (error) {
      console.error('Error:', error);
    }  
  };

  return (
    <div>
      <button onClick={fetchRandomRecipe}>Show Random Recipe</button>
      {randomRecipe && (
        <RecipeList recipes={randomRecipe} expandToggles={expandRecipe} showAuthor={true} />
      )}
    </div>
  );
};

export default RandomRecipe;