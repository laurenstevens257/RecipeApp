import React, { useState } from 'react';

function AddRecipe({ onRecipeAdded }) { // Changed from onAdd to onRecipeAdded
  const [recipeName, setRecipeName] = useState('');

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
        console.log('Recipe added successfully');
      } else {
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="Enter recipe name"
      />
      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default AddRecipe;