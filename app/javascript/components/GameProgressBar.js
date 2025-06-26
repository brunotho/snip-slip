import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function GameProgressBar({ players, currentUserId, isMultiplayer = false }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  const togglePlayer = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  if (!players || Object.keys(players).length === 0) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '60px', // Below header
        left: '0',
        right: '0',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #d1d5db',
        zIndex: 1000,
        padding: '0.5rem 1rem'
      }}
    >
      {/* Compact horizontal bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
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
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: isCurrentUser ? '#dbeafe' : '#ffffff',
                  border: `2px solid ${isComplete ? '#10b981' : '#cbd5e1'}`,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isCurrentUser ? '600' : '500',
                  minWidth: '120px',
                  justifyContent: 'center',
                  opacity: isComplete ? 1 : 0.8
                }}
              >
                <span>{isMultiplayer ? player.name : 'You'}</span>
                <span style={{ color: '#6b7280' }}>•</span>
                <span>{player.total_score}pts</span>
                <span style={{ color: '#6b7280' }}>•</span>
                <span style={{ 
                  color: isComplete ? '#10b981' : '#6b7280',
                  fontWeight: isComplete ? '600' : '500'
                }}>
                  {player.rounds_played}/5
                </span>
                {isComplete && (
                  <span style={{ color: '#10b981', fontSize: '0.7rem', marginLeft: '0.25rem' }}>
                    ✓
                  </span>
                )}
                <FontAwesomeIcon 
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  style={{ fontSize: '0.7rem', color: '#9ca3af' }}
                />
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#ffffff',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    minWidth: '300px',
                    maxWidth: '90vw',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 1001
                  }}
                >
                  <div className="mb-3">
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '1.1rem', 
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {isMultiplayer ? player.name : 'Your Progress'}
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
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {round.lyric_snippet.snippet}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameProgressBar; 