import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';
import GameProgressCard from './GameProgressCard';

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

  return (
    <GameLayout
      mainContent={
        // selectedSnippet ? (
        //   <ExpandedSnippet
        //     snippet={selectedSnippet}
        //     onSubmit={handleSubmit}
        //     game_session_id={game_session_id}
        //     onNext={handleNextSnippet}
        //   />
        // ) : (
        //   <div className="row">
        //     {snippets.map(snippet => (
        //       <div key={snippet.id} className="col-md-6 mb-4">
        //         <SnippetCard
        //           snippet={snippet}
        //           onClick={() => setSelectedSnippet(snippet)}
        //         />
        //       </div>
        //     ))}
        //   </div>
        // )
        mainContent
      }
      sideContent={
        <GameProgressCard
          totalScore={gameData.totalScore}
          roundsPlayed={gameData.roundsPlayed}
          roundHistory={gameData.roundHistory}
        />
      }
      showSidePanel={false}
    />
  );
}

export default SinglePlayerGame;
