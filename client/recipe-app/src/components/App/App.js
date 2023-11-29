import React, { useState } from 'react';
import './App.css';
import Login from '../Login/Login';
import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import AddRecipe from './AddRecipe/AddRecipe'; // Adjust the path as needed
import RecipeList from './RecipeList/RecipeList'; // Adjust the path as needed
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { token, setToken } = useToken();
  const [recipes, setRecipes] = useState([]); // State to store recipes

  const handleAddRecipe = (recipeName) => {
    setRecipes([recipeName, ...recipes]); // Adds new recipe to the top of the list
  };

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/add-recipe" element={<AddRecipe onAdd={handleAddRecipe} />} />
          <Route path="/recipes" element={<RecipeList recipes={recipes} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;