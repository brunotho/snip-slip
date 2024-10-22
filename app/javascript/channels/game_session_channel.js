import consumer from "./consumer"

export const createGameSessionChannel = (gameSessionId) => {
  return consumer.subscriptions.create({ channel: "GameSessionChannel", game_session_id: gameSessionId }, {
    connected() {
      console.log("Connected to the game session channel")
    },

    disconnected() {
      console.log("Disconneczed from the game session channel")
    },

    received(data) {
      console.log("Received data", data)
    },

    updateGameSessionState(gameSessionState) {
      this.perform('update_game_session_state', gameSessionState)
    }
  })
}
