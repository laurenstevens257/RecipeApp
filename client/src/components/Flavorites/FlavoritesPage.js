// FlavoritesPage.js
import './FlavoritesPage.css';
import React, { useState, useEffect } from 'react';
import RecipeList from '../Home/RecipeList'; // Adjust the path as needed

const FlavoritesPage = () => {
    const [flavoredRecipes, setFlavoredRecipes] = useState([]);
    const [expandToggles, setExpandToggles] = useState([]);

    console.log('flavorites');

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

    // }, []);

    return (
        <div className='flavorites-container'>
            <div className='flav-header'>
                <h1>Your FLAVORite Recipes:</h1>
            </div>
            <RecipeList 
                recipes={flavoredRecipes} 
                expandToggles={expandToggles}
                showAuthor={true} // Assuming you want to show authors on this page
                reRender={setFlavoredRecipes}
                ownRecipe={false}
            />
        </div>
    );
};

export default FlavoritesPage;
