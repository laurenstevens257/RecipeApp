import RecipeList from './RecipeList';
import './HomeDisplay.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeDisplay = () => {

  const [recipesToShow, setRecipesToShow] = useState([]);
  const [expandRecipe, setExpandRecipe] = useState([]);

  const [update, setUpdate] = useState(0);

  const handleUpdate = () => {
    setUpdate(prev => prev + 1);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/add-recipe'); // Navigate to /add-recipe route
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      
      const token = sessionStorage.getItem('token'); // Fetch the authentication token

      try {
        const response = await fetch('http://localhost:8080/home', {
          method: 'GET', // Setting the request method to GET
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const recipesData = await response.json();
          setRecipesToShow(recipesData);
        } else {
          // Handle errors
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchRecipes();
  }, [update]);


  useEffect(() => {
    setExpandRecipe(Array(recipesToShow.length).fill(false));
  }, [recipesToShow]);

  console.log('recipesToShow: ', recipesToShow);
  
  return (
    <div>
      <div className="home-display">
        <h1>Your Recipes:</h1>
        <RecipeList recipes={recipesToShow} expandToggles={expandRecipe} showAuthor={false} reRender={handleUpdate} />
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