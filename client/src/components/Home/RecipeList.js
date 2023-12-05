import { useState, useEffect } from 'react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

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

  //IMPORTANT - TO CHECK 
  //check our div names
  //do we even need this css stuff?
  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item">
          <h3>{recipe.name}</h3>
          {/* Check if createdBy exists and has a username */}
          {/*<p>Author: {recipe.createdBy ? recipe.createdBy.username : 'Unknown'}</p> */     /* commented out to not display authors for user's recipes*/}
          {/* Uncomment and use if ingredients and instructions are part of your recipe model */}
          {/* <ul>
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
          <p>{recipe.instructions}</p> */}
        </div>
      ))}
    </div>
  );
}

export default RecipeList;