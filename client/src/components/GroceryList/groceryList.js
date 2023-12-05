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
      <div className="add-item-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Handle Enter key press
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
            className="checkbox"
            style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'red' : 'black' }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleToggleItem(index)}
            />
            <label>{item.text}</label>
          </li>
        ))}
      </ul>
      <button className="discard-button" onClick={handleDiscardList}>
        Discard Shopping List
      </button>
    </div>
  );
};

export default GroceryList;
