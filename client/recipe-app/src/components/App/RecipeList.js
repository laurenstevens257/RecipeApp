import React from 'react';

function RecipeList({ recipes }) {
  return (
    <div>
      {recipes.map((recipe, index) => (
        <div key={index}>{recipe}</div>
      ))}
    </div>
  );
}

export default RecipeList;