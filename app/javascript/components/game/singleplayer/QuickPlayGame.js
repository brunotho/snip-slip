import React from 'react';
import GameLayout from '../layouts/GameLayout';

function QuickPlayGame({ loading, mainContent}) {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="skeleton-circle skeleton-circle-lg"></div>
        <div className="skeleton-line" style={{ width: '200px' }}></div>
        <div className="skeleton-line skeleton-line-sm" style={{ width: '150px' }}></div>
      </div>
    );
  }

  return (
    <GameLayout
      mainContent={mainContent}
      showSidePanel={false}
      showProgressBar={false}
    />
  );
}

export default QuickPlayGame;
