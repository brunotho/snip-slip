import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';
import GameProgressCard from './GameProgressCard';

/**
 * SinglePlayerGame Component
 *
 * This component handles the single-player mode of the game. It renders the snippets
 * for the player to choose from and expands the selected snippet for interaction.
 * It also tracks and displays the player's progress (score, rounds played) using a side panel.
 *
 * Props:
 * - `snippets` (Array): The list of available lyric snippets for the game.
 * - `loading` (Boolean): A flag indicating whether the snippets are currently being loaded.
 * - `error` (Object | null): An error object containing any issues encountered when fetching the snippets.
 * - `selectedSnippet` (Object | null): The currently selected lyric snippet for the player to interact with.
 * - `setSelectedSnippet` (Function): A function to update the selected snippet.
 * - `gameData` (Object): The overall game state, containing values like total score and rounds played.
 * - `roundHistory` (Array): A list of past rounds showing the player's progress.
 * - `handleSubmit` (Function): A function to handle submission of whether the player successfully used the snippet.
 * - `handleNextSnippet` (Function): A function to handle the action of moving on to the next snippet.
 * - `game_session_id` (String | null): The game session identifier, used for persistent sessions.
 */

function SinglePlayerGame({
  snippets,
  loading,
  error,
  selectedSnippet,
  setSelectedSnippet,
  gameData,
  roundHistory,
  handleSubmit,
  handleNextSnippet,
  game_session_id
}) {
  // Display an error message if there's an issue loading the snippets
  if (error) return <div>Error loading snippets: {error.message}</div>;

  // Display a loading message while snippets are being fetched
  if (loading) return <div>Loading Snippets...</div>;

  return (
    <GameLayout
      // Main content: either the expanded snippet view or the list of snippet cards
      mainContent={
        selectedSnippet ? (
          <ExpandedSnippet
            snippet={selectedSnippet}
            onSubmit={handleSubmit}
            game_session_id={game_session_id}
            onNext={handleNextSnippet}
          />
        ) : (
          <div className="row">
            {snippets.map(snippet => (
              <div key={snippet.id} className="col-md-6 mb-4">
                <SnippetCard
                  snippet={snippet}
                  onClick={() => setSelectedSnippet(snippet)}
                />
              </div>
            ))}
          </div>
        )
      }

      // Side panel content: the player's progress during the game
      sideContent={
        <GameProgressCard
          totalScore={gameData.totalScore}
          roundsPlayed={gameData.roundsPlayed}
          successfulRoundsCount={gameData.successfulRoundsCount}
          roundHistory={roundHistory}
        />
      }

      // Show side panel
      showSidePanel={true}
    />
  );
}

export default SinglePlayerGame;
