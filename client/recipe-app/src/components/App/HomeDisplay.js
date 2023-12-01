import React from 'react';
import CreatePage from './CreatePage';
import RecipeList from './RecipeList';

const HomeDisplay = () => {
  const recipes = []; // Your recipes data - replace with your actual recipe data

  return (
    <div>
      <RecipeList recipes={recipes} />
      <CreatePage position={recipes.length} />
    </div>
  );
};

export default HomeDisplay;