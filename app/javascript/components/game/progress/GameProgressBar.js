import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTimes } from '@fortawesome/free-solid-svg-icons';

export const calculateProgressBarHeight = (playerCount) => {
  const baseHeight = 28;
  const padding = 12;
  
  let rows;
  if (playerCount <= 2) rows = 1;
  else rows = Math.ceil(playerCount / 2);
  
  return baseHeight * rows + padding;
};

function GameProgressBar({ progressData }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  
  const { players, currentRound, totalRounds, isComplete, currentUserId } = progressData;
  const playerCount = Object.keys(players).length;
  const progressBarHeight = calculateProgressBarHeight(playerCount);
  const isMultiplayer = playerCount > 1;

  const getGridColumns = () => 'repeat(2, minmax(0, 1fr))';

  const togglePlayer = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  if (!progressData || !players || Object.keys(players).length === 0) {
    return null;
  }

  return (
    <div className="game-progress-bar">
      {/* Compact horizontal bar */}
      <div 
        className={`game-progress-grid ${!isMultiplayer ? 'game-progress-grid--single-player' : ''}`}
        style={{
          gridTemplateColumns: isMultiplayer ? getGridColumns() : undefined
        }}
      >
        {Object.values(players).map(player => {
          const isCurrentUser = player.id === currentUserId;
          const isExpanded = expandedPlayer === player.id;
          const isComplete = player.rounds_played >= 5;
          
          return (
            <div key={player.id}>
              {/* Compact player bar */}
              <div
                onClick={() => togglePlayer(player.id)}
                className={`player-card ${isCurrentUser ? 'player-card--current-user' : ''} ${isComplete ? 'player-card--complete' : ''} ${isMultiplayer ? 'player-card--multiplayer' : 'player-card--single-player'}`}
              >
                <span className="player-name">
                  {player.name}
                </span>
                <span className="player-separator">•</span>
                <span className="player-score">{player.total_score}</span>
                <span className="player-separator">•</span>
                <span className={`player-rounds ${isComplete ? 'player-rounds--complete' : ''}`}>
                  {player.rounds_played}/5
                </span>
                {isComplete && (
                  <span className="player-complete-icon">
                    ✓
                  </span>
                )}
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <>
                  {/* Backdrop */}
                  <div
                    onClick={() => setExpandedPlayer(null)}
                    className="expanded-backdrop"
                  />
                  {/* Expanded content */}
                  <div className="expanded-modal">
                  {/* Close button */}
                  <button
                    onClick={() => setExpandedPlayer(null)}
                    className="modal-close-button"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  
                  <div className="mb-3">
                    <div className="player-header">
                      {player.name}
                      {isCurrentUser && isMultiplayer && (
                        <span className="player-badge player-badge--current-user">
                          You
                        </span>
                      )}
                      {isComplete && (
                        <span className="player-badge player-badge--complete">
                          Complete
                        </span>
                      )}
                    </div>
                    <div className="player-stats">
                      Score: {player.total_score} | Rounds: {player.rounds_played}/5
                    </div>
                  </div>

                  {player.round_history && player.round_history.length > 0 && (
                    <div>
                      <div className="round-history-title">
                        Round History:
                      </div>
                      {player.round_history.map((round, index) => (
                        <div
                          key={index}
                          className="round-history-item"
                        >
                          <FontAwesomeIcon
                            icon={round.success ? faCheck : faXmark}
                            className={`round-icon ${round.success ? 'round-icon--success' : 'round-icon--failure'}`}
                          />
                          <span className="round-snippet">
                            {round.lyric_snippet.snippet}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameProgressBar; 