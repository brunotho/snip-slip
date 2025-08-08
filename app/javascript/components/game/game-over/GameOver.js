import React, { useEffect } from 'react';
import { createGameSessionChannel } from '../../../channels/game_session_channel';
import ConstrainedLayout from '../../shared/ConstrainedLayout';
import GameResultHeader from './parts/GameResultHeader';
import PlayAgainButton from './parts/PlayAgainButton';
import LeaderBoard from './parts/LeaderBoard';
import SinglePlayerHistory from './parts/SinglePlayerHistory';

function GameOver({ gameData, setGameData, onPlayAgain, waitingForOthers = false }) {
  useEffect(() => {
    const gameChannel = createGameSessionChannel(gameData.game_session_id);

    gameChannel.received = (data) => {
      if (data.type === "round_completed") {
        setGameData(prevGameData => ({
          ...prevGameData,
          players: {
            ...prevGameData.players,
            [data.player.id]: data.player
          },
          gameOver: data.game_over,
        }));
      }
    };

    return () => {

      gameChannel.unsubscribe();
    };
  }, [gameData.game_session_id]);

  const isMultiplayer = Object.values(gameData.players).length > 1;

  const winnerIds = Object.values(gameData.players).reduce((highest, player) => {
    if (player.total_score > highest.score) {
      return { score: player.total_score, ids: [player.id] };
    } else if (player.total_score === highest.score) {
      return { ...highest, ids: [...highest.ids, player.id] };
    }
    return highest;
  }, { score: -1, ids: [] }).ids;

  const currentPlayer = gameData.players[gameData.currentPlayerId];
  const isWinner = winnerIds.includes(gameData.currentPlayerId);
  const sortedPlayers = Object.values(gameData.players).sort((a, b) => b.total_score - a.total_score);

  const getResultMessage = () => {
    if (waitingForOthers) {
      return "Round Complete!";
    }
    if (isMultiplayer) {
      return isWinner ? "Victory!" : "Game Complete!";
    }
    return "Game Complete!";
  };

  const getResultSubtext = () => {
    if (waitingForOthers) {
      return;
    }
    if (isMultiplayer) {
      const winnerCount = winnerIds.length;
      if (winnerCount > 1) {
        return isWinner ? "Tied for first place!" : `${winnerCount} players tied for first`;
      }
      return isWinner ? "You won!" : `${sortedPlayers[0].name} won!`;
    }
  };



  return (
    <ConstrainedLayout>
      <GameResultHeader 
        resultMessage={getResultMessage()}
        resultSubtext={getResultSubtext()}
        score={currentPlayer.total_score}
        isWinner={isWinner}
        isMultiplayer={isMultiplayer}
      />

      {isMultiplayer ? (
        <LeaderBoard 
          players={sortedPlayers}
          winnerIds={winnerIds}
          currentUserId={gameData.currentPlayerId}
          waitingForOthers={waitingForOthers}
        />
      ) : (
        <SinglePlayerHistory player={currentPlayer} />
      )}

      <PlayAgainButton 
        onPlayAgain={onPlayAgain}
        disabled={waitingForOthers}
      />
    </ConstrainedLayout>
  );
}

export default GameOver;
