import React, { useEffect, useState } from 'react';
// import SnippetCard from './SnippetCard';
// import ExpandedSnippet from './ExpandedSnippet';
// import GameProgressCard from './GameProgressCard';
import QuickPlayGame from './QuickPlayGame';
import SinglePlayerGame from './SinglePlayerGame';
import MultiPlayerGame from './MultiPlayerGame';

function SnippetsGame({ game_session_id = null, onSnippetComplete, gameMode = 'quick' }) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [gameData, setGameData] = useState({
    totalScore: 0,
    roundsPlayed: 0,
    successfulRoundsCount: 0,
    status: true
  });
  const [roundHistory, setRoundHistory] = useState([]);

  const fetchSnippets = () => {
    setLoading(true);
    fetch('/fetch_snippets', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then(response => response.json())
      .then(data => {
        setSnippets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching snippets:', error);
        setError(error);
        setLoading(false);
      });
  };

  const fetchGameSessionData = () => {
    if (!game_session_id) return;

    fetch(`/game_sessions/${game_session_id}.json`, {
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('game session data:', data);
        setGameData({
          totalScore: data.total_score,
          roundsPlayed: data.rounds_played,
          successfulRoundsCount: data.successful_rounds_count,
          status: data.status
        });
      })
    .catch(error => {
      console.error("Error fetching game session data:", error);
    });
  };

  useEffect(() => {
    console.log("SnippetsGame component mounted");
    if (game_session_id) {
      fetchGameSessionData();
    }
    fetchSnippets();
  }, [game_session_id]);

  const handleNextSnippet = () => {
    setSelectedSnippet(null);
    fetchSnippets();
  };

  const handleSubmit = async (snippet_id, success) => {
    if (!game_session_id || snippet_id === null) {
      setSelectedSnippet(null);
      return;
    }

    try {
      const response = await fetch(`/game_sessions/${game_session_id}/rounds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'XMLHttpRequest',
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({
          round: {
            lyric_snippet_id: snippet_id,
            success: success,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Round submission failed!!")
      }

      const data = await response.json();
      console.log("Round submission response:", data);

      const newGameData = {
        totalScore: data.total_score,
        roundsPlayed: data.rounds_played,
        successfulRoundsCount: data.successful_rounds_count,
        status: data.status
      };
      setGameData(newGameData);

      const newRound = {
        lyric_snippet: selectedSnippet,
        score: data.round.score,
        success: data.round.success
      }
      const updatedHistory = [...roundHistory, newRound];
      setRoundHistory(updatedHistory);

      if (!data.status || data.rounds_played >= 5) {
        console.log("Exit Snippetgame.js with data for game over component", newGameData);
        console.log(updatedHistory);
        console.log("😎");

        onSnippetComplete({
          totalScore: data.total_score,
          roundsPlayed: data.rounds_played,
          successfulRoundsCount: data.successful_rounds_count,
          roundHistory: updatedHistory
        });
        return;
      }

      setSelectedSnippet(null);
      await fetchSnippets();

    } catch (error) {
      console.error("Error submitting round", error);
      alert("Error while submitting round!!");
    }
  };

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const gameProps = {
    snippets,
    loading,
    error,
    selectedSnippet,
    setSelectedSnippet,
    gameData,
    roundHistory: gameMode === 'quick' ? [] : roundHistory,
    handleSubmit: gameMode === 'quick' ? null : handleSubmit,
    handleNextSnippet: gameMode === 'quick' ? handleNextSnippet : null,
    game_session_id: gameMode === 'quick' ? null : game_session_id,
  };

  // if (error) return <div>Error loading snippets: {error.message}</div>;
  // if (loading) return <div>Loading snippets...</div>;

  const renderGameMode = () => {
    switch(gameMode) {
      case 'single':
        return <SinglePlayerGame {...gameProps} />;
      case 'multi':
        return <MultiPlayerGame { ...gameProps} />;
      case 'quick':
      default:
        return <QuickPlayGame {...gameProps} />;
    }
  };

  return renderGameMode();

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row">
//         <div className="col-md-9">
//           {selectedSnippet ? (
//             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//               <ExpandedSnippet
//                 snippet={selectedSnippet}
//                 onSubmit={handleSubmit}
//                 game_session_id={game_session_id}
//                 onNext={handleNextSnippet}
//               />
//             </div>
//           ) : (
//             <div className="row">
//               {snippets.map(snippet => (
//                 <div key={snippet.id} className="col-md-6 mb-4">
//                   <SnippetCard
//                     snippet={snippet}
//                     onClick={() => setSelectedSnippet(snippet)}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="col-md-3">
//           <div className="sticky-top" style={{ top: '20px' }}>
//             <GameProgressCard
//               totalScore={gameData.totalScore}
//               roundsPlayed={gameData.roundsPlayed}
//               successfulRoundsCount={gameData.successfulRoundsCount}
//               roundHistory={roundHistory}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
}

export default SnippetsGame;
