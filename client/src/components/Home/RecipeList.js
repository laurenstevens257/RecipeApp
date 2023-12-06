import { useState, useEffect } from 'react';

function RecipeList({recipes, expandToggles, showAuthor}) {

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

  const handleButtonAction = (event, recipe) => {
    event.stopPropagation(); // Prevent click event from reaching the recipe item handler
    // Perform the button-specific action here
    flaveRecipe(recipe);
    // Add any other logic for the button action here

  };

  const flaveRecipe = async (recipe) => {
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
          console.log('liked recipe: ', recipe);
      } else {
        // Handle errors
        console.error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item" onClick={() => handleRecipeClick(recipe._id, index)}>
          <h3>{recipe.name}</h3>
          {showAuthor &&(
            <p>Author: {recipe.createdBy ? recipe.createdBy.username : 'Unknown'}</p>
          )}
          <div className="like-button">
            <button onClick={(event) => handleButtonAction(event, recipe)}>
              Flave
            </button>
          </div>
          {expandRecipe[index] && (
            <div className="recipe-details">
              <p>Prep Time: {recipe.prepTime} minutes</p>
              <p>Cook Time: {recipe.cookTime} minutes</p>
              <p>Ingredients:</p>
              <ul>
                {(recipe.ingredients || []).map((ingredient, idx) => (
                  <li key={idx}>{ingredient.name} - {ingredient.quantity} {ingredient.units}</li>
                ))}
              </ul>
              <p>{recipe.instructions}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecipeList;