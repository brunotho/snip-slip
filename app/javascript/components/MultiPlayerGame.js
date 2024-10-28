import React, { useState, useEffect, useRef } from "react";
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
  game_session_id,
  players,
  setPlayers
}) {
  // const [players, setPlayers] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    if (!game_session_id) return;
    console.log("initial gameData:", gameData)
    console.log("🤡🤡🤡🤡");
    console.log(selectedSnippet);
    console.log(roundHistory);
    const gameChannel = createGameSessionChannel(game_session_id);

    // updating gameData on every round_submit
    gameChannel.received = (data) => {
      console.log("(useEffect) 🤩 received data:", JSON.stringify(data, null, 2));
      if (data.type === "round_completed") {
        console.log("player:", data.player.id);
        console.log("new data:", JSON.stringify(data.player, null, 2));


        setPlayers(prevPlayers => {
          console.log("prevPlayers:", JSON.stringify(prevPlayers, null, 2));
          const newState = {
            ...prevPlayers,
            [data.player.id]: {
              id: data.player.id,
              name: data.player.name,
              rounds_played: data.player.rounds_played,
              successful_rounds_count: data.player.successful_rounds_count,
              total_score: data.player.total_score,
              round_history: data.player.round_history
            }
          };
          console.log("newState:", JSON.stringify(newState, null, 2));
          return newState;
        });
      }
    };
    ///////////////////////////////////////

    if (!initialized.current) {
      console.log("(useEffect) gameData:", gameData);
      const initialPlayers = {};
      if (gameData.players) {

        gameData.players.forEach(player => {
          initialPlayers[player.id] = {
            id: player.id,
            name: player.name,
            rounds_played: player.rounds_played,
            successful_rounds_count: player.successful_rounds_count,
            total_score: player.total_score
          };
        });
      }
      setPlayers(initialPlayers);
      initialized.current = true;

      console.log("setting initial initialPlayers", initialPlayers);
      console.log("setting initial players", players);
    }

    return () => {
      gameChannel.unsubscribe();
    };
  }, [game_session_id, gameData]);

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
              playerName={gameData.currentPlayerName}
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
                    successfulRoundsCount={player.successful_rounds_count}
                    roundHistory={player.round_history}
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
