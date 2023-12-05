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
      <div className="home-display">
        <h1>Your Recipes:</h1>
        <RecipeList />
        <button onClick={handleClick} className="create-recipe-button">
          <span>+ Create New Recipe</span>
        </button>
      </div>
      <div className="footer-container">
          <img className="png-iframe" src='Banner.png'></img>
      </div>
    </div>
  );
};

export default HomeDisplay;