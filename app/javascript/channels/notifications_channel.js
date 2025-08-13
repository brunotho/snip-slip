import consumer from "./consumer";

consumer.subscriptions.create("NotificationsChannel", {
  connected() {
    console.log("notifications_channel.js connected() 🟢");
  },

  disconnected() {
    console.log("notifications_channel.js disconnected() 🔴");
  },

  received(data) {
    console.log("Received notification:", data);
    console.log("Current user ID:", getCurrentUserId());
    console.log("Invitation for user ID:", data.player?.id);
    if (data.type === "game_invitation" && data.player.id === getCurrentUserId()) {
      // Broadcast an app-wide event for the portal to handle
      window.dispatchEvent(new CustomEvent('game:invitation', { detail: data }))
    }
  },
  // showGameInvitation removed; handled by React portal
});

function getCurrentUserId() {
  return parseInt(document.body.dataset.currentUserId)
}
