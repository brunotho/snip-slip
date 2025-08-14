import React from 'react';
import PlayerCard from './PlayerCard';

function LeaderBoard({ 
  players, 
  winnerIds, 
  currentUserId, 
  waitingForOthers 
}) {
  // Compute dense ranks so ties share the same rank number
  const ranks = players.map((player, index) => {
    if (index === 0) return 1;
    const prev = players[index - 1];
    return player.total_score === prev.total_score ? 
      (players[index - 1].__rank || 1) : 
      index + 1;
  });

  // Attach computed rank to preserve for next iterations
  players.forEach((p, i) => { p.__rank = ranks[i]; });

  return (
    <div className="mb-4">
      <h5 className="mb-3">Final Results</h5>
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          player={player}
          rank={ranks[index]}
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