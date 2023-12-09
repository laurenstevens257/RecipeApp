import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import '../Home/HomeDisplay.css';
import Login from '../Login/Login';
import useToken from './useToken';
import AddRecipe from '../AddRecipe/AddRecipe'; 
import Toolbar from '../Toolbar/Toolbar';
import FlavoritesPage from '../Flavorites/FlavoritesPage'; 
import SearchPage from '../Search/SearchPage';     
import HomeDisplay from '../Home/HomeDisplay';
import CalculatorPage from '../Calculator/calculatorPage';
import GroceryList from '../GroceryList/groceryList';
import RandomRecipe from '../RandomRecipe/RandomRecipe';

function App() {
  const { token, setToken } = useToken();

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove the token
    setToken(null); // Reset the token state
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  
  return (
    <Router>
      {/* Toolbar is rendered here only once */}
      <Toolbar onLogout={handleLogout} />

      <Routes>
        <Route path="/flavorites" element={<FlavoritesPage removeToken={handleLogout}/>} />
        <Route path="/search" element={<SearchPage removeToken={handleLogout}/>} />
        <Route path="/add-recipe" element={<AddRecipe removeToken={handleLogout}/>} />
        <Route path="/" element={<HomeDisplay removeToken={handleLogout}/>} /> 
        <Route path="/calculatorPage" element={<CalculatorPage />} />
        <Route path="/groceryList" element={<GroceryList removeToken={handleLogout}/>} />
        <Route path="/random-recipe" element={<RandomRecipe removeToken={handleLogout}/>} />
      </Routes>
    </Router>
  );
}
export default App;