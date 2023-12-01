import RecipeList from './RecipeList';
import './HomeDisplay.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeDisplay = () => {
  const recipes = [];

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/add-recipe'); // Navigate to /add-recipe route
  };

  return (
    <div>
      <RecipeList recipes={recipes} />
        <button onClick={handleClick}>
          <span>+ Create New Recipe</span>
        </button>
    </div>
  );
};

export default HomeDisplay;