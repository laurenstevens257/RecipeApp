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
    <div className="home-display">
      <RecipeList />
      <button onClick={handleClick} className="create-recipe-button">
        <span>+ Create New Recipe</span>
      </button>
    </div>
  );
};

export default HomeDisplay;