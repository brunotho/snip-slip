import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';

/**
 * QuickPlayGame Component
 *
 * This component renders the "Quick Play" mode of the game, handling the display
 * and selection of snippets, as well as submission of snippet success/fail actions.
 * It uses a `GameLayout` to structure the content and passes down props related
 * to snippets, game data, and event handlers.
 *
 * Props:
 * - `snippets` (Array): Array of snippet objects fetched from the backend to display.
 * - `loading` (Boolean): Indicates whether the snippets are currently being fetched.
 * - `error` (Object): Holds any error information related to the snippet fetching process.
 * - `selectedSnippet` (Object): Currently selected snippet for the game.
 * - `setSelectedSnippet` (Function): Function to update the selected snippet.
 * - `handleSubmit` (Function): Function to submit the result of the current snippet (success/fail).
 * - `handleNextSnippet` (Function): Function to trigger fetching the next snippet.
 * - `game_session_id` (String): Not used in Quick Play but passed for compatibility with other game modes.
 *
 * States:
 * - Displays loading state while snippets are being fetched.
 * - Displays error state if fetching snippets fails.
 * - Shows a list of snippets to select from if no snippet is selected.
 * - Once a snippet is selected, renders the `ExpandedSnippet` component for user actions.
 *
 * Usage:
 * - Use for single-player "Quick Play" mode without game sessions.
 * - Handles snippet selection and action submission.
 */

function QuickPlayGame({
  snippets,
  loading,
  error,
  selectedSnippet,
  setSelectedSnippet,
  handleSubmit,
  handleNextSnippet,
  game_session_id
}) {
  // Handle error and loading states
  if (error) return <div>Error loading snippets: {error.message}</div>;
  if (loading) return <div>Loading Snippets...</div>;

  return (
    <GameLayout
      mainContent={
        selectedSnippet ? (
          // Display the selected snippet and allow submission
          <ExpandedSnippet
            snippet={selectedSnippet}
            onSubmit={handleSubmit}
            game_session_id={game_session_id}
            onNext={handleNextSnippet}
          />
        ) : (
          // Show a list of snippets to choose from
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
    />
  );
}

export default QuickPlayGame;
