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

  const addRecipe = (newRecipe) => {
    const recipesCopy = [...recipes, newRecipe];
    setRecipes(recipesCopy);
  }

  if (!token) {
    return <Login setToken={setToken} />;
  }
//  we will eventually have a route path for edit-page, liked-recipes, search, login
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/add-recipe" element={<AddRecipe onRecipeAdded={addRecipe} />} />
          <Route path="/home" element={<RecipeList recipes={recipes} />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;