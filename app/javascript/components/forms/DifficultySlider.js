import React, { useState } from 'react';

function DifficultySlider({ value, onChange, standalone = false }) {
  const [internalDifficulty, setInternalDifficulty] = useState(400);
  
  const currentValue = standalone ? internalDifficulty : (value || 400);
  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    
    if (standalone) {
      setInternalDifficulty(newValue);
      const hiddenInput = document.getElementById('snippet_difficulty');
      if (hiddenInput) {
        hiddenInput.value = newValue;
      }
    } else {
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="difficulty-slider-container">
      <label htmlFor="difficulty">Difficulty: {currentValue}</label>
      <input
        type="range"
        id="difficulty"
        name="difficulty"
        min="100"
        max="1000"
        step="100"
        value={currentValue}
        onChange={handleSliderChange}
        className="slider"
      />
      {standalone && (
        <input type="hidden" id="snippet_difficulty" name="lyric_snippet[difficulty]" value={currentValue} />
      )}
    </div>
  );
};

export default DifficultySlider;