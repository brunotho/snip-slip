import React, { useState, useEffect } from "react";
import ConstrainedLayout from "./ConstrainedLayout";
import { createGameSessionChannel } from "../channels/game_session_channel";

const GameInviteManager = () => {
  const container = document.getElementById("game-invite-manager");
  const gameSessionId = container.dataset.gameSessionId

  const [friends, setFriends] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("GameInviteManager mounted, gameSessionId:", gameSessionId);
    fetchFriends();
    console.log("About to setup game channel");
    const channel = setupGameChannel();
    console.log("Game channel setup completed");

    return () => {
      if (channel) {
        console.log("Cleaning up lobby channel subscription");
        channel.unsubscribe();
      }
    };
  }, []);

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch('/friendships', {
        headers: {
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch friends");

      const data = await response.json();
      setFriends(data.friends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setLoading(false);
    }
  };

  const setupGameChannel = () => {
    console.log("Setting up game channel for GameInviteManager (lobby)");
    const gameChannel = createGameSessionChannel(gameSessionId);

    // Log when connected
    const originalConnected = gameChannel.connected;
    gameChannel.connected = () => {
      console.log("🎮 Lobby channel connected!");
      if (originalConnected) originalConnected.call(gameChannel);
    };

    gameChannel.received = (data) => {
      console.log("🎮 GameInviteManager (lobby) received update:", data);
      console.log("Current joinedPlayers state:", joinedPlayers);

      if (data.type === "player_joined") {
        console.log("🎮 New player joined lobby:", data.player);
        setJoinedPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers, data.player];
          console.log("🎮 Updated players list:", newPlayers);
          return newPlayers;
        });
      }
    };

    return gameChannel;
  };

  const inviteFriend = async (friendToInvite) => {
    try {
      const response = await fetch(`/game_sessions/${gameSessionId}/invite_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ friend_id: friendToInvite.user_id })
      });

      if (!response.ok) throw new Error("Failed to send invite");

      setInvitedPlayers(prev => [...prev, friendToInvite.user_id]);
    } catch (error) {
      console.error("Error inviting friend:", error);
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch(`/game_sessions/${gameSessionId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        }
      });

      if (!response.ok) throw new Error("Failed to start game");

      window.location.href = `/game_sessions/${gameSessionId}`;
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  if (loading) return <div>Loading Invite Manager...</div>

  console.log("Rendering GameInviteManager with players:", joinedPlayers);

  return (
    <ConstrainedLayout>
      <div className="container mt-4">
        <h3 className="text-center mb-4">Invite Friends to Play</h3>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">Your Friends</div>
              <div className="card-body">
                {friends.length === 0 ? (
                  <p>No friends :((</p>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{friend.name}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => inviteFriend(friend)}
                        disabled={invitedPlayers.includes(friend.user_id)}
                      >
                        {invitedPlayers.includes(friend.user_id) ? 'Invited' : 'Invite'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">Players Joined</div>
              <div className="card-body">
                {joinedPlayers.length === 0 ? (
                  <p>Waiting for players to join...</p>
                ) : (
                  joinedPlayers.map((player) => (
                    <div key={player.id} className="mb-2">
                      {player.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-success btn-lg"
            disabled={joinedPlayers.length === 0}
            onClick={startGame}
          >
            Start Game
          </button>
          <p className="text-muted mt-2">
            {joinedPlayers.length === 0
              ? 'Waiting for at least one friend to join...'
              : `${joinedPlayers.length} player${joinedPlayers.length > 1 ? 's' : ''} joined`
            }
          </p>
        </div>
      </div>
    </ConstrainedLayout>
  );
};

export default GameInviteManager;
