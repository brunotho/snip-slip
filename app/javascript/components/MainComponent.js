import React, { useState, useEffect } from 'react';
import HeroSection from './game/layouts/HeroSection';
import SnippetsGame from './game/SnippetsGame';
import GameOver from './game/GameOver';
import BottomNavigation from './navigation/BottomNavigation';

function MainComponent({ gameSessionId = null, userLanguage = 'English', userSignedIn = false }) {
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
    const fetchGameSession = async () => {
      try {
        const response = await fetch(`/game_sessions/${gameSessionId}.json`, {
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch game session data. HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setGameMode(Object.keys(data.players).length > 1 ? "multi" : "single");
      } catch (error) {
        console.error("Error fetching game sessions details:", error);
      }
    };

    if (gameSessionId) {
      fetchGameSession();
    }
  }, [gameSessionId]);

  const handlePlayAgain = async () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    if (gameMode === 'quick') {
      // For quick play, just reset to home and let user start fresh
      setGameData({});
      setGameMode(null);
      window.location.href = '/';
    } else if (gameMode === 'single') {
      // For single player, start a new single player game directly
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_single_player';
      
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'authenticity_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      document.body.appendChild(form);
      form.submit();
    } else if (gameMode === 'multi') {
      // For multiplayer, start a new multiplayer session (goes to lobby)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_multiplayer';
      
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'authenticity_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      document.body.appendChild(form);
      form.submit();
    } else {
      // Fallback: redirect to home
      window.location.href = '/';
    }
  };

  const currentView = getView();

  return (
    <div>
      {currentView === 'home' && (
        <>
          <HeroSection 
            userLanguage={userLanguage}
            onPlay={() => {
              setGameMode('quick');
              setGameData({ status: true });
            }}
          />
          <BottomNavigation userSignedIn={userSignedIn} />
        </>
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
          waitingForOthers={true}
        />
      )}

      {currentView === 'gameover' && (
        <GameOver
          gameData={gameData}
          setGameData={setGameData}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default MainComponent;
