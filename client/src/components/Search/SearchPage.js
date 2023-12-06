import './SearchPage.css';
import '../Home/HomeDisplay.css';
import RecipeList from '../Home/RecipeList';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Make sure this path is correct

function SearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [expandRecipe, setExpandRecipe] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // State to track if a search has been performed

  const [update, setUpdate] = useState(0);

  const handleUpdate = () => {
    setUpdate(prev => prev + 1);
  };

  useEffect(() => {
    setExpandRecipe(Array(recipes.length).fill(false));
  }, [recipes]);

  
    const fetchRecipes = async (searchTerm = '', searchByUser = false, searchByTags = false) => {
      try {
        const response = await fetch(`http://localhost:8080/search?search=${searchTerm}&searchByUser=${searchByUser}&searchByTags=${searchByTags}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const recipesData = await response.json();
          setRecipes(recipesData);
          setFilteredRecipes(recipesData);
          setNoResultsFound(recipesData.length === 0);
        } else {
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };


  const handleSearch = (searchTerm, searchByUser, searchByTags) => {
    setSearchPerformed(true); // Set that a search has been performed here
    fetchRecipes(searchTerm, searchByUser, searchByTags);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className='search-display'>
        {searchPerformed && recipes.length === 0 && (
          <div className="no-results">No results found</div>
        )}
        <RecipeList recipes={filteredRecipes} 
          expandToggles={expandRecipe} 
          showAuthor={true} // Assuming you want to show authors on the Search page
          reRender={handleUpdate}
        />
      </div>
    </div>
  );
}

// return (
//   <div>
//     <div className="home-display">
//       <h1>Your Recipes:</h1>
//       <RecipeList recipes={recipesToShow} expandToggles={expandRecipe} showAuthor={false} />
//       <button onClick={handleClick} className="create-recipe-button">
//         <span>+ Create New Recipe</span>
//       </button>
//     </div>
//     <div className="footer-container">
//         <img className="png-iframe" src='Banner.png'></img>
//     </div>
//   </div>
// );
// };

export default SearchPage;