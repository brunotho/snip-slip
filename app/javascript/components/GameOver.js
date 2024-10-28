import React, { useEffect } from 'react';
import GameProgressCard from './GameProgressCard';
import GameLayout from './GameLayout';
import { createGameSessionChannel } from '../channels/game_session_channel';

function GameOver({ gameData, players, setPlayers, gameComplete }) {
  useEffect(() => {
    console.log(gameData);
    console.log("😎😋😊😉☺😚😙");


    // if (gameData.currentPlayerId) {
      const gameChannel = createGameSessionChannel(gameData.game_session_id);

      gameChannel.received = (data) => {
        if (data.type === "round_completed") {
          setPlayers(prevPlayers => ({
            ...prevPlayers,
            [data.player.id]: {
              id: data.player.id,
              name: data.player.name,
              rounds_played: data.player.rounds_played,
              successful_rounds_count: data.player.successful_rounds_count,
              total_score: data.player.total_score,
              round_history: data.player.round_history
            }
          }));
        }
      };

      return () => gameChannel.unsubscribe();
    // }
  }, [gameData.game_session_id]);

  // if (gameComplete)


  return (
    <GameLayout
    mainContent={
      // <div className="container mt-5">
      //   <div className="row justify-content-center">
      //     <div className="col-md-8">
      //       <h2 className="mb-4 text-center">Game Over!</h2>
      //       <div className="d-flex justify-content-center">
      //         <div className="col-md-6">
                <GameProgressCard
                  totalScore={gameData.totalScore}
                  roundsPlayed={gameData.roundsPlayed}
                  successfulRoundsCount={gameData.successfulRoundsCount}
                  roundHistory={gameData.roundHistory}
                />
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    }
    sideContent={
      <div className="multiplayer-progress">
        <div>
          <h4>Other Players</h4>
          {Object.values(players)
            .filter(player => player.id !== gameData.currentPlayerId)
            .map(player => (
              <div key={player.id} className="mb-3">
                <GameProgressCard
                  playerName={player.name}
                  totalScore={player.total_score}
                  roundsPlayed={player.rounds_played}
                  successfulRoundsCount={player.successful_rounds_count}
                  roundHistory={player.round_history}
                />
              </div>
            ))}
        </div>
      </div>
    }
    showSidePanel={true}
  />
  );
}

export default GameOver;
