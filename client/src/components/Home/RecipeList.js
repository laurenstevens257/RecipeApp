import { useState, useEffect } from 'react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null); // State for expanded recipe
  const [expandRecipe, setExpandRecipe] = useState([]);

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
          setRecipes(recipesData);
        } else {
          // Handle errors
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    setExpandRecipe(Array(recipes.length).fill(false));
  }, [recipes]);

  const handleRecipeClick = (id, index) => {
    // Toggle expanded recipe view
    //setExpandedRecipeId(expandedRecipeId === id ? null : id);
    toggleExpandRecipe(index);
  };

  const toggleExpandRecipe = (index) => {
    const expandRecipeCopy = expandRecipe.slice();
    expandRecipeCopy[index] = !expandRecipeCopy[index];
    setExpandRecipe(expandRecipeCopy);
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item" onClick={() => handleRecipeClick(recipe._id, index)}>
          <h3>{recipe.name}</h3>
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