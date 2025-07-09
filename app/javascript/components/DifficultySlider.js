import React, { useState } from 'react';

const DifficultySlider = () => {
  const [difficulty, setDifficulty] = useState(400);

  const handleSliderChange = (event) => {
    setDifficulty(event.target.value);
    document.getElementById('snippet_difficulty').value = event.target.value;
  };

  return (
    <div className="difficulty-slider-container">
      <label htmlFor="difficulty">Difficulty: {difficulty}</label>
      <input
        type="range"
        id="difficulty"
        name="difficulty"
        min="100"
        max="1000"
        step="100"
        value={difficulty}
        onChange={handleSliderChange}
        className="slider"
      />
      <input type="hidden" id="snippet_difficulty" name="lyric_snippet[difficulty]" value={difficulty} />
    </div>
  );
};

export default DifficultySlider;
