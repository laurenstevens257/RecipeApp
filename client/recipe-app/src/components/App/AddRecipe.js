import React, { useState } from 'react';

function AddRecipe({ onRecipeAdded }) { // Changed from onAdd to onRecipeAdded
  const [recipeName, setRecipeName] = useState('');
  
  async function SendRecipe(){
    return (fetch('http://localhost:8080/add-recipe', {
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
        console.error('kinda worked??');
      } else {
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
