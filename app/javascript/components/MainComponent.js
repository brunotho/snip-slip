import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import SnippetsGame from './SnippetsGame';
import GameOver from './GameOver';

function MainComponent({ gameSessionId = null }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const handlePlay = () => {
    setGameStarted(true);
    setGameData(null);
    setGameMode("quick");
  };

  const handleSnippetCompletion = (data) => {
    setGameStarted(false);
    setGameData(data);
  };

  useEffect(() => {
    if (gameSessionId) {
      setGameStarted(true);

      fetch(`/game_sessions/${gameSessionId}.json`, {
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.players && data.players.length > 1) {
            setGameMode("multi");
          } else {
            setGameMode("single");
          }
        })
        .catch(error => {
          console.error("Error fetching game sessions details (gameMode):", error);
        });
    }
  }, [gameSessionId]);

  return (
    <div>
      {!gameStarted && !gameData && !gameSessionId && (
        <>
          <HeroSection onPlay={handlePlay} />
          <div className="d-flex justify-content-center">
            <div className="container mt-5 d-flex flex-column align-items-center">
              <div className="mt-4">
                <ul className="list-unstyled">
                  <li>Press Play</li>
                  <li>Select a snippet</li>
                  <li>Slip it into regular conversation without anyone noticing</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {gameStarted && (
        <SnippetsGame
          game_session_id={gameSessionId}
          gameMode={gameMode}
          onSnippetComplete={handleSnippetCompletion} />
      )}

      {gameData && (
        <GameOver
          gameData={gameData}
          onPlayAgain={handlePlay} />
      )}
    </div>
  );
}

export default MainComponent;
