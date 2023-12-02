import React, { useState } from 'react';
import './AddRecipe.css';
import { useNavigate } from 'react-router-dom';

function AddRecipe({ onRecipeAdded }) { // Changed from onAdd to onRecipeAdded
  const [recipeName, setRecipeName] = useState('');
  const navigate = useNavigate();
  const[ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');

  const handleAddIngredient = () => {
    if (ingredientInput) {
      setIngredients(prevIngredients => [...prevIngredients, ingredientInput]);
      setIngredientInput(''); // Clear the input field
    }
  };

  async function SendRecipe(){

        // Include ingredients in the data sent to the server
        const recipeData = {
          name: recipeName,
          ingredients: ingredients,
          // ... include other recipe data ...
        };
    return (fetch('http://localhost:8080/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: recipeName }),
    })
    .then(data => data.json())
  )}

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SendRecipe();

      if (response.success) {
        setRecipeName(''); // Reset input field after submission
        onRecipeAdded(); // Notify parent to update the recipe list
        navigate('/home');
        console.error('kinda worked??');
      } else {
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1 className='header-text'>New Recipe</h1>
      <h2 className='title-text'>Recipe Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Enter recipe name"
          className='title-input'
        />

        <input
          type="text"
          placeholder="Enter prep time in mins"
          className='prep-input'
        />
        <input
          type="text"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          placeholder="Enter an ingredient"
          className='ingredient-input'
        />
        <button type="button" onClick={handleAddIngredient} className="add-ingredient-button">+</button>
        
        
        <input
          type="text"
          placeholder="Enter cook time in mins"
          className='cook-input'
        />
        <input
          type="text"
          placeholder="Enter cooking instructions..."
          className='instructions-input'
        />
        <button type="submit" className="add-button">Add Recipe</button>
      </form>
   </div>
    
  );
}

export default AddRecipe;
