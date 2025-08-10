import React from 'react';

function PlayersList({ joinedPlayers }) {
  if (joinedPlayers.length === 0) {
    return <p>Waiting for players to join...</p>;
  }

  return (
    joinedPlayers.map((player) => (
      <div key={player.id} className="mb-2">
        {player.name}
      </div>
    ))
  );
}

export default PlayersList; 