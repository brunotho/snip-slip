import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import ConstrainedLayout from './ConstrainedLayout';

const FriendshipManager = () => {
  const container = document.getElementById("friendship-manager");
  const initialData = JSON.parse(container.dataset.friendships || "{}");

  const [friends, setFriends] = useState(initialData.friends || []);
  const [pendingRequests, setPendingRequests] = useState(initialData.pending_requests || []);
  const [receivedRequests, setReceivedRequests] = useState(initialData.received_requests || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = debounce((term) => searchUsers(term), 300);

  useEffect(() => {
  }, []);

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const fetchFriendships = async () => {
    try {
      console.log("fetching friendships");

      const response = await fetch('/friendships', {
        headers: {
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch friendships');
      }
      const data = await response.json();
      console.log("fetched friendship data:", data);

      setFriends(data.friends);
      setPendingRequests(data.pending_requests);
      setReceivedRequests(data.received_requests);
    } catch (error) {
      console.error("Error fetching friendships:", error);
    }
  };

  const searchUsers = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      console.log("Sending search request for:", term);
      const response = await fetch(`/users/search?q=${encodeURIComponent(term)}`, {
        headers: {
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
      });
      console.log("Search response status:", response.status);
      if (!response.ok) {
        // const text = await response.text();
        // console.error("Server response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Search results:", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await fetch('/friendships', {
        method: "POST",
        headers: {
          "Accept": 'application/json',
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ friend_id: userId })
      });
      fetchFriendships();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptFriendRequest = async (friendshipId) => {
    try {
      console.log("accepting friend request for id:", friendshipId);

      const response = await fetch(`/friendships/${friendshipId}`, {
        method: "PATCH",
        headers: {
          "Accept": 'application/json',
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        if (data.updated_data) {
          console.log("updating state with new data");

          setFriends(data.updated_data.friends);
          setPendingRequests(data.updated_data.pending_requests);
          setReceivedRequests(data.updated_data.received_requests);
        } else {
          console.log("no updated data, fetching friendships");

          await fetchFriendships();
        }
      } else {
        console.error("Error accepting friend request (1)");
      }
    } catch (error) {
      console.error("Error accepting friend request (2)", error)
    }
  };

  const declineFriendRequest = async (friendshipId) => {
    try {
      await fetch(`/friendships/${friendshipId}`, {
        method: "PATCH",
        headers: {
          "Accept": 'application/json',
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ status: "declined" }),
      });
      fetchFriendships();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const removeFriend = async (friendshipId) => {
    try {
      const response = await fetch(`/friendships/${friendshipId}`, {
        method: "DELETE",
        headers: {
          // "Accept": 'application/json',
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
      });
      if (response.ok) {

        fetchFriendships();
      } else {
        console.error("Error removing friend (else)");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  console.log("Rendering FriendshipManager");
  console.log("Friends:", friends);
  console.log("Pending Requests:", pendingRequests);
  console.log("Received Requests:", receivedRequests);

  return (
    <ConstrainedLayout>
      <h3 className="text-center">Manage Friendships</h3>
      <div className="container mt-4">
        <div className="card mb-4">
          <div className="card-header">Search Users</div>
          <div className="card-body">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  const newTerm = e.target.value;
                  setSearchTerm(newTerm);
                  debouncedSearch(newTerm);
                }}
              />
            </div>

            {searchResults.map((user) => (
              <div key={user.id} className="d-flex justify-content-between align-items-center mb-2">
                <span>{user.name} ({user.email})</span>
                <button className="btn btn-primary btn-sm" onClick={() => sendFriendRequest(user.id)}>Send Friend Request</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Friends</div>
          <div className="card-body">
            {friends.map((friend) => (
              <div key={friend.id} className="d-flex justify-content-between align-items-center mb-2">
                <span>{friend.name}</span>
                <button className="btn btn-danger btn-sm" onClick={() => removeFriend(friend.id)}>Remove Friend</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Pending Friend Requests</div>
          <div className="card-body">
            {pendingRequests.map((request) => (
              <div key={request.id} className="mb-2">{request.name}</div>
            ))}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Received Friend Requests</div>
          <div className="card-body">
            {receivedRequests.map((request) => (
              <div key={request.id} className="d-flex justify-content-between align-items-center mb-2">
                <span>{request.name}</span>
                <div>
                  <button className="btn btn-success btn-sm me-2" onClick={() => acceptFriendRequest(request.id)}>Accept</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => declineFriendRequest(request.id)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConstrainedLayout>
  );
};

export default FriendshipManager;
