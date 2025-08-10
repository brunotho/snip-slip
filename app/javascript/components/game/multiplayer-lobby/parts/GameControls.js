import React from 'react';

function GameControls({ isHost, joinedPlayers, onStartGame }) {
  return (
    <div className="text-center mt-4">
      {isHost ? (
        <button
          className="btn btn-accent-emphasized btn-lg"
          disabled={joinedPlayers.length < 2}
          onClick={onStartGame}
        >
          Start Game
        </button>
      ) : (
        <div className="alert alert-info">
          Waiting for host to start the game...
        </div>
      )}
      <p className="text-muted mt-2">
        {joinedPlayers.length < 2
          ? 'Waiting for players to join...'
          : `${joinedPlayers.length} players ready`
        }
      </p>
    </div>
  );
}

export default GameControls; 