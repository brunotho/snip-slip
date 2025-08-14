import React from 'react';

function PlayAgainButton({ onPlayAgain, disabled = false }) {
  if (disabled) {
    return (
      <div className="text-center" style={{ marginBottom: '1.5rem' }}>
        <div className="card-elevated p-4">
          <div className="d-flex align-items-center justify-content-center">
            <span className="loading-ellipsis text-muted me-2">Waiting for other players</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        className="btn btn-accent btn-lg"
        onClick={onPlayAgain}
        style={{ minWidth: '140px', marginBottom: '1.5rem' }}
      >
        Play Again
      </button>
    </div>
  );
}

export default PlayAgainButton; 