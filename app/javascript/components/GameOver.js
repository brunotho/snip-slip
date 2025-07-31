import React, { useEffect } from 'react';
import GameLayout from './GameLayout';
import { createGameSessionChannel } from '../channels/game_session_channel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTrophy, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';

function GameOver({ gameData, setGameData, onPlayAgain, onMainMenu, waitingForOthers = false }) {
  if (!gameData) return null;



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

  const gameMode = Object.values(gameData.players).length > 1 ? 'multi' : 'single';
  const isMultiplayer = gameMode === 'multi';

  // Calculate winners
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
  
  // Sort players by score for leaderboard
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
      return "Waiting for other players to finish...";
    }
    if (isMultiplayer) {
      const winnerCount = winnerIds.length;
      if (winnerCount > 1) {
        return isWinner ? "Tied for first place!" : `${winnerCount} players tied for first`;
      }
      return isWinner ? "You won!" : `${sortedPlayers[0].name} won!`;
    }
    return `You completed ${currentPlayer.rounds_played} rounds`;
  };

  const PlayerHistoryCard = ({ player, rank, isCurrentPlayer = false }) => (
    <div className={`card-elevated mb-3 ${winnerIds.includes(player.id) ? 'border-warning' : ''}`}>
      <div className="card-body-custom">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            {isMultiplayer && (
              <h6 className="mb-1 d-flex align-items-center">
                {rank === 1 && winnerIds.includes(player.id) && !waitingForOthers && (
                  <FontAwesomeIcon icon={faTrophy} className="text-warning me-2" />
                )}
                {player.name}
              </h6>
            )}
            {isMultiplayer && (
              <div className="text-muted small">
                Score: {player.total_score}
              </div>
            )}
          </div>
          {isMultiplayer && (
            <div className="text-end">
              <span className="badge bg-secondary">#{rank}</span>
            </div>
          )}
        </div>
        
        {player.round_history && player.round_history.length > 0 && (
          <div className="mt-2">
            {player.round_history.map((round, index) => (
              <div key={index} className="mb-1 small" style={{ display: 'block' }}>
                <FontAwesomeIcon
                  icon={round.success ? faCheck : faXmark}
                  className={`me-2 ${round.success ? 'text-success' : 'text-danger'}`}
                  style={{ float: 'left', marginTop: '2px' }}
                />
                <div style={{ 
                  marginLeft: '20px',
                  wordBreak: 'break-word', 
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal'
                }}>
                  {round.lyric_snippet.snippet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <GameLayout
    mainContent={
        <div className="px-3">
          {/* Game Mode Badge - positioned in corner */}
          <div className="position-absolute top-0 end-0 mt-2 me-2">
            <span className="badge bg-light text-dark border">
              <FontAwesomeIcon icon={isMultiplayer ? faUsers : faUser} className="me-1" />
              {isMultiplayer ? 'Multiplayer' : 'Single Player'}
            </span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold mb-2">{getResultMessage()}</h1>
            <p className="text-muted mb-3">{getResultSubtext()}</p>

            {/* Main Score Display */}
            <div className={`card-elevated d-inline-block px-4 py-3 ${isWinner && isMultiplayer ? 'border-warning' : ''}`}>
              <div className="text-center">
                <div className="display-4 fw-bold text-dark">{currentPlayer.total_score}</div>
              </div>
            </div>
          </div>

          {/* Single Player History */}
          {!isMultiplayer && (
            <div className="mb-4 d-flex justify-content-center">
              <div style={{ maxWidth: "500px", width: "100%" }}>
                <PlayerHistoryCard player={currentPlayer} rank={1} isCurrentPlayer={true} />
        </div>
      </div>
          )}

          {/* Multiplayer Leaderboard */}
          {isMultiplayer && (
            <div className="mb-4">
              <h5 className="mb-3">Final Results</h5>
              {sortedPlayers.map((player, index) => (
                <PlayerHistoryCard
                  key={player.id}
                  player={player}
                  rank={index + 1}
                  isCurrentPlayer={player.id === gameData.currentPlayerId}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {!waitingForOthers && (
            <div className="text-center">
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button
                  className="btn btn-accent btn-lg"
                  onClick={onPlayAgain}
                  style={{ minWidth: '140px' }}
                >
                  Play Again
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={onMainMenu}
                  style={{ minWidth: '140px' }}
                >
                  Main Menu
                </button>
              </div>
            </div>
          )}

          {/* Waiting state info */}
          {waitingForOthers && (
            <div className="text-center">
              <div className="card-elevated p-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="spinner-border text-primary me-3" role="status">
                    <span className="visually-hidden">Waiting...</span>
                  </div>
                  <span className="text-muted">Game will continue automatically when all players finish</span>
                </div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={onMainMenu}
                  style={{ minWidth: '140px' }}
                >
                  Leave Game
                </button>
              </div>
        </div>
          )}
      </div>
    }
      showSidePanel={false}
      showProgressBar={false}
    gameOver={true}
  />
  );
}

export default GameOver;
