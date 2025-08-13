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
        <div className="lobby-info-display">
          Waiting for host to start the game...
        </div>
      )}
      <p className="text-muted mt-2">
        {joinedPlayers.length < 2 ? 
        <p className="text-muted mt-2">
          Waiting for players to join...
        </p>
          : 
        <p className="text-muted mt-2">
          {joinedPlayers.length} players ready
        </p>
        }
      </p>
    </div>
  );
}

export default GameControls; 