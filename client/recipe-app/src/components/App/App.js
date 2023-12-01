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
   //this is what we had before
    //<div className="wrapper">
      //<h1>Application</h1>
     /* <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/add-recipe" element={<AddRecipe onRecipeAdded={addRecipe} />} />
          <Route path="/home" element={<RecipeList recipes={recipes} />} />
          
        </Routes>
      </BrowserRouter>
    </div>*/

    //NOTE: rn theres a create page with a plus sign, but what we i think we want instead is in the home page there is instead like a plus there and if you click the plus then it swtiches pages to add-recipe
    //Also note that we want recipe-list or atleast its functionality to probably be in home right
    //is there a way to pipe directly from login user to /home
    <Router>
      <Toolbar />
      <Routes>
        <Route path="/favorites" element={<FlavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-recipe" element={<AddRecipe onRecipeAdded={addRecipe} />} />
        <Route path="/home" element={<HomeDisplay recipes={recipes} />} />
      </Routes>
    </Router>
  );
}

export default App;