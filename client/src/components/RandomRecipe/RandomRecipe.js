// RandomRecipeDisplay.js
import './RandomRecipe.css'
import React, { useState } from 'react';
import RecipeList from '../Home/RecipeList'; // Update the import path as needed


const RandomRecipe = () => {
 const [randomRecipe, setRandomRecipe] = useState(null);
 const [expandRecipe, setExpandRecipe] = useState([true]); // Always expanded for the random recipe
 const fetchRandomRecipe = async () => {
   try {
     const response = await fetch('http://localhost:8080/random-recipe');
     if (response.ok) {
       const recipeData = await response.json();
       setRandomRecipe(recipeData);
     } else {
       console.error('Failed to fetch random recipe');
     }
   } catch (error) {
     console.error('Error:', error);
   } 
 };


 return (
   <div>
     <div className='surprise-header'>
       <h1>Out of ideas? Use the random recipe generator for a tasty surprise!</h1>
     </div>
     <div>
       <div className='random-container'>
         <button className='surprise-button' onClick={fetchRandomRecipe}>Surprise Me!</button>
       </div>
       {randomRecipe && (
         <div className='random-container'>
         <RecipeList recipes={randomRecipe} expandToggles={expandRecipe} showAuthor={true} reRender={setRandomRecipe} ownRecipe={false} />
         </div>
       )}
     </div>
   </div>
 );
};


export default RandomRecipe;