import React, { useState, useEffect } from 'react';
import './App.css';
import './HomeDisplay.css';
import Login from '../Login/Login';
import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import AddRecipe from './AddRecipe'; // Adjust the import path as needed
import RecipeList from './RecipeList'; // Adjust the import path as needed
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//check to see if any of these are redundant, as i just added them 
//import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Toolbar from './Toolbar';
import FlavoritesPage from './FlavoritesPage'; // Your component for Favorites
import SearchPage from './SearchPage';     // Your component for Search
import HomeDisplay from './HomeDisplay';

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

  return (

    //NOTE: want home page with a plus there and if you click the plus then it swtiches pages to add-recipe
    //is there a way to pipe directly from login user to /home
    <Router>
      <Toolbar />
      <Routes>
        <Route path="/flavorites" element={<FlavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-recipe" element={<AddRecipe onRecipeAdded={addRecipe} />} />
        <Route path="/home" element={<HomeDisplay />} /> 
        
      </Routes>
    </Router>
  );
}
// <Route path="/recipe-list" element={<RecipeList recipes={recipes}/>}/>
export default App;