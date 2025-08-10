import React from 'react';

function FriendsList({ friends, invitedPlayers, onInviteFriend }) {
  if (friends.length === 0) {
    return <p>No friends :((</p>;
  }

  return (
    friends.map((friend) => (
      <div key={friend.id} className="d-flex justify-content-between align-items-center mb-2">
        <span>{friend.name}</span>
        <button
          className="btn btn-accent btn-sm"
          onClick={() => onInviteFriend(friend)}
          disabled={invitedPlayers.includes(friend.user_id)}
        >
          {invitedPlayers.includes(friend.user_id) ? 'Invited' : 'Invite'}
        </button>
      </div>
    ))
  );
}

export default FriendsList; 