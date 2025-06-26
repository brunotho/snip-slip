import React from 'react';
import GameLayout from './GameLayout';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';

function QuickPlayGame({
  snippets,
  loading,
  error,
  selectedSnippet,
  setSelectedSnippet,
  handleSubmit,
  handleNextSnippet,
  game_session_id,
  mainContent
}) {
  if (error) return <div>Error loading snippets: {error.message}</div>;
  if (loading) return <div>Loading Snippets...</div>;

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
      showSidePanel={false}
    />
  );
}

export default QuickPlayGame;
