import React, { useEffect } from "react";
import { createRoot } from 'react-dom/client';
import ConstrainedLayout from '../shared/ConstrainedLayout';
import DifficultySlider from "../shared/DifficultySlider";

const AddSnippet = ({ html = "" }) => {
  useEffect(() => {
    const sliderContainer = document.getElementById('difficulty-slider-container');
    if (sliderContainer) {
      const root = createRoot(sliderContainer);
      root.render(<DifficultySlider standalone={true} />);
    }
  }, []);

  return (
    <ConstrainedLayout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ConstrainedLayout>
  )
}

export default AddSnippet;
