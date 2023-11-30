
import './CreatePage.css';
import React, { useState } from 'react';

const CreatePage = () => {
  const [featureAvailable, setFeatureAvailable] = useState(true);

  const handleClick = () => {
    setFeatureAvailable(false);
  };

  return (
    <div>
      {featureAvailable ? (
        <button onClick={handleClick}>
          <span>+</span> {/* You can replace this with an actual icon */}
        </button>
      ) : (
        <p>Feature coming soon</p>
      )}
    </div>
  );
};

export default CreatePage;
