import React, { useState, useEffect } from 'react';
import './App.css';
import Login from '../Login/Login';
import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import AddRecipe from './AddRecipe'; // Adjust the import path as needed
import RecipeList from './RecipeList'; // Adjust the import path as needed
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { token, setToken } = useToken();
  const [recipes, setRecipes] = useState([]);

  // Define fetchRecipes outside of useEffect so it can be called elsewhere
  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const recipesData = await response.json();
        console.log('Recipes fetched:', recipesData); // Log to see what's fetched
        setRecipes(recipesData);
      } else {
        console.error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    await fetchRecipes(); // Re-fetch recipes after adding
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/add-recipe" element={<AddRecipe onRecipeAdded={handleAddRecipe} />} />
          <Route path="/recipes" element={<RecipeList recipes={recipes} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;