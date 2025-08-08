import React from 'react';

function GameResultHeader({ 
  resultMessage, 
  resultSubtext, 
  score, 
  isWinner, 
  isMultiplayer 
}) {
  return (
    <div className="text-center mb-4 mt-4">
      <h1 className="display-6 fw-bold mb-2">{resultMessage}</h1>
      <p className="text-muted mb-3">{resultSubtext}</p>

      {/* Main Score Display */}
      <div className={`card-elevated d-inline-block px-4 py-3 ${isWinner && isMultiplayer ? 'border-warning' : ''}`}>
        <div className="text-center">
          <div className="display-4 fw-bold text-dark">{score}</div>
        </div>
      </div>
    </div>
  );
}

export default GameResultHeader; 