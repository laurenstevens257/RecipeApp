import './SearchPage.css';
import '../Home/HomeDisplay.css';
import RecipeList from '../Home/RecipeList';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';


function SearchPage({removeToken}) {
 const [expandRecipe, setExpandRecipe] = useState([]);
 const [filteredRecipes, setFilteredRecipes] = useState([]);
 const [noResultsFound, setNoResultsFound] = useState(false);
 const [searchPerformed, setSearchPerformed] = useState(false);
 const [isFetching, setIsFetching] = useState(false);

 const [lastSearchParams, setLastSearchParams] = useState({
  searchTerm: '',
  searchByUser: false,
  searchByTags: false,
});

  console.log('in search page');

  useEffect(() => {
    if (searchPerformed) {
      fetchRecipes(lastSearchParams.searchTerm, lastSearchParams.searchByUser, lastSearchParams.searchByTags);
    }
  }, []);

 useEffect(() => {
   setExpandRecipe(Array(filteredRecipes.length).fill(false));
 }, []);


 const fetchRecipes = async (searchTerm = '', searchByUser = false, searchByTags = false) => {
   setIsFetching(true);
   try {
    const token = sessionStorage.getItem('token'); // Fetch the authentication token

    const response = await fetch(`http://localhost:8080/search?search=${searchTerm}&searchByUser=${searchByUser}&searchByTags=${searchByTags}`, {
       method: 'GET',
       headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
       },
    });


     if (response.ok) {
       const recipesData = await response.json();
       setFilteredRecipes(recipesData);
       setNoResultsFound(recipesData.length === 0);
     } else {
       console.error('Failed to fetch recipes');
       if(response.status === 400){
        removeToken();
      }
     }
   } catch (error) {
     console.error('Error:', error);
   }
   setIsFetching(false);
 };


 const handleSearch = (searchTerm, searchByUser, searchByTags) => {
   setSearchPerformed(true);
    setLastSearchParams({ searchTerm, searchByUser, searchByTags });
   fetchRecipes(searchTerm, searchByUser, searchByTags);
 };


 return (
   <div>
     <SearchBar onSearch={handleSearch} />
     <div className='search-display'>
       {!isFetching && searchPerformed && (
         <>
           {noResultsFound ? (
             <div className="no-results">No results found</div>
           ) : (
             <div className="search-results">Found {filteredRecipes.length} results</div>
           )}
         </>
       )}
       <div className='search-recipes-container'>
         <RecipeList recipes={filteredRecipes}
           expandToggles={expandRecipe}
           showAuthor={true}
           reRender={setFilteredRecipes}
           ownRecipe={false}
           removeToken={removeToken}
         />
       </div>
     </div>
   </div>
 );
}


export default SearchPage;
