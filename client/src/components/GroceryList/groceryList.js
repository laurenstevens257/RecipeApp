import React, { useState } from 'react';
import './groceryList.css';

const GroceryList = () => {
  const [inputValue, setInputValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setGroceryList([...groceryList, { text: inputValue, checked: false }]);
      setInputValue('');
    }
  };

  const handleToggleItem = (index) => {
    const updatedList = [...groceryList];
    updatedList[index].checked = !updatedList[index].checked;
    setGroceryList(updatedList);
  };

  const handleDiscardList = () => {
    setGroceryList([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-text">
          <div className="header-line1">Found a recipe you want to try, but now you need to make a grocery store trip?</div>
          <div className="header-line2">Take this with you to the store so you don't forget anything!</div>
        </div>
      </div>
      <div className="grocerylist-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} 
          placeholder="Enter ingredient..."
          className="ingredient-input"
        />
        <button className="add-item-button" onClick={handleAddItem}>
          +
        </button>
      </div>
      <ul>
        {groceryList.map((item, index) => (
          <li
            key={index}
            className={`grocery-item ${item.checked ? 'checked' : ''}`}
            onClick={() => handleToggleItem(index)}
          >
            {item.text}
          </li>
        ))}
      </ul>
      <div className='grocerylist-container'>
        <button className="discard-button" onClick={handleDiscardList}>
          Discard Shopping List
        </button>
      </div>
    </div>
  );
};

export default GroceryList;
