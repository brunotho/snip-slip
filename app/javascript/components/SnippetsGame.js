import React, { useEffect, useState } from 'react';
import QuickPlayGame from './QuickPlayGame';
import SinglePlayerGame from './SinglePlayerGame';
import MultiPlayerGame from './MultiPlayerGame';
import SnippetCard from './SnippetCard';
import ExpandedSnippet from './ExpandedSnippet';

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
        roundHistory: data.round_history
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
        const updatedHistory = [...gameData.roundHistory, newRound];

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
        setGameData(prevData => ({
          ...prevData,
          totalScore: data.game_session.total_score,
          roundsPlayed: data.game_session.rounds_played,
          status: data.game_session.status,
          playerGameOver: data.game_session.player_game_over,
          gameOver: data.game_session.game_over
        }));
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

  // const handleMultiplayerSubmit = async (snippet_id, success) => {
  //   try {
  //     await handleSubmit(snippet_id, success);

  //   } catch (error) {
  //     console.error("Error submitting round (MultiPlayer):", error)
  //   }
  // };

  const mainContent =
    selectedSnippet ? (
      <ExpandedSnippet
        snippet={selectedSnippet}
        onSubmit={gameMode === 'quick' ? handleNextSnippet : handleSubmit}
        game_session_id={game_session_id}
        onNext={handleNextSnippet}
      />
    ) : (
      <div className="row align-self-center gx-1 gy-4" style={{ marginTop: "2vh" }}>
        {snippets.map(snippet => (
          <div
            key={snippet.id}
            className="col-12 col-md-6"
          >
            <SnippetCard
              snippet={snippet}
              onClick={() => setSelectedSnippet(snippet)}
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
    return <div>Loading game...</div>;
  }

  console.log("SNIPPETSGAME before return gameData:", gameData);

  return renderGameMode();
}

export default SnippetsGame;
