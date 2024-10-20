import consumer from "./consumer"

const gameSessionChannel = consumer.subscriptions.create("GameSessionChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the game session channel");

  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("Received data:", data);

    // Called when there's incoming data on the websocket for this channel
  }
});

export default gameSessionChannel;
f
