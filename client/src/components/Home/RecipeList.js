import { useState, useEffect } from 'react';
import './RecipeList.css';


function RecipeList({recipes, expandToggles, showAuthor, reRender, ownRecipe}) {


 const [expandRecipe, setExpandRecipe] = useState(expandToggles);

 const handleRecipeClick = (id, index) => {
   // Toggle expanded recipe view
   toggleExpandRecipe(index);
 };


 const toggleExpandRecipe = (index) => {
   const expandRecipeCopy = expandRecipe.slice();
   expandRecipeCopy[index] = !expandRecipeCopy[index];
   setExpandRecipe(expandRecipeCopy);
 };


 const handleVClick = (event, index) => {
   event.stopPropagation(); // Prevent click event from reaching the recipe item handler
   toggleExpandRecipe(index);
 };


 const handleDeleteRecipe = async (event, recipeId) => {
  event.stopPropagation();
  const userConfirmed = window.confirm("Are you sure you want to delete this recipe? This action is irreversible.");
  if (userConfirmed) {
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/delete-recipe/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        reRender(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
      } else {
        console.error('Failed to delete the recipe');
      }
    } catch (error) {
      console.error('Error:',error);
    }
  }
};


 const flaveRecipe = async (event, recipe, index) => {
   event.stopPropagation();


   const token = sessionStorage.getItem('token'); // Fetch the authentication token


   try {
     const response = await fetch('http://localhost:8080/flave-recipe', {
       method: 'POST', // Setting the request method to GET
       headers: {
         'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         recipe
       }),
     });


     if (response.ok) {
         //make button turn red or something
         const recipesData = await response.json();
         const flavedRecipe = recipesData[0];
         const updatedRecipes = [...recipes];
         updatedRecipes[index] = flavedRecipe;


         reRender(updatedRecipes);
     } else {
       // Handle errors
       console.error('Failed to flave recipe');
     }
   } catch (error) {
     console.error('Error:', error);
   }
 };


 return (
   <div className="recipe-list">
     {recipes.map((recipe, index) => (
       <div
         key={index}
         className={`recipe-item ${expandRecipe[index] ? 'expanded' : ''}`}
         onClick={() => handleRecipeClick(recipe._id, index)}
       >
       <div className='closedrecipe-container'>
         <h3>{recipe.name}</h3>
         {showAuthor && (
           <p>Author: {recipe.createdBy ? recipe.createdBy.username : 'Unknown'}</p>
         )}
         <div className="button-container">
           <div className="expand-icon" onClick={(event) => handleVClick(event, index)}>
             <img src="./UpArrow.png" className={expandRecipe[index] ? 'flipped' : ''} />
           </div>
           <div className="like-button">
            <div className='flav-icon' onClick={(event) => flaveRecipe(event, recipe, index)}>
              <img src={recipe.likedByUser ? './PurpleHeart.png' : './WhiteHeart.png'} />
            </div>
           </div>
         </div>
         <div className='flave-count'>
           <p>{recipe.flavedByCount} Flavorites</p>
         </div>
         </div>
         {expandRecipe[index] && (
           <div className="recipe-details">
             <p>Prep Time: {recipe.prepTime} minutes</p>
             <p>Cook Time: {recipe.cookTime} minutes</p>
             <p>Ingredients:</p>
             <ul>
               {(recipe.ingredients || []).map((ingredient, idx) => (
                 <li key={idx}>
                   {ingredient.name} - {ingredient.quantity} {ingredient.units}
                 </li>
               ))}
             </ul>
             <p>Instructions: </p>
             <p>{recipe.instructions}</p>
             <div className="recipe-tags">
               {recipe.tags.map((tag, idx) => (
                 <span key={idx} className="tag-item">#{tag}</span> // Use `span` with `className` "tag-item"
               ))}
             </div>
           </div>
         )}
       </div>
     ))}
   </div>
 );
}

export default RecipeList;