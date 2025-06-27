import React, { useState } from 'react';
import { debounce } from 'lodash';
import ConstrainedLayout from './ConstrainedLayout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const FriendshipManager = () => {
  const container = document.getElementById("friendship-manager");
  const initialData = JSON.parse(container.dataset.friendships || "{}");

  const [friends, setFriends] = useState(initialData.friends || []);
  const [pendingRequests, setPendingRequests] = useState(initialData.pending_requests || []);
  const [receivedRequests, setReceivedRequests] = useState(initialData.received_requests || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = debounce((term) => searchUsers(term), 300);

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

          setFriends(data.updated_data.friends);
          setPendingRequests(data.updated_data.pending_requests);
          setReceivedRequests(data.updated_data.received_requests);
        } else {

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

  return (
    <ConstrainedLayout>
      <h3 className="text-center mb-4">Friends</h3>
      <div className="container">
        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Friends</strong>
          </div>
          <div className="card-body-custom">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 rounded">
                  <div>
                    <span className="fw-medium me-2">{friend.name}</span>
                    <small className="text-muted">{friend.email}</small>
                  </div>
                  <button className="btn-icon" onClick={() => removeFriend(friend.id)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                No friends yet. Search for users to add!
              </div>
            )}
          </div>
        </div>

        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Received Friend Requests</strong>
          </div>
          <div className="card-body-custom">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <div key={request.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 rounded">
                  <div>
                    <span className="fw-medium me-2">{request.name}</span>
                    <small className="text-muted">{request.email}</small>
                  </div>
                  <div className="button-container">
                    <button className="btn-icon" onClick={() => declineFriendRequest(request.id)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <button className="btn-icon" onClick={() => acceptFriendRequest(request.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                No pending requests
              </div>
            )}
          </div>
        </div>

        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Add New Friends</strong>
          </div>
          <div className="card-body-custom">
            <div className="mb-3">
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
              <div key={user.id}
                  className="d-flex justify-content-between align-items-center p-2 mb-2">
                <div>
                  <span className="fw-medium me-2">{user.name}</span>
                  <small className="text-muted">{user.email}</small>
                </div>
                <button className="btn-icon" onClick={() => sendFriendRequest(user.id)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Sent Friend Requests</strong>
          </div>
          <div className="card-body-custom">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <div key={request.id}
                    className="p-2 mb-2 rounded hover-bg-light">
                  <div>
                    <span className="fw-medium me-2">{request.name}</span>
                    <small className="text-muted">{request.email}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                No outgoing requests
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstrainedLayout>
  );
};

export default FriendshipManager;
