import React from 'react';
import PlayerCard from './PlayerCard';

function SinglePlayerHistory({ player }) {
  return (
    <div className="mb-4 d-flex justify-content-center">
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <PlayerCard 
          player={player} 
          rank={1} 
          isCurrentPlayer={true}
          isWinner={true}
          isMultiplayer={false}
          showTrophy={false}
        />
      </div>
    </div>
  );
}

export default SinglePlayerHistory; 