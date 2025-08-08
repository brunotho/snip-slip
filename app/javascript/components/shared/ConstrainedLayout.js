import React from 'react';

const ConstrainedLayout = ({ children, centered = false }) => (
  <div className={`constrained-container ${centered ? 'constrained-container--centered' : ''}`}>
    <div className="constrained-content">
      {children}
    </div>
  </div>
);

export default ConstrainedLayout;
