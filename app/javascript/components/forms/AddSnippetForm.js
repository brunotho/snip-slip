import React, { useEffect } from "react";
import { createRoot } from 'react-dom/client';
import ConstrainedLayout from '../shared/ConstrainedLayout';
import DifficultySlider from "../shared/DifficultySlider";

const AddSnippetFormWrapper = ({ children }) => {
  useEffect(() => {
    const sliderContainer = document.getElementById('difficulty-slider-container');
    if (sliderContainer) {
      const root = createRoot(sliderContainer);
      root.render(<DifficultySlider standalone={true} />);
    }
  }, []);

  return (
    <ConstrainedLayout>
      { children }
    </ConstrainedLayout>
  )
}

export default AddSnippetFormWrapper;
