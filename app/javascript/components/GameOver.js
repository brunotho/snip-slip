import React, { useEffect } from 'react';
import GameProgressCard from './GameProgressCard';
import GameLayout from './GameLayout';
import { createGameSessionChannel } from '../channels/game_session_channel';

function GameOver({ gameData, setGameData, players, setPlayers }) {
  useEffect(() => {
    console.log("Setting up GameOver channel with session:", gameData.game_session_id);
    const gameChannel = createGameSessionChannel(gameData.game_session_id);

    gameChannel.received = (data) => {
      console.log("GameOver received update:", data);
      // console.log("Current gameComplete status:", gameComplete);
      if (data.type === "round_completed") {
        console.log("Processing round completion from:", data.player.name);
        console.log("Current scores:", Object.values(players).map(p => `${p.name}: ${p.total_score}`));
        setPlayers(prevPlayers => {
          console.log("Current players state:", prevPlayers);
          const newState = {
            ...prevPlayers,
            [data.player.id]: {
              id: data.player.id,
              name: data.player.name,
              rounds_played: data.player.rounds_played,
              successful_rounds_count: data.player.successful_rounds_count,
              total_score: data.player.total_score,
              round_history: data.player.round_history
            }
          };
          console.log("New players state:", newState);
          return newState;
        });

        setGameData(prevGameData => ({
          ...prevGameData,
          currentPlayerName: data.name,
          gameOver: data.game_over
        }));
      }
    };
    // console.log("GameOver mounted with gameComplete:", gameComplete);

    return () => {
      console.log("Cleaning up GameOver channel");
      gameChannel.unsubscribe();
    };
  }, [gameData.game_session_id]);


  const winnerIds = Object.values(players).reduce((highest, player) => {
    if (player.total_score > highest.score) {
      // New highest score found, reset the ids array
      return { score: player.total_score, ids: [player.id] };
    } else if (player.total_score === highest.score) {
      // Tie for the highest score, add the current player's id
      return { ...highest, ids: [...highest.ids, player.id] };
    }
    // No change in the highest score, return the current highest
    return highest;
  }, { score: -1, ids: [] }).ids;


  console.log("GameOver rendering with:", {
    // gameComplete,
    players: Object.values(players).map(p => `${p.name}: ${p.total_score}`),
    winnerIds
  });

  return (
    <GameLayout
    mainContent={
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="mb-4 text-center">Game Over!</h2>
            <div className="d-flex justify-content-center">
              <div className="col-md-6">
                <GameProgressCard
                  playerName={gameData.currentPlayerName}
                  totalScore={gameData.totalScore}
                  roundsPlayed={gameData.roundsPlayed}
                  successfulRoundsCount={gameData.successfulRoundsCount}
                  roundHistory={gameData.roundHistory}
                  winner={gameData.gameOver && winnerIds.includes(gameData.currentPlayerId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    sideContent={
      <div className="multiplayer-progress">
        <div>
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
                  winner={gameData.gameOver && winnerIds.includes(player.id)}
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
