import RecipeList from './RecipeList';
import './HomeDisplay.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeDisplay = ({ recipes }) => {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/add-recipe'); // Navigate to /add-recipe route
  };

  return (
    <div>
        <button onClick={handleClick}>
          <span>+ Create New Recipe</span>
        </button>
        <RecipeList />
    </div>
  );
};

export default HomeDisplay;