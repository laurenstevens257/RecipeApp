import { useState, useEffect } from 'react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null); // State for expanded recipe

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

  const handleRecipeClick = (id) => {
    // Toggle expanded recipe view
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item" onClick={() => handleRecipeClick(recipe.id)}>
          <h3>{recipe.name}</h3>
          {expandedRecipeId === recipe.id && (
            <div className="recipe-details">
              <p>Prep Time: {recipe.prepTime} minutes</p>
              <p>Cook Time: {recipe.cookTime} minutes</p>
              <ul>
                {(recipe.ingredients || []).map((ingredient, idx) => (
                  <li key={idx}>{ingredient.name} - {ingredient.quantity}</li>
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