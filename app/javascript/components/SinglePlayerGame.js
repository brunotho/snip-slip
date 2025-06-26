import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';
import GameProgressBar from './GameProgressBar';

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

  if (error) return <div>Error loading snippets: {error.message}</div>;
  if (loading) return <div>Loading Snippets...</div>;

  console.log("SINGLEPLAYER before return gameData:", gameData);

  // Convert single player data to players format for GameProgressBar
  const players = gameData.totalScore !== undefined ? {
    [gameData.currentPlayerId || 'player1']: {
      id: gameData.currentPlayerId || 'player1',
      name: 'You',
      total_score: gameData.totalScore,
      rounds_played: gameData.roundsPlayed,
      round_history: gameData.roundHistory || []
    }
  } : {};

  return (
    <>
      <GameProgressBar 
        players={players}
        currentUserId={gameData.currentPlayerId || 'player1'}
        isMultiplayer={false}
      />
      <GameLayout
        mainContent={mainContent}
        sideContent={null}
        showSidePanel={false}
      />
    </>
  );
}

export default SinglePlayerGame;
