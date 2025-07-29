import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';
import GameProgressBar, { calculateProgressBarHeight } from './GameProgressBar';

function SinglePlayerGame({
  snippets,
  loading,
  error,
  selectedSnippet,
  setSelectedSnippet,
  gameData,
  handleSubmit,
  handleNextSnippet,
  game_session_id,
  mainContent
}) {

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

  // Convert single player data to players format for GameProgressBar
  const players = gameData.totalScore !== undefined ? {
    [gameData.currentPlayerId || 'player1']: {
      id: gameData.currentPlayerId || 'player1',
      name: gameData.currentPlayerName || 'Player',
      total_score: gameData.totalScore,
      rounds_played: gameData.roundsPlayed,
      round_history: gameData.roundHistory || []
    }
  } : {};

  const progressBarHeight = calculateProgressBarHeight(Object.keys(players).length);

  return (
    <>
      <GameProgressBar 
        players={players}
        currentUserId={gameData.currentPlayerId || 'player1'}
        isMultiplayer={false}
        loading={loading || gameData.totalScore === undefined}
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

export default SinglePlayerGame;
