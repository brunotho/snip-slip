import consumer from "./consumer"

export const createGameSessionChannel = (gameSessionId) => {


  const channel = consumer.subscriptions.create(
    {
      channel: "GameSessionChannel",
      game_session_id: gameSessionId
    },
    {
      connected() {
        console.log("game_session_channel.js connected() 🟢:", gameSessionId);
      },

      disconnected() {
        console.log("game_session_channel.js disconnected() 🔴:", gameSessionId);
      },

      received(data) {
        console.log("GAMESESSIONCHANNEL received data 😍:", data);
        switch(data.type) {
          case "player_joined":
            
            break;
          case "player_left":
            
            break;
          case "round_completed":
            
            break;
          default:
            
        }
          return data;
      },

      updateGameSessionState(gameSessionState) {
        this.perform('update_game_session_state', gameSessionState)
      }
    }
  );

  const originalReceived = channel.received;

  channel.received = (data) => {
    if (originalReceived) {
      originalReceived.call(channel, data);
    }
  };

  return channel;
};
