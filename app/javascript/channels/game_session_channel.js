import consumer from "./consumer"

export const createGameSessionChannel = (gameSessionId) => {
  console.log("Creating channel for game session:", gameSessionId);

  const channel = consumer.subscriptions.create(
    {
      channel: "GameSessionChannel",
      game_session_id: gameSessionId
    },
    {
      connected() {
        console.log("😁 Connected to game session channel:", gameSessionId);
        // this.perform('ping');
      },

      disconnected() {
        console.log("😅 Disconnected from game session channel:", gameSessionId);
      },

      received(data) {
        console.log("😍 Game session channel received:", data);
        switch(data.type) {
          case "player_joined":
            console.log("Player joined:", data.player.name);
            break;
          case "player_left":
            console.log("Player left:", data.player.name);
            break;
          case "round_completed":
            console.log("Round completed:", data.player.name);
            break;
          default:
            console.log("Unknown message type:", data.type);
        }
          return data;
      },

      // ping() {
      //   console.log("Sending ping to game channel");
      //   this.perform('ping');
      // },

      updateGameSessionState(gameSessionState) {
        this.perform('update_game_session_state', gameSessionState)
      }
    }
  );

  // Store the original received callback from GameInviteManager
  const originalReceived = channel.received;

  channel.received = (data) => {
    console.log("😥😥😥 Channel received data before processing:", data);
    if (originalReceived) {
      originalReceived.call(channel, data);
    }
  };

  console.log("SUBBED to:", channel)
  return channel;
};
