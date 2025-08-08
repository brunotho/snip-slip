import React from 'react';
import PlayerCard from './PlayerCard';

function LeaderBoard({ 
  players, 
  winnerIds, 
  currentUserId, 
  waitingForOthers 
}) {
  return (
    <div className="mb-4">
      <h5 className="mb-3">Final Results</h5>
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          player={player}
          rank={index + 1}
          isCurrentPlayer={player.id === currentUserId}
          isWinner={winnerIds.includes(player.id)}
          isMultiplayer={true}
          showTrophy={index === 0 && winnerIds.includes(player.id) && !waitingForOthers}
        />
      ))}
    </div>
  );
}

export default LeaderBoard; 