import React, { useState, useEffect } from "react";
import { createGameSessionChannel } from "../../../channels/game_session_channel";
import ConstrainedLayout from "../../shared/ConstrainedLayout";
import Loading from "../../shared/Loading";
import FriendsList from "./parts/FriendsList";
import PlayersList from "./parts/PlayersList";
import GameControls from "./parts/GameControls";

const GameInviteManager = () => {
  const container = document.getElementById("game-invite-manager");
  const gameSessionId = container.dataset.gameSessionId

  // UI State
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  
  // External Data
  const [friends, setFriends] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);

  useEffect(() => {
    fetchInitialState();
    fetchFriends();
    
    const channel = setupGameChannel();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const fetchInitialState = async () => {
    try {
      if (!gameSessionId) {
        return;
      }

      const response = await fetch(`/game_sessions/${gameSessionId}.json`, {
        headers: {
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
      });
      

      if (!response || !response.ok) {
        throw new Error(`Failed to fetch initial state: ${response ? response.statusText : 'No response'}`);
      }

      const data = await response.json();      

      setIsHost(data.is_host);

      if (data.players) {
        setJoinedPlayers(Object.values(data.players).map(player => ({
          id: player.id,
          name: player.name
        })));
        
      } else {
        // Handle no players case
      }
    } catch (error) {
      // Silently handle initial state fetch errors
    }
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
      // Silently handle friends fetch errors
      setLoading(false);
    }
  };

  const setupGameChannel = () => {
    const gameChannel = createGameSessionChannel(gameSessionId);

    const originalConnected = gameChannel.connected;
    gameChannel.connected = () => {
      
      if (originalConnected) originalConnected.call(gameChannel);
    };

    gameChannel.received = (data) => {
      if (data.type === "player_joined") {
        setJoinedPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers, data.player];
          
          return newPlayers;
        });
      }
      else if (data.type === "game_start") {
        window.location.href = `/game_sessions/${gameSessionId}`;
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
      // Silently handle invite errors
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

      const data = await response.json();
      
      // window.location.href = `/game_sessions/${gameSessionId}`;
    } catch (error) {
      // Silently handle start game errors
    }
  };

  if (loading) {
    return (
      <ConstrainedLayout>
        <Loading message="Loading lobby..." />
      </ConstrainedLayout>
    );
  }

  return (
    <ConstrainedLayout>
      <div className="lobby-container">
        <h3 className="lobby-title">
          {isHost ? "Invite Friends to Play" : "Waiting for Game to Start"}
        </h3>

        <div className="lobby-grid row">
          {isHost && (
            <div className="lobby-card-host">
              <div className="card-elevated lobby-card">
                <div className="card-header-custom">Your Friends</div>
                <div className="card-body-custom">
                  <FriendsList
                    friends={friends}
                    invitedPlayers={invitedPlayers}
                    onInviteFriend={inviteFriend}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`lobby-card-players ${isHost ? 'is-host' : ''}`}>
            <div className="card-elevated lobby-card">
              <div className="card-header-custom">Players</div>
              <div className="card-body-custom">
                <PlayersList joinedPlayers={joinedPlayers} />
              </div>
            </div>
          </div>
        </div>

        <GameControls
          isHost={isHost}
          joinedPlayers={joinedPlayers}
          onStartGame={startGame}
        />
      </div>
    </ConstrainedLayout>
  );
};

export default GameInviteManager;
