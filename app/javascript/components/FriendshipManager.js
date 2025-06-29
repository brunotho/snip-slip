import React, { useState } from 'react';
import { debounce } from 'lodash';
import ConstrainedLayout from './ConstrainedLayout';
import { SkeletonFriendItem } from './SkeletonLoader';
import InviteSection from './InviteSection';

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
  
  // Loading states
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingActions, setLoadingActions] = useState(new Set());

  const debouncedSearch = debounce((term) => searchUsers(term), 300);

  // Helper functions for managing loading states
  const setActionLoading = (actionId, isLoading) => {
    setLoadingActions(prev => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  };

  const isActionLoading = (actionId) => loadingActions.has(actionId);

  const getCSRFToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  };

  const fetchFriendships = async () => {
    try {
      setIsLoadingFriends(true);
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
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const searchUsers = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    try {
      setIsSearching(true);
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
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    const actionId = `send-${userId}`;
    try {
      setActionLoading(actionId, true);
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
    } finally {
      setActionLoading(actionId, false);
    }
  };

  const acceptFriendRequest = async (friendshipId) => {
    const actionId = `accept-${friendshipId}`;
    try {
      setActionLoading(actionId, true);
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
    } finally {
      setActionLoading(actionId, false);
    }
  };

  const declineFriendRequest = async (friendshipId) => {
    const actionId = `decline-${friendshipId}`;
    try {
      setActionLoading(actionId, true);
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
    } finally {
      setActionLoading(actionId, false);
    }
  };

  const removeFriend = async (friendshipId) => {
    const actionId = `remove-${friendshipId}`;
    try {
      setActionLoading(actionId, true);
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
    } finally {
      setActionLoading(actionId, false);
    }
  };

  return (
    <ConstrainedLayout>
      <h3 className="text-center mb-4">Friends & Invitations</h3>
      <div className="container">
        {/* 1. Friends List */}
        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Your Friends</strong>
          </div>
          <div className="card-body-custom">
            {isLoadingFriends ? (
              <SkeletonFriendItem count={3} />
            ) : friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 rounded">
                  <div>
                    <span className="fw-medium me-2">{friend.name}</span>
                    <small className="text-muted">{friend.email}</small>
                  </div>
                  <button 
                    className="btn-icon" 
                    onClick={() => removeFriend(friend.id)}
                    disabled={isActionLoading(`remove-${friend.id}`)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                No friends yet. Search below or invite friends to join SnipSlip!
              </div>
            )}
          </div>
        </div>

        {/* 2. Find Friends (Search) */}
        <div className="card-elevated mb-4">
          <div className="card-header-custom">
            <strong>Find Friends</strong>
          </div>
          <div className="card-body-custom">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  const newTerm = e.target.value;
                  setSearchTerm(newTerm);
                  debouncedSearch(newTerm);
                }}
              />
            </div>

            {isSearching ? (
              <SkeletonFriendItem count={2} />
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2">
                  <div>
                    <span className="fw-medium me-2">{user.name}</span>
                    <small className="text-muted">{user.email}</small>
                  </div>
                  <button 
                    className="btn-icon" 
                    onClick={() => sendFriendRequest(user.id)}
                    disabled={isActionLoading(`send-${user.id}`)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="text-center text-muted py-3">
                No users found. Try inviting them to join SnipSlip below!
              </div>
            ) : null}
          </div>
        </div>

        {/* 3. Invite Friends */}
        <InviteSection />

        {/* 4. Friend Requests (Received) */}
        {(receivedRequests.length > 0 || isLoadingFriends) && (
          <div className="card-elevated mb-4">
            <div className="card-header-custom">
              <strong>Friend Requests</strong>
            </div>
            <div className="card-body-custom">
              {isLoadingFriends ? (
                <SkeletonFriendItem count={2} />
              ) : (
                receivedRequests.map((request) => (
                  <div key={request.id}
                      className="d-flex justify-content-between align-items-center p-2 mb-2 rounded">
                    <div>
                      <span className="fw-medium me-2">{request.name}</span>
                      <small className="text-muted">{request.email}</small>
                    </div>
                    <div className="button-container">
                      <button 
                        className="btn-icon" 
                        onClick={() => declineFriendRequest(request.id)}
                        disabled={isActionLoading(`decline-${request.id}`)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => acceptFriendRequest(request.id)}
                        disabled={isActionLoading(`accept-${request.id}`)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 5. Sent Requests (Only show if there are any) */}
        {(pendingRequests.length > 0 || isLoadingFriends) && (
          <div className="card-elevated mb-4">
            <div className="card-header-custom">
              <strong>Sent Requests</strong>
            </div>
            <div className="card-body-custom">
              {isLoadingFriends ? (
                <SkeletonFriendItem count={1} />
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id}
                      className="p-2 mb-2 rounded hover-bg-light">
                    <div>
                      <span className="fw-medium me-2">{request.name}</span>
                      <small className="text-muted">{request.email}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </ConstrainedLayout>
  );
};

export default FriendshipManager;
