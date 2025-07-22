import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

export const calculateProgressBarHeight = (playerCount) => {
  const baseHeight = 28;
  const padding = 12;
  
  let rows;
  if (playerCount <= 2) rows = 1;
  else if (playerCount <= 4) rows = 2;
  else rows = Math.ceil(playerCount / 3);
  
  return baseHeight * rows + padding;
};

function GameProgressBar({ players, currentUserId, isMultiplayer = false, loading = false }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  
  const playerCount = Object.keys(players).length;
  const progressBarHeight = calculateProgressBarHeight(playerCount);

  const getGridColumns = () => {
    if (playerCount <= 2) return 'repeat(2, 1fr)';
    if (playerCount <= 4) return 'repeat(2, 1fr)';
    return 'repeat(auto-fit, minmax(125px, 1fr))';
  };

  const togglePlayer = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  if (loading) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: '60px',
          left: '0',
          right: '0',
          backgroundColor: '#f8fafc',
          borderBottom: '2px solid #d1d5db',
          zIndex: 1000,
          padding: '0.375rem 0.75rem',
          overflowX: 'hidden'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          justifyItems: 'stretch',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div className="skeleton-button" style={{ height: '28px', borderRadius: '0.75rem' }}></div>
          <div className="skeleton-button" style={{ height: '28px', borderRadius: '0.75rem' }}></div>
        </div>
      </div>
    );
  }

  if (!players || Object.keys(players).length === 0) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '65px',
        left: '0',
        right: '0',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #d1d5db',
        zIndex: 1000,
        padding: '0.375rem 0.75rem',
        overflowX: 'hidden'
      }}
    >
      {/* Compact horizontal bar */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: isMultiplayer ? getGridColumns() : '1fr',
          gap: '0.5rem',
          justifyItems: isMultiplayer ? 'stretch' : 'center',
          maxWidth: '100%',
          overflow: 'hidden'
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.2rem 0.6rem',
                  backgroundColor: isCurrentUser ? '#dbeafe' : '#ffffff',
                  border: `1px solid ${isComplete ? '#10b981' : '#cbd5e1'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isCurrentUser ? '600' : '500',
                  minWidth: '110px',
                  width: isMultiplayer ? '100%' : '160px',
                  maxWidth: '160px',
                  justifyContent: 'center',
                  opacity: isComplete ? 1 : 0.8,
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '50px'
                }}                >
                  {player.name}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>•</span>
                <span style={{ fontWeight: '600' }}>{player.total_score}</span>
                <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>•</span>
                <span style={{ 
                  color: isComplete ? '#10b981' : '#6b7280',
                  fontWeight: isComplete ? '600' : '500',
                  fontSize: '0.75rem'
                }}>
                  {player.rounds_played}/5
                </span>
                {isComplete && (
                  <span style={{ color: '#10b981', fontSize: '0.6rem', marginLeft: '0.125rem' }}>
                    ✓
                  </span>
                )}
                <FontAwesomeIcon 
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  style={{ fontSize: '0.6rem', color: '#9ca3af' }}
                />
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <>
                  {/* Backdrop */}
                  <div
                    onClick={() => setExpandedPlayer(null)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      zIndex: 1001
                    }}
                  />
                  {/* Expanded content */}
                  <div
                    style={{
                      position: 'fixed',
                      top: '120px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ffffff',
                      border: '2px solid #d1d5db',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      minWidth: '300px',
                      maxWidth: '90vw',
                      maxHeight: 'calc(100vh - 140px)',
                      overflowY: 'auto',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      zIndex: 1002
                    }}
                  >
                  {/* Close button */}
                  <button
                    onClick={() => setExpandedPlayer(null)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '1rem',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  
                  <div className="mb-3">
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '1.1rem', 
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {player.name}
                      {isCurrentUser && isMultiplayer && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#3b82f6',
                          fontWeight: '500',
                          backgroundColor: '#dbeafe',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          You
                        </span>
                      )}
                      {isComplete && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#10b981',
                          fontWeight: '500',
                          backgroundColor: '#d1fae5',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          Complete
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      Score: {player.total_score} | Rounds: {player.rounds_played}/5
                    </div>
                  </div>

                  {player.round_history && player.round_history.length > 0 && (
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Round History:
                      </div>
                      {player.round_history.map((round, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0',
                            borderBottom: index < player.round_history.length - 1 ? '1px solid #e5e7eb' : 'none',
                            fontSize: '0.8rem'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={round.success ? faCheck : faXmark}
                            style={{ 
                              color: round.success ? '#10b981' : '#ef4444',
                              fontSize: '0.7rem',
                              flexShrink: 0
                            }}
                          />
                          <span style={{ 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal'
                          }}>
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