
import './CreatePage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const [featureAvailable, setFeatureAvailable] = useState(true);
  const navigate = useNavigate(); 

  const handleClick = () => {
    setFeatureAvailable(false);
    navigate('/add-recipe'); // Navigate to /add-recipe route
  };

  return (
    <div>
      {featureAvailable ? (
        <button onClick={handleClick}>
          <span>+ Create New Recipe</span>
        </button>
      ) : (
        <p>Feature coming soon</p>
      )}
    </div>
  );
};

export default CreatePage;
