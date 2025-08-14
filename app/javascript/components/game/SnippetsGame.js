import React, { useEffect, useState } from 'react';
import GameLayout from './layouts/GameLayout';
import SnippetCard from './snippets/SnippetCard';
import ExpandedSnippet from './snippets/ExpandedSnippet';
import Modal from '../shared/Modal';
import ReportModal from '../reports/ReportModal';
import Loading from '../shared/Loading';
import { useCurrentUser } from '../shared/hooks/useCurrentUser';
import ErrorDisplay from '../shared/ErrorDisplay';
import { createGameSessionChannel } from '../../channels/game_session_channel';

function SnippetsGame({ game_session_id = null, gameMode, gameData, setGameData }) {
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingSnippet, setReportingSnippet] = useState(null);
  
  // External Data
  const [snippets, setSnippets] = useState([]);
  const { userId } = useCurrentUser();

  const fetchSnippets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/fetch_snippets', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch snippets. HTTP error: ${response.status}`);
    }

    const data = await response.json();
    setSnippets(data);
  } catch (error) {
    console.error('Failed to fetch snippets:', error);
    setError(error);
  } finally {
    setLoading(false);
  }
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

      if (!response.ok) {
        throw new Error(`Failed to fetch game session data. HTTP error: ${response.status}`);
      }

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

  useEffect(() => {
    if (gameMode !== 'multi' || !game_session_id) return;

    const gameChannel = createGameSessionChannel(game_session_id);

    gameChannel.received = (data) => {
      if (data.type === "round_completed") {
        setGameData(prevGameData => ({
          ...prevGameData,
          players: {
            ...prevGameData.players,
            [data.player.id]: data.player
          },
          gameOver: data.game_over
        }));
      }
    };

    return () => {
      gameChannel.unsubscribe();
    };
  }, [gameMode, game_session_id, setGameData]);

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

  const isReportingAllowed = Boolean(userId);

  const mainContent = selectedSnippet ? (
    <ExpandedSnippet
      snippet={selectedSnippet}
      onSubmit={gameMode === 'quick' ? handleNextSnippet : handleSubmit}
      game_session_id={game_session_id}
      onNext={handleNextSnippet}
    />
  ) : (
    <div className="snippets-grid">
      {snippets.map(snippet => (
        <div
          key={snippet.id}
          className="snippets-grid-item"
        >
          <SnippetCard
            snippet={snippet}
            onClick={() => setSelectedSnippet(snippet)}
            onLongPress={isReportingAllowed ? () => handleOpenReportModal(snippet) : null}
          />
        </div>
      ))}
    </div>
  )

  const shouldShowProgressBar = gameMode !== 'quick';
  
  // Simplified progress data for the progress bar
  const progressData = shouldShowProgressBar ? {
    currentRound: gameData.roundsPlayed || 0,
    totalRounds: 5,
    isComplete: (gameData.roundsPlayed || 0) >= 5,
    currentUserId: gameData?.currentPlayerId,
    players: gameMode === 'single' ? {
      [gameData.currentPlayerId || 'player1']: {
        id: gameData.currentPlayerId || 'player1',
        name: gameData.currentPlayerName || 'Player',
        total_score: gameData.totalScore || 0,
        rounds_played: gameData.roundsPlayed || 0,
        round_history: gameData.roundHistory || []
      }
    } : (gameData.players || {})
  } : null;

  if (!initialized || loading) {
    return <Loading message="Loading game..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} title="Unable to load snippets" />;
  }

  return (
    <>
      <GameLayout
        mainContent={mainContent}
        showProgressBar={shouldShowProgressBar}
        progressData={progressData}
      />

      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)}>
        <ReportModal
          snippet={reportingSnippet}
          onClose={() => setReportModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default SnippetsGame;
