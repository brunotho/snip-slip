import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTrophy } from '@fortawesome/free-solid-svg-icons';

function PlayerCard({ 
  player, 
  rank, 
  isCurrentPlayer = false, 
  isWinner = false,
  isMultiplayer = false,
  showTrophy = false
}) {
  return (
    <div className={`card-elevated mb-3 ${isWinner ? 'border-warning' : ''}`}>
      <div className="card-body-custom">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            {isMultiplayer && (
              <h6 className="mb-1 d-flex align-items-center">
                {showTrophy && (
                  <FontAwesomeIcon icon={faTrophy} className="text-warning me-2" />
                )}
                {player.name}
              </h6>
            )}
            {isMultiplayer && (
              <div className="text-muted small">
                Score: {player.total_score}
              </div>
            )}
          </div>
          {isMultiplayer && (
            <div className="text-end">
              <span className="badge bg-secondary">#{rank}</span>
            </div>
          )}
        </div>
        
        {player.round_history && player.round_history.length > 0 && (
          <div className="mt-2">
            {player.round_history.map((round, index) => (
              <div key={index} className="mb-1 small" style={{ display: 'block' }}>
                <FontAwesomeIcon
                  icon={round.success ? faCheck : faXmark}
                  className="me-2 text-muted"
                  style={{ float: 'left', marginTop: '2px' }}
                />
                <div style={{ 
                  marginLeft: '20px',
                  wordBreak: 'break-word', 
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal'
                }}>
                  {round.lyric_snippet.snippet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;