import React, { useState } from 'react';

function AddRecipe({ onAdd }) {
  const [recipeName, setRecipeName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(recipeName);
    setRecipeName(''); // Reset input field after submission
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
