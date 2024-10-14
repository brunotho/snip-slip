import React from 'react';
import GameProgressCard from './GameProgressCard';

function GameOver({ gameData, onPlayAgain }) {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4 text-center">Game Over!</h2>
          <div className="d-flex justify-content-center">
            <div className="col-md-6">
              <GameProgressCard
                totalScore={gameData.totalScore}
                roundsPlayed={gameData.roundsPlayed}
                successfulRoundsCount={gameData.successfulRoundsCount}
                roundHistory={gameData.roundHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
