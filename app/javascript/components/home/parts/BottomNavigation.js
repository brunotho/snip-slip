import React from 'react';

const BottomNavigation = ({ onPlaySingle, onPlayMulti }) => {
  const handlePlaySinglePlayer = () => {
    if (onPlaySingle) return onPlaySingle();
  };

  const handlePlayMultiPlayer = () => {
    if (onPlayMulti) return onPlayMulti();
  };

  return (
    <div className="bottom-nav-buttons">
      <button
        onClick={handlePlaySinglePlayer}
        className="btn btn-accent btn-pill btn-md"
      >
        Play Alone :{'<'}
      </button>
      <button
        onClick={handlePlayMultiPlayer}
        className="btn btn-accent btn-pill btn-md"
      >
        Play with Friends :{'>'}
      </button>
    </div>
  );
};

export default BottomNavigation;
