import React, { useState, useRef } from 'react';
import './AddRecipe.css';
import { useNavigate } from 'react-router-dom';

function AddRecipe({removeToken}) {
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
  const [cookTimeError, setCookTimeError] = useState('');
  const [prepTimeError, setPrepTimeError] = useState('');


  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('#');

  //refs for input elements
  const ingredientInputRef = useRef(null);
  const ingredientQtyInputRef = useRef(null);
  const ingredientUnitRef = useRef(null);

  const handleKeyPress = (e, field) => {
    console.log('Key pressed', e.key);
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form from submitting on Enter key
      switch (field) {
        case 'ingredients':
          console.log('in ingredients case');
          handleAddIngredient();
          break;
        case 'tags':
          handleAddTag();
          break;
        default:
          // Handle other cases or do nothing
          break;
      }
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredientsList((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index)
    );
  };
  const handleRemoveTag = index => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  };


  const handleAddIngredient = () => {

    if (isNaN(cookTime) || cookTime <= 0) {
      setCookTimeError('Cook time must be a positive number');
    } else {
      setCookTimeError(''); // Clear error if the input is valid
    }
    
    if (isNaN(prepTime) || prepTime <= 0) {
      setPrepTimeError('Prep time must be a positive number');
    } else {
      setPrepTimeError(''); // Clear error if the input is valid
    }

    if (ingredientInput != '' && ingredientUnit !== '' &&   ingredientQtyInput !== '') {
   
      const newIngredient = {
        name: ingredientInput,
        quantity: ingredientQtyInput,
        units: ingredientUnit,
      };
      setIngredientsList((prevIngredients) => [...prevIngredients, newIngredient]);

      setIngredientInput('');
      setIngredientUnit('');
      setIngredientQtyInput('');
    }
    else {
      if (ingredientInput === '') {
        ingredientInputRef.current.focus();
      } else if (ingredientQtyInput === '') {
        ingredientQtyInputRef.current.focus();
      } else if (ingredientUnit === '') {
        ingredientUnitRef.current.focus();
      }
    }
  };
  const handleAddTag = () => {
    if (tagInput.trim() !== '#') {
      const newTag = tagInput.slice(1);
      setTags(prevTags => [...prevTags, newTag]);
      setTagInput('#'); 
    }
  };


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
        if(response.status === 400){  //log user out
          removeToken();
        }
        throw new Error('Failed to add recipe');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error sending recipe data: ' + error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName.trim() || !prepTime.trim() || !cookTime.trim() || !instructions.trim()) {
      setFormError('Please fill out all required fields');
      return;
    }
    
    if (isNaN(cookTime) || cookTime <= 0) {
      setCookTimeError('Cook time must be a positive number');
    } else {
      setCookTimeError(''); // Clear error if the input is valid
    }

    if (isNaN(prepTime) || prepTime <= 0) {
      setPrepTimeError('Prep time must be a positive number');
    } else {
      setPrepTimeError(''); // Clear error if the input is valid
    }

    if(!cookTimeError.trim() || !prepTimeError.trim()){
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
        } else {
          console.error('Failed to add recipe');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
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
            {prepTimeError && <p className="error-message">{prepTimeError}</p>}
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
             {cookTimeError && <p className="error-message">{cookTimeError}</p>}
          </div>
        </div>


        <div className='label-container'>
          <h2 className='label-text'>Ingredients</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
          <div>
            {ingredientsList.map((ingredient, index) => (
              <p key={index} onClick={() => handleRemoveIngredient(index)} className="removable-item">
                {ingredient.name} - {ingredient.quantity} {ingredient.units}
              </p>
            ))}
          </div>
          <input
            ref={ingredientInputRef}
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'ingredients')}
            placeholder="Enter an ingredient"
          />
          <input
            ref={ingredientQtyInputRef}
            type="text"
            value={ingredientQtyInput}
            onChange={(e) => setIngredientQtyInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'ingredients')}
            placeholder="Enter its quantity"
          />
          <select
            ref={ingredientUnitRef}
            value={ingredientUnit}
            onChange={(e) => setIngredientUnit(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'ingredients')}
            className='unit-dropdown'
          >
           <option value="">Select a unit</option>
              <option value=" ">N/A</option>
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
              onKeyDown={(e) => handleKeyPress(e, 'instructions')}
              placeholder="Enter cooking instructions"
            />
          </div>
        </div>
        <div className='label-container'>
          <h2 className='label-text'>Tags</h2>
        </div>
        <div className='add-container'>
          <div className='ingredient-input'>
          
          <div>
            {tags.map((tag, index) => (
              <p key={index} onClick={() => handleRemoveTag(index)} className="removable-item">
                {tag}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'tags')}
            placeholder="Enter tags to help people discover your recipe (eg. #glutenfree, #vegan, #italian)"
          />
          <button type="button" onClick={handleAddTag} className="add-ingredient-button">+ Add Tag</button>
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