import React from 'react';

const Loading = ({ message = "Loading..." }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div>{message}</div>
  </div>
);

export default Loading;