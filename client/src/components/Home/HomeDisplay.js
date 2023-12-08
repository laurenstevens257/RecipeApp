import RecipeList from './RecipeList';
import './HomeDisplay.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const HomeDisplay = ({removeToken}) => {


 const [recipesToShow, setRecipesToShow] = useState([]);
 const [expandRecipe, setExpandRecipe] = useState([]);


 const navigate = useNavigate();
 const handleClick = () => {
   navigate('/add-recipe'); // Navigate to /add-recipe route
 };


 useEffect(() => {
   const fetchRecipes = async () => {
    
     const token = sessionStorage.getItem('token'); // Fetch the authentication token

    console.log('fetched');

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
         if(response.status === 400){
           console.log('should log out');
           removeToken();
         }
       }
     } catch (error) {
       console.error('Error:', error);
     }
   };


   fetchRecipes();
 }, []);




 useEffect(() => {
   setExpandRecipe(Array(recipesToShow.length).fill(false));
 }, [recipesToShow]);

 console.log('home');


  return (
   <div>
     <div className="home-display">
       <div className='home-header'>
         <h1>Your Recipes:</h1>
         <button onClick={handleClick} className="create-recipe-button">
         <span>+ Create New Recipe</span>
         </button>
       </div>
       <RecipeList recipes={recipesToShow} expandToggles={expandRecipe} showAuthor={false} reRender={setRecipesToShow} ownRecipe={true} removeToken={removeToken} />
     </div>
     <div className="footer-container">
         <img className="png-iframe" src='Banner.png'></img>
     </div>
   </div>
 );
};


export default HomeDisplay;
