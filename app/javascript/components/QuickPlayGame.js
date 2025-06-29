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
      showProgressBar={false}
    />
  );
}

export default QuickPlayGame;
