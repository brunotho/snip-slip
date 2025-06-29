import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import SnippetsGame from './SnippetsGame';
import GameOver from './GameOver';

function MainComponent({ gameSessionId = null, userLanguage = 'English' }) {
  const [gameData, setGameData] = useState({});
  const [gameMode, setGameMode] = useState(null);

  const getView = () => {
    if (!gameSessionId && Object.keys(gameData).length === 0) {
      return 'home';
    }

    const isMultiplayer = gameMode === 'multi';
    
    // Single player: show game over when player finishes
    if (!isMultiplayer && gameData.playerGameOver) {
      return 'gameover';
    }
    
    // Multiplayer: show game over only when entire game is complete
    if (isMultiplayer && gameData.gameOver) {
      return 'gameover';
    }
    
    // Multiplayer: show waiting state when player is done but game continues
    if (isMultiplayer && gameData.playerGameOver && !gameData.gameOver) {
      return 'waiting';
    }

    return 'game';
  };

  useEffect(() => {
    if (gameSessionId) {
      fetch(`/game_sessions/${gameSessionId}.json`, {
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(response => response.json())
        .then(data => {
          setGameMode(Object.keys(data.players).length > 1 ? "multi" : "single");
        })
        .catch(error => {
          console.error("Error fetching game sessions details:", error);
        });
    }
  }, [gameSessionId]);

  const handlePlayAgain = () => {
    // Reset game state and start a new game with the same mode
    if (gameMode === 'quick') {
      // For quick play, just reset to home and let user start fresh
      setGameData({});
      setGameMode(null);
      window.location.href = '/';
    } else {
      // For multiplayer/single player games, redirect to start new session
      // This will need to be implemented based on your routing logic
      window.location.href = '/';
    }
  };

  const handleMainMenu = () => {
    // Navigate back to main menu
    setGameData({});
    setGameMode(null);
    window.location.href = '/';
  };

  const currentView = getView();

  return (
    <div>
      {currentView === 'home' && (
          <HeroSection 
            userLanguage={userLanguage}
            onPlay={() => {
              setGameMode('quick');
              setGameData({ status: true });
            }}
          />
      )}

      {currentView === 'game' && (
        <SnippetsGame
          game_session_id={gameSessionId}
          gameMode={gameMode}
          gameData={gameData}
          setGameData={setGameData}
        />
      )}

      {currentView === 'waiting' && (
        <GameOver
          gameData={gameData}
          setGameData={setGameData}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
          waitingForOthers={true}
        />
      )}

      {currentView === 'gameover' && (
        <GameOver
          gameData={gameData}
          setGameData={setGameData}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}

export default MainComponent;
