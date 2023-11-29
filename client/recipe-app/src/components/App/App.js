import React, { useState, useEffect } from 'react';
import './App.css';
import Login from '../Login/Login';
import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { token, setToken } = useToken();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (response.ok) {
          const recipesData = await response.json();
          setRecipes(recipesData);
        } else {
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

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
