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
//import CalculatorPage from './calculatorPage';
import CalculatorPage from './calculatorPage';

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (

    
    //is there a way to pipe directly from login user to /home
    <Router>
      <Toolbar />
      <Routes>
        <Route path="/flavorites" element={<FlavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/home" element={<HomeDisplay />} /> 
        <Route path="/calculatorPage" element={<CalculatorPage />} />
      </Routes>
    </Router>
  );
}
export default App;