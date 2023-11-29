import React, { useEffect, useState } from 'react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes'); // Replace with your API endpoint
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

  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item">
          {recipe.name} {/* Assuming recipe object has a 'name' property */}
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
