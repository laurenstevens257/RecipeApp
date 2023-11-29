import React, { useState } from 'react';

function AddRecipe({ onAdd }) {
  const [recipeName, setRecipeName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/recipes', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: recipeName }),
      });
      if (response.ok) {
        const addedRecipe = await response.json();
        onAdd(addedRecipe); // Update parent state or re-fetch recipes
        setRecipeName(''); // Reset input field after submission
      } else {
        // Handle errors
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error);
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