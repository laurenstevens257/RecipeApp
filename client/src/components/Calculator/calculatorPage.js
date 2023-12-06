import React, { useState } from 'react';
import './calculatorPage.css';

const conversions = {
  teaspoons: 48, // 1 cup = 48 teaspoons
  tablespoons: 16, // 1 cup = 16 tablespoons
  cups: 1, // 1 cup = 1 cup
  ounces: 8, // 1 cup = 8 ounces
  quarts: 0.25, // 1 cup = 0.25 quarts
  liters: 0.236588, // 1 cup = 0.236588 liters
  grams: 236.588, // 1 cup = 236.588 grams
  pounds: 0.521587, // 1 cup = 0.521587 pounds
};

const CalculatorPage = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('teaspoons');
  const [toUnit, setToUnit] = useState('cups');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    if (isNaN(value)) {
      setResult('Please enter a valid number.');
      return;
    }

    const convertedValue = (value * conversions[toUnit]) / conversions[fromUnit];
    setResult(`${value} ${fromUnit} is equal to ${convertedValue} ${toUnit}`);
  };

  return (
  <div>
    <div className='header-container'>
      <h1>Measurement Converter</h1>
    </div>
    <div className="calculator-wrapper">
      <div>
        <label>
          Enter Value:
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          From:
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {Object.keys(conversions).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          To:
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.keys(conversions).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      {result && <p>{result}</p>}
    </div>
  </div>
  );
};

export default CalculatorPage;
