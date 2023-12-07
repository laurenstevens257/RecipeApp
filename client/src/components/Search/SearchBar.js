import React, { useState } from 'react';
import './SearchPage.css';


function SearchBar({ onSearch }) {
 const [searchTerm, setSearchTerm] = useState('');
 const [searchByUser, setSearchByUser] = useState(false);
 const [searchByTags, setSearchByTags] = useState(false); 


 const handleSearch = () => {
   if(searchTerm.startsWith('#')){
     const newTerm = searchTerm.substring(1);
     onSearch(newTerm, searchByUser, searchByTags);
   } else{
     onSearch(searchTerm, searchByUser, searchByTags); // Pass both searchByUser and searchByTags to onSearch
   }
 };


 const handleKeyPress = (event) => {
   if (event.key === 'Enter') {
     handleSearch();
   }
 };


 const handleUserCheckbox = () => {
   setSearchByUser(!searchByUser);
   if (searchByTags) setSearchByTags(false); // Uncheck searchByTags if it's checked
 };


 const handleTagCheckbox = () => {
   setSearchByTags(!searchByTags);
   if (searchByUser) setSearchByUser(false); // Uncheck searchByUser if it's checked
 };


 return (
   <div>
     <div className='search-container'>
       <input
         className='search-input'
         type="text"
         placeholder="Search recipes..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         onKeyDown={handleKeyPress} // Handle Enter key press
       />
       <button className='search-button' onClick={handleSearch}>
         Search
       </button>
     </div>
     <div className='filter-container'>
       <p>Filter your search by:</p>
     </div>
     <div className='search-container'>
       <div className='search-user'>
         <input
           type="checkbox"
           checked={searchByUser}
           onChange={handleUserCheckbox}
         />
         <div className='filter-label'>
           <label>User</label>
         </div>
       </div>
       <div className='search-user'>
         <input
           type="checkbox"
           checked={searchByTags}
           onChange={handleTagCheckbox}
         />
         <div className='filter-label'>
           <label>Tags</label>
         </div>
       </div>
     </div>
   </div>
 );
}


export default SearchBar;
