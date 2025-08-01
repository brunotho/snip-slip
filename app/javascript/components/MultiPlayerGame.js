import React, { useState, useEffect, useRef } from "react";
import GameLayout from "./GameLayout";
import GameProgressBar, { calculateProgressBarHeight } from "./GameProgressBar";
import { createGameSessionChannel } from "../channels/game_session_channel";

function MultiPlayerGame({ loading, error, gameData, setGameData, game_session_id, mainContent }) {

  useEffect(() => {
    if (!game_session_id) return;

    const gameChannel = createGameSessionChannel(game_session_id);

    // updating gameData on every round_submit
    gameChannel.received = (data) => {
      if (data.type === "round_completed") {
        setGameData(prevGameData => ({
          ...prevGameData,
          players: {
            ...prevGameData.players,
            [data.player.id]: data.player
          },
          gameOver: data.game_over
        }));
      }
    };

    return () => {
      gameChannel.unsubscribe();

    };
  }, [game_session_id, gameData]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="text-center">
          <div className="text-danger mb-3" style={{ fontSize: '2rem' }}>⚠️</div>
          <h4 className="text-danger mb-2">Unable to load snippets</h4>
          <p className="text-muted">{error.message}</p>
          <button 
            className="btn btn-outline-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="skeleton-circle skeleton-circle-lg"></div>
        <div className="skeleton-line" style={{ width: '200px' }}></div>
        <div className="skeleton-line skeleton-line-sm" style={{ width: '150px' }}></div>
      </div>
    );
  }

  const progressBarHeight = calculateProgressBarHeight(Object.keys(gameData.players || {}).length);

  return (
    <>
      <GameProgressBar 
        players={gameData.players || {}}
        currentUserId={gameData.currentPlayerId}
        isMultiplayer={true}
        loading={loading || !gameData.players}
      />
    <GameLayout
        mainContent={mainContent}
        sideContent={null}
        showSidePanel={false}
        showProgressBar={true}
        progressBarHeight={progressBarHeight}
                  />
    </>
  );
}

export default MultiPlayerGame;
