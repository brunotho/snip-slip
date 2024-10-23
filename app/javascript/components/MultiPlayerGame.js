import React, { useState, useEffect } from "react";
import GameLayout from "./GameLayout";
import SnippetCard from "./SnippetCard";
import ExpandedSnippet from "./ExpandedSnippet";
import GameProgressCard from "./GameProgressCard";
import { createGameSessionChannel } from "../channels/game_session_channel";

function MultiPlayerGame({
  snippets,
  loading,
  error,
  selectedSnippet,
  setSelectedSnippet,
  gameData,
  roundHistory,
  handleSubmit,
  game_session_id
}) {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    if (game_session_id) {
      const gameChannel = createGameSessionChannel(game_session_id);

      gameChannel.received = (data) => {
        console.log("MultiPlayerGame received update:", data);
        if (data.type === "round_completed") {
          setPlayers(prevPlayers => ({
            ...prevPlayers,
            [data.player.id]: {
              ...prevPlayers[data.player.id],
              rounds_played: data.player.rounds_played,
              successful_rounds_count: data.player.successful_rounds_count,
              total_score: data.player.total_score
            }
          }));
        }
      };

      return () => {
        gameChannel.unsubscribe();
      };
    }
  }, [game_session_id]);

  const handleMultiplayerSubmit = async (snippet_id, success) => {
    try {
      await handleSubmit(snippet_id, success);

    } catch (error) {
      console.error("Error submitting round (mp):", error)
    }
  };

  if (error) return <div>Error loading snippets: {error.message}</div>;
  if (loading) return <div>Loading snippets... </div>;

  return (
    <GameLayout
      mainContent={
        selectedSnippet ? (
          <ExpandedSnippet
            snippet={selectedSnippet}
            onSubmit={handleMultiplayerSubmit}
            game_session_id={game_session_id}
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
      sideContent={
        <div className="multiplayer-progress">
          <div className="mb-4">
            <h4>Your Progress</h4>
            <GameProgressCard
              totalScore={gameData.totalScore}
              roundsPlayed={gameData.roundsPlayed}
              successfulRoundsCount={gameData.successfulRoundsCount}
              roundHistory={roundHistory}
            />
          </div>

          <div>
            <h4>Other Players</h4>
            {Object.values(players)
              .filter(player => player.id !== gameData.currentPlayerId)
              .map(player => (
                <div key={player.id} className="mb-3">
                  <GameProgressCard
                    playerName={player.name}
                    totalScore={player.total_score}
                    roundsPlayed={player.rounds_played}
                    successfulRoundsCount={player.rounds_played}
                    roundHistory={[]}
                  />
                </div>
              ))}
          </div>
        </div>
      }
      showSidePanel={true}
    />
  );
}

export default MultiPlayerGame;
