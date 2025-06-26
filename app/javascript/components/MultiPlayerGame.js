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
  setGameData,
  handleSubmit,
  game_session_id,
  mainContent
}) {
  // const initialized = useRef(false);

  useEffect(() => {
    if (!game_session_id) return;

    console.log("🤡🤡🤡🤡");
    console.log("MULTIPLAYER initial gameData:", gameData)

    const gameChannel = createGameSessionChannel(game_session_id);

    // updating gameData on every round_submit
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
      console.log("UNSUBBED");
    };
  }, [game_session_id, gameData]);

  // const handleMultiplayerSubmit = async (snippet_id, success) => {
  //   try {
  //     await handleSubmit(snippet_id, success);

  //   } catch (error) {
  //     console.error("Error submitting round (MultiPlayer):", error)
  //   }
  // };

  if (error) return <div>Error loading snippets: {error.message}</div>;
  if (loading) return <div>Loading snippets... </div>;

  console.log("MULTIPLAYER before return gameData 🌷🌷🌷:", gameData)

  return (
    <GameLayout
      mainContent={
        // selectedSnippet ? (
        //   <ExpandedSnippet
        //     snippet={selectedSnippet}
        //     // onSubmit={handleMultiplayerSubmit}
        //     onSubmit={handleSubmit}
        //     game_session_id={game_session_id}
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
      sideContent={
        <div className="multiplayer-progress">
          <div className="mb-4">
            <GameProgressCard
              playerName={gameData.players[gameData.currentPlayerId].name}
              totalScore={gameData.players[gameData.currentPlayerId].total_score}
              roundsPlayed={gameData.players[gameData.currentPlayerId].rounds_played}
              roundHistory={gameData.players[gameData.currentPlayerId].round_history}
            />
          </div>

          <div>
            {Object.values(gameData.players)
              .filter(player => player.id !== gameData.currentPlayerId)
              .map(player => (
                <div key={player.id} className="mb-3">
                  <GameProgressCard
                    playerName={player.name}
                    totalScore={player.total_score}
                    roundsPlayed={player.rounds_played}
                    roundHistory={player.round_history}
                  />
                </div>
              ))}
          </div>
        </div>
      }
      showSidePanel={false}
    />
  );
}

export default MultiPlayerGame;
