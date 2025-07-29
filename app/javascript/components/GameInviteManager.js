import React, { useState, useEffect } from "react";
import ConstrainedLayout from "./ConstrainedLayout";
import { createGameSessionChannel } from "../channels/game_session_channel";

const GameInviteManager = () => {
  const container = document.getElementById("game-invite-manager");
  const gameSessionId = container.dataset.gameSessionId

  const [isHost, setIsHost] = useState(false);
  const [friends, setFriends] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="skeleton-circle skeleton-circle-lg"></div>
          <div className="skeleton-line" style={{ width: '250px' }}></div>
          <div className="skeleton-line skeleton-line-sm" style={{ width: '180px' }}></div>
        </div>
      </ConstrainedLayout>
    );
  }

  return (
    <ConstrainedLayout>
      <div className="container mt-4">
        <h3 className="text-center mb-4">
          {isHost ? "Invite Friends to Play" : "Waiting for Game to Start"}
        </h3>

        <div className="row">
          {isHost && (
            <div className="col-md-6">
              <div className="card-elevated mb-4">
                <div className="card-header-custom">Your Friends</div>
                <div className="card-body-custom">
                  {friends.length === 0 ? (
                    <p>No friends :((</p>
                  ) : (
                    friends.map((friend) => (
                      <div key={friend.id} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{friend.name}</span>
                        <button
                          className="btn btn-accent btn-sm"
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
          )}

          <div className={isHost ? "col-md-6" : "col-md-8 mx-auto"}>
            <div className="card-elevated mb-4">
              <div className="card-header-custom">Players Joined</div>
              <div className="card-body-custom">
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
          {isHost ? (
            <button
              className="btn btn-accent-emphasized btn-lg"
              disabled={joinedPlayers.length < 2}
              onClick={startGame}
            >
              Start Game
            </button>
          ) : (
            <div className="alert alert-info">
              Waiting for host to start the game...
            </div>
          )}
          <p className="text-muted mt-2">
            {joinedPlayers.length < 2
              ? 'Waiting for players to join...'
              : `${joinedPlayers.length} players ready`
            }
          </p>
        </div>
      </div>
    </ConstrainedLayout>
  );
};

export default GameInviteManager;
