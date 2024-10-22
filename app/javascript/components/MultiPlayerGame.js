import react, { useState, useEffect } from "react";
import GameLayout from "./GameLayout";
import SnippetCard from "./SnippetCard";
import ExpandedSnippet from "./ExpandedSnippet";
import GameProgressCard from "./GameProgressCard";
import { createGameSessionChannel } from "../channels/game_session_channel";

function MultiPlayerGame({
  snippepts,
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
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (game_session_id) {
      const gameChannel = createGameSessionChannel(game_session_id);

      const enhancedChannel = {
        ...gameChannel,
        received: (data) => {
          console.log("Received game update:", data);
          handleGameUpdate(data);
        }
      };

      setChannel(enhancedChannel);

      return () => {
        gameChannel.unsubscribe();
      };
    }
  }, [game_session_id]);


  const handleGameUpdate = (data) => {
    switch (data.action) {
      case 'player_joined':
        setPlayers(prevPlayers => ({
          ...prevPlayers,
          [data.player.id]: data.player
        }));
        break;

      case 'player_left':
        setPlayers(prevPlayers => {
          const updatedPlayers = { ...prevPlayers };
          delete updatedPlayers[data.player_id];
          return updatedPlayers;
        });
        break;

      case 'round_completed':
        setPlayers(prevPlayers => ({
          ...prevPlayers,
          [data.player.id]: {
            ...prevPlayers[data.player.id],
            rounds_played: data.player.rounds_played,
            successful_rounds_count: data.player.successful_rounds_count,
            total_score: data.palyer.total_score
          }
        }));
        break;

      default:
        console.log("Unknown game update type:", data);
    }
  };


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
            onsubmit={handleMultiplayerSubmit}
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
