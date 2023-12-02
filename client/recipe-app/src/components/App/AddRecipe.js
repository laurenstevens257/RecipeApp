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

  // Front-end function to send recipe data to the server
  async function sendRecipe() {
    try {
      const token = sessionStorage.getItem('token'); // Fetch the authentication token
      //commented out so token isn't visible in console log
      //keyword: MAKE-TOKEN-VISIBLE
      //console.error(token);
      const response = await fetch('http://localhost:8080/add-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: recipeName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe'); // Throw an error for non-200 status codes
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error sending recipe data: ' + error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRecipe();

      if (response.success) {
        setRecipeName(''); // Reset input field after submission
        onRecipeAdded(); // Notify parent to update the recipe list
        navigate('/home');
        console.error('kinda worked??');
      } else {
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error.message);
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