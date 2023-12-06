// FlavoritesPage.js

import React, { useState, useEffect } from 'react';
import RecipeList from '../Home/RecipeList'; // Adjust the path as needed

const FlavoritesPage = () => {
    const [flavoredRecipes, setFlavoredRecipes] = useState([]);
    const [expandToggles, setExpandToggles] = useState([]);

    const [update, setUpdate] = useState(0);

    const handleUpdate = () => {
      setUpdate(prev => prev + 1);
    };

    console.log('flavorites');

    useEffect(() => {
        const fetchFlavoredRecipes = async () => {
            const token = sessionStorage.getItem('token'); // Fetch the authentication token

            try {
                const response = await fetch('http://localhost:8080/user/flavorites', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const recipesData = await response.json();
                    setFlavoredRecipes(recipesData);
                    setExpandToggles(Array(recipesData.length).fill(false)); // Initialize toggles for expanding recipe details
                } else {
                    console.error('Failed to fetch flavored recipes');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchFlavoredRecipes();
        console.log('recipes: ', flavoredRecipes)
    }, [update]);

    // Define handlers for RecipeList component if needed

    return (
        <div>
            <h1>Your Flavored Recipes</h1>
            <RecipeList 
                recipes={flavoredRecipes} 
                expandToggles={expandToggles}
                showAuthor={true} // Assuming you want to show authors on this page
                reRender={handleUpdate}
            />
        </div>
    );
};

export default FlavoritesPage;
