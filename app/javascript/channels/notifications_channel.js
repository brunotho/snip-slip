import consumer from "./consumer";

consumer.subscriptions.create("NotificationsChannel", {
  connected() {
    console.log("Connected to notifications channel");
  },

  disconnected() {
    console.log("Discoonected from notifications channel");
  },

  received(data) {
    console.log("Received notification:", data);
    if (data.type === "game_invitation" && data.player.id === getCurrentUserId()) {
      this.showGameInvitation(data)
    }

  },

  showGameInvitation(data) {
    const acceptInvitation = () => {
      const token = document.querySelector('[name="csrf-token"]').content;

      fetch(`/game_sessions/${data.game_session_id}/accept_invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        },
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/game_sessions/${data.game_session_id}`;
        }
      })
      .catch(error => console.error('Error accepting invitation:', error));
    }

    const modal = document.createElement('div')
    modal.innerHTML = `
      <div class="modal fade" id="gameInviteModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Game Invitation</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${data.inviter.name} has invited you to join a game!
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Decline</button>
              <button
                type="button"
                class="btn btn-primary"
                id="acceptButton"
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    const modalElement = document.getElementById('gameInviteModal')
    document.getElementById('acceptButton').addEventListener('click', acceptInvitation)
    const bsModal = new window.bootstrap.Modal(modalElement)
    bsModal.show()
  }

})

function getCurrentUserId() {
  return parseInt(document.body.dataset.currentUserId)
}
