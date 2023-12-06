import React, { useState } from 'react';
import './AddRecipe.css';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const navigate = useNavigate();

  const [ingredientInput, setIngredientInput] = useState('');
  
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [ingredientQtyInput, setIngredientQtyInput] = useState('');

  const [recipeName, setRecipeName] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [instructions, setInstructions] = useState('');

  const [formError, setFormError] = useState('');

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  //for removing 
  const handleRemoveIngredient = index => {
    setIngredientsList(prevIngredients => prevIngredients.filter((_, i) => i !== index));
  };
  const handleRemoveTag = index => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  };


  const handleAddIngredient = () => {
    if (ingredientInput !== '' && ingredientUnit !== '' && ingredientQtyInput !== '') {
      const newIngredient = { name: ingredientInput, quantity: ingredientQtyInput, units: ingredientUnit };
      setIngredientsList(prevIngredients => [...prevIngredients, newIngredient]);

      // Clear input fields after adding an ingredient
      setIngredientInput('');
      setIngredientUnit('');
      setIngredientQtyInput('');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags(prevTags => [...prevTags, tagInput]);
      setTagInput(''); // Clear the tag input field
    }
  };

  // Front-end function to send recipe data to the server
  async function sendRecipe() {
    try {
      const token = sessionStorage.getItem('token'); // Fetch the authentication token

      const response = await fetch('http://localhost:8080/add-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: recipeName,
          cookTime,
          prepTime,
          ingredients: ingredientsList,
          instructions,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe'); // Throw an error for non-200 status codes
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error sending recipe data: ' + error.message);
    }
  }
//somewhere in here there should also throw and error that says 'please fill out all the fields if any property is empty'
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName.trim() || !prepTime.trim() || !cookTime.trim() || !instructions.trim()) {
      setFormError('Please fill out all required fields');
      return;
    }
    try {
      const response = await sendRecipe();

      if (response.success) {
        setRecipeName('');
        setPrepTime('');
        setCookTime('');
        setInstructions('');
        setIngredientsList([]);
        setTags('');
        navigate('/');
        console.error('kinda worked??');
      } else {
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h1 className='header-text'>New Recipe</h1>

      <form onSubmit={handleSubmit}>
      <div className='label-container'>
          <h2 className='label-text'>Recipe Name</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Enter recipe name"
            />
          </div>
        </div>
        <div className='label-container'>
          <h2 className='label-text'>Prep Time</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
            <input
              type="text"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="Enter prep time in mins"
            />
          </div>
        </div>
        <div className='label-container'>
          <h2 className='label-text'>Cook Time</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
            <input
              type="text"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="Enter cook time in mins"
            />
          </div>
        </div>


        <div className='label-container'>
          <h2 className='label-text'>Ingredients</h2>
          {/* Display added ingredients */}
          <div className="added-ingredients">
            {ingredientsList.map((ingredient, index) => (
              <p key={index} onClick={() => handleRemoveIngredient(index)} className="removable-item">
                {ingredient.name} - {ingredient.quantity} {ingredient.units}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="Enter an ingredient"
          />
          <input
            type="text"
            value={ingredientQtyInput}
            onChange={(e) => setIngredientQtyInput(e.target.value)}
            placeholder="Enter its quantity"
          />
          <select
            value={ingredientUnit}
            onChange={(e) => setIngredientUnit(e.target.value)}
            className='unit-dropdown'
          >
           <option value="">Select a unit</option>
              <option value=" "> </option>
              <option value="cup(s)">Cups</option>
              <option value="tablespoon(s)">Tablespoons</option>
              <option value="teaspoon(s)">Teaspoons</option>
              <option value="ounce(s)">Ounces</option>
              <option value="quart(s)">Quarts</option>
              <option value="liter(s)">Liters</option>
              <option value="gram(s)">Grams</option>
              <option value="pound(s)">Pounds</option>

          </select>
          <button type="button" onClick={handleAddIngredient} className="add-ingredient-button">+ Add Ingredient</button>
        </div>
        <div className='label-container'>
          <h2 className='label-text'>Instructions</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter cooking instructions"
            />
          </div>
        </div>
        <div className='label-container'>
          <h2 className='label-text'>Tags</h2>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Enter tags to help people discover your recipe (eg. #glutenfree, #vegan, #italian)"
          />
          <button type="button" onClick={handleAddTag} className="add-ingredient-button">+ Add Tag</button>
          {/* Display added tags */}
          <div className="added-tags">
            {tags.map((tag, index) => (
              <p key={index} onClick={() => handleRemoveTag(index)} className="removable-item">
                {tag}
              </p>
            ))}
          </div>
        </div>

        <button type="submit" className="add-button">+ Add Recipe</button>
      </form>

      <div className='add-error'>
        {formError && <p>{formError}</p>}
      </div>
    </div>
  );
}

export default AddRecipe;