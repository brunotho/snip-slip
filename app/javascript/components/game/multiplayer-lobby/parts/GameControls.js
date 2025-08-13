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
      <div className="text-muted mt-2">
        {joinedPlayers.length < 2 ? (
          <span>Waiting for players to join...</span>
        ) : (
          <span>{joinedPlayers.length} players ready</span>
        )}
      </div>
    </div>
  );
}

export default GameControls; 