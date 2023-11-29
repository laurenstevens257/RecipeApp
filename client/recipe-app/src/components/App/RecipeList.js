import React from 'react';

function RecipeList({ recipes }) {
  // Apply the 'recipe-list' and 'recipe-item' CSS classes
  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item">
          {recipe}
        </div>
      ))}
    </div>
  );
}

export default RecipeList;