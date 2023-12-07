import React, { useState, useEffect } from 'react';
import './groceryList.css';

const GroceryList = () => {
  const [inputValue, setInputValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    const fetchGroceryList = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/user/grocerylist', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const list = await response.json();
          setGroceryList(list);
        }
      } catch (error) {
        console.error('Error fetching grocery list:', error);
      }
    };
    fetchGroceryList();
  }, []);

  const updateGroceryList = async (updatedList) => {
    const token = sessionStorage.getItem('token');
    try {
      await fetch('http://localhost:8080/user/grocerylist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groceryList: updatedList }),
      });
      setGroceryList(updatedList);
    } catch (error) {
      console.error('Error updating grocery list:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setGroceryList([...groceryList, { text: inputValue, checked: false }]);
      setInputValue('');
    }
    const updatedList = [...groceryList, { text: inputValue, checked: false }];
    updateGroceryList(updatedList);
  };

  const handleToggleItem = (index) => {
    const updatedList = [...groceryList];
    updatedList[index].checked = !updatedList[index].checked;
    updateGroceryList(updatedList);

  };

  const handleDiscardList = () => {
    updateGroceryList([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="container">
      <h1 className='grocery-header'>
        Your Grocery List:
      </h1>
      <div className="message">
        <div>
          <div className="message-line1">Found a recipe you want to try, but now you need to make a grocery store trip?</div>
          <div className="message-line2">Take this with you to the store so you don't forget anything!</div>
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
