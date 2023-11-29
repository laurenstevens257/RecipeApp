//this would replace AddRecipe.js. It might just be another version of it. not sure it works or not yet, need to test

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeForm = () => {
  const [recipeName, setRecipeName] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes when the component mounts
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the recipe to the server
      await axios.post('http://localhost:8080/recipe', { name: recipeName });
      
      // Fetch updated recipes after submission
      fetchRecipes();

      // Clear the input field
      setRecipeName('');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <div>
      <h2>Recipe Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Recipe Name:
          <input type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
        </label>
        <button type="submit">Add Recipe</button>
      </form>

      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeForm;
