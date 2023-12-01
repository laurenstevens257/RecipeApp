import RecipeList from './RecipeList';
import './HomeDisplay.css';
import React, { useState } from 'react';

const HomeDisplay = () => {
  const recipes = [];

  const [featureAvailable, setFeatureAvailable] = useState(true);

  const handleClick = () => {
    setFeatureAvailable(false);
  };

  return (
    <div>
      <RecipeList recipes={recipes} />
      {featureAvailable ? (
        <button onClick={handleClick}>
          <span>+ Create New Recipe</span>
        </button>
      ) : (
        <p>Feature coming soon</p>
      )}
    </div>
  );
};

export default HomeDisplay;