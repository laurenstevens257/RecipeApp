// RandomRecipeDisplay.js
import React, { useState } from 'react';
import RecipeList from '../Home/RecipeList'; // Update the import path as needed

const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [expandRecipe, setExpandRecipe] = useState([true]); // Always expanded for the random recipe
 
  const fetchRandomRecipe = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch('http://localhost:8080/random-recipe', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
      if (response.ok) {
        const recipeData = await response.json();
        setRandomRecipe(recipeData);
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
        <RecipeList recipes={randomRecipe} expandToggles={expandRecipe} showAuthor={true} reRender={setRandomRecipe} ownRecipe={false} />
      )}
    </div>
  );
};

export default RandomRecipe;