import React, { useEffect, useState } from 'react';
import QuickPlayGame from './QuickPlayGame';
import SinglePlayerGame from './SinglePlayerGame';
import MultiPlayerGame from './MultiPlayerGame';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';
import Modal from './Modal';
import ReportModal from './ReportModal';
import { SkeletonSnippetCard } from './SkeletonLoader';

function SnippetsGame({
  game_session_id = null,
  gameMode,
  gameData,
  setGameData
}) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingSnippet, setReportingSnippet] = useState(null);

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

  const fetchGameSessionData = async () => {
    if (!game_session_id) return;

    try {
      const response = await fetch(`/game_sessions/${game_session_id}.json`, {
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json();

      setGameData({
        totalScore: data.total_score,
        roundsPlayed: data.rounds_played,
        status: data.status,
        currentPlayerId: data.current_player_id,
        currentPlayerName: data.current_player_name,
        players: data.players,
        game_session_id: data.game_session_id,
        roundHistory: data.round_history || []
      });
    } catch (error) {
      console.error("Error fetching game session data:", error);
    }
  };

  useEffect(() => {
    async function init() {
      if (game_session_id) {
        await fetchGameSessionData();
      }
      await fetchSnippets();
      setInitialized(true);
    }
    init();
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
          "X-Requested-With": "XMLHttpRequest",
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
        throw new Error("Round submission failed!");
      }

      const data = await response.json();

      if (gameMode === 'single') {
        const newRound = {
          lyric_snippet: { snippet: selectedSnippet.snippet },
          success: data.round.success
        };
        const updatedHistory = [...(gameData.roundHistory || []), newRound];

        const newGameData = {
          ...gameData,
          totalScore: data.game_session.total_score,
          roundsPlayed: data.game_session.rounds_played,
          status: data.game_session.status,
          roundHistory: updatedHistory
        };
        setGameData(newGameData);
      }

      if (data.game_session.player_game_over) {
        // Fetch complete final game state when game ends
        try {
          const finalResponse = await fetch(`/game_sessions/${game_session_id}.json`, {
            headers: {
              "Accept": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          const finalData = await finalResponse.json();
          
          setGameData(prevData => ({
            ...prevData,
            totalScore: finalData.total_score,
            roundsPlayed: finalData.rounds_played,
            status: finalData.status,
            players: finalData.players,
            roundHistory: finalData.round_history || [],
            playerGameOver: data.game_session.player_game_over,
            gameOver: data.game_session.game_over
          }));
        } catch (error) {
          console.error("Error fetching final game state:", error);
          // Fallback to partial update
        setGameData(prevData => ({
          ...prevData,
          totalScore: data.game_session.total_score,
          roundsPlayed: data.game_session.rounds_played,
          status: data.game_session.status,
          playerGameOver: data.game_session.player_game_over,
          gameOver: data.game_session.game_over
        }));
        }
        return;
      }

      setSelectedSnippet(null);
      await fetchSnippets();

    } catch (error) {
      console.error("Error submitting round:", error);
    }
  };

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const handleOpenReportModal = (snippet) => {
    if (snippet.already_reported) {
      alert('This snippet has already been reported');
      return;
    }
    setReportingSnippet(snippet);
    setReportModalOpen(true);
  };

  const mainContent =
    selectedSnippet ? (
      <ExpandedSnippet
        snippet={selectedSnippet}
        onSubmit={gameMode === 'quick' ? handleNextSnippet : handleSubmit}
        game_session_id={game_session_id}
        onNext={handleNextSnippet}
      />
    ) : loading ? (
      <div className="row align-self-center gx-0 gx-md-2 gy-3" style={{ marginTop: "0", width: "100%", maxWidth: "100%", padding: "0 1rem" }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="col-12 col-md-6"
            style={{ maxWidth: "100%" }}
          >
            <SkeletonSnippetCard />
          </div>
        ))}
      </div>
    ) : (
      <div className="row align-self-center gx-0 gx-md-2 gy-3" style={{ marginTop: "0", width: "100%", maxWidth: "100%", padding: "0 1rem" }}>
        {snippets.map(snippet => (
          <div
            key={snippet.id}
            className="col-12 col-md-6"
            style={{ maxWidth: "100%" }}
          >
            <SnippetCard
              snippet={snippet}
              onClick={() => setSelectedSnippet(snippet)}
              onLongPress={gameMode === 'quick' ? null : () => handleOpenReportModal(snippet)}
            />
          </div>
        ))}
      </div>
    )

  const gameProps = {
    snippets,
    loading,
    error,
    selectedSnippet,
    setSelectedSnippet,
    gameData,
    setGameData,
    handleSubmit: gameMode === 'quick' ? null : handleSubmit,
    handleNextSnippet: gameMode === 'quick' ? handleNextSnippet : null,
    game_session_id: gameMode === 'quick' ? null : game_session_id,
    mainContent
  };

  const renderGameMode = () => {
    switch (gameMode) {
      case 'single':
        return <SinglePlayerGame {...gameProps} />;
      case 'multi':
        return <MultiPlayerGame {...gameProps} />;
      case 'quick':
      default:
        return <QuickPlayGame {...gameProps} />;
    }
  };

  if (!initialized) {
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

  console.log("SNIPPETSGAME before return gameData:", gameData);

  return (
    <>
      {renderGameMode()}

      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)}>
        <ReportModal
          snippet={reportingSnippet}
          onSubmit={() => {}}
          onClose={() => setReportModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default SnippetsGame;
