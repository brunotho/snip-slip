import React, { useEffect, useState } from 'react';
import QuickPlayGame from './QuickPlayGame';
import SinglePlayerGame from './SinglePlayerGame';
import MultiPlayerGame from './MultiPlayerGame';

/**
 * SnippetsGame Component
 *
 * This component acts as a controller for different game modes in the app.
 * It handles fetching snippets and game session data, managing the current
 * selected snippet, and determining which game mode to display (quick play,
 * single player, or multiplayer).
 *
 * Props:
 * - `game_session_id` (String): The ID of the current game session, passed from the backend.
 * - `onSnippetComplete` (Function): Callback to handle actions when a snippet is completed.
 * - `gameMode` (String): The current mode of the game, which can be 'quick', 'single', or 'multi'.
 *
 * State:
 * - `snippets` (Array): The list of lyric snippets available for the game.
 * - `loading` (Boolean): Whether the snippet data is currently being fetched.
 * - `error` (Object): Holds any error information during snippet fetching.
 * - `selectedSnippet` (Object): The snippet currently selected by the player.
 * - `gameData` (Object): Contains key game metrics like total score, rounds played, and status.
 * - `roundHistory` (Array): The history of rounds played by the player in the game.
 *
 * Usage:
 * - Fetches and manages snippets data for different game modes.
 * - Depending on the game mode, renders either QuickPlay, SinglePlayer, or MultiPlayer.
 */

function SnippetsGame({
  game_session_id = null,
  onSnippetComplete,
  gameMode = 'quick',
  gameData,
  setGameData,
  players,
  setPlayers
}) {
  // State for managing snippets, loading state, errors, selected snippet, and game data
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  // const [gameData, setGameData] = useState({
  //   totalScore: 0,
  //   roundsPlayed: 0,
  //   successfulRoundsCount: 0,
  //   status: true
  // });
  const [roundHistory, setRoundHistory] = useState([]);

  // Fetch available snippets from the server
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

  // Fetch game session data from the server
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
        console.log('fetchGameSessionData (SnippetsGame):', data);
        setGameData({
          // ...prevGameData,
          totalScore: data.total_score,
          roundsPlayed: data.rounds_played,
          successfulRoundsCount: data.successful_rounds_count,
          status: data.status,
          currentPlayerId: data.current_player_id,
          currentPlayerName: data.current_player_name,
          players: data.players,
          game_session_id: data.game_session_id
        });
      })
      .catch(error => {
        console.error("Error fetching game session data:", error);
      });
  };

  // Fetch snippets when the component mounts or game session ID changes
  useEffect(() => {
    console.log("SnippetsGame from inside ☑");
    if (game_session_id) {
      fetchGameSessionData();
    }
    fetchSnippets();
  }, [game_session_id]);

  // Handle advancing to the next snippet in Quick Play
  const handleNextSnippet = () => {
    setSelectedSnippet(null);
    fetchSnippets();
  };

  // Handle submission of a snippet round (success/fail)
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
        throw new Error("Round submission failed!!");
      }

      const data = await response.json();
      console.log("Round submission response:", data);

      const newGameData = {
        ...gameData,
        totalScore: data.game_session.total_score,
        roundsPlayed: data.game_session.rounds_played,
        successfulRoundsCount: data.game_session.successful_rounds_count,
        status: data.game_session.status
      };
      setGameData(newGameData);

      const newRound = {
        lyric_snippet: selectedSnippet,
        score: data.round.score,
        success: data.round.success
      };
      const updatedHistory = [...roundHistory, newRound];
      setRoundHistory(updatedHistory);

      // Check if the game is over and handle completion
      if (data.game_session.player_game_over) {
        onSnippetComplete({
          // totalScore: data.game_session.total_score,
          // roundsPlayed: data.game_session.rounds_played,
          // successfulRoundsCount: data.game_session.successful_rounds_count,
          ...newGameData,
          roundHistory: updatedHistory,
          gameOver: data.game_session.game_over,
          playerGameOver: data.game_session.player_game_over
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
  // end of handleSubmit

  // Fetch the CSRF token for secure API requests
  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  // Props shared across game modes
  const gameProps = {
    snippets,
    loading,
    error,
    selectedSnippet,
    setSelectedSnippet,
    gameData,
    setGameData,
    roundHistory: gameMode === 'quick' ? [] : roundHistory,
    handleSubmit: gameMode === 'quick' ? null : handleSubmit,
    handleNextSnippet: gameMode === 'quick' ? handleNextSnippet : null,
    game_session_id: gameMode === 'quick' ? null : game_session_id,
    ...(gameMode === 'multi' ? { players, setPlayers } : {} )
  };


  // Render the appropriate game mode component based on `gameMode` prop
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

  return renderGameMode();
}

export default SnippetsGame;
