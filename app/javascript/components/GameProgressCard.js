import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function GameProgressCard({
  playerName = "",
  totalScore = 0,
  roundsPlayed = 0,
  maxRounds = 5,
  roundHistory = [],
  winner = false,
}) {

  return (
    <div
      className={`p-2 rounded-lg shadow bg-light`}
      style={{
        border: winner ? "4px solid purple" : "2px solid #e0e0e0",
        borderRadius: "8px",
        transition: "border-color 0.3s ease",
      }}
    >
      <div className="mb-2">
        <div className="fw-bold" style={{ fontSize: "1.1em" }}>{playerName}</div>
        <div className="text-dark" style={{ fontSize: "0.9em" }}>
          <span>Score: {totalScore}</span> | <span>Rounds: {roundsPlayed}/{maxRounds}</span>
        </div>
      </div>

      {roundHistory.length > 0 && (
        <div className="mt-3">
          {roundHistory.map((round, index) => (
            <div
              key={index}
              className="d-flex align-items-center p-1 border-bottom small"
              style={{ margin: "0 -2px" }} // Reduced side margin for compactness
            >
              <FontAwesomeIcon
                icon={round.success ? faCheck : faXmark}
                className="me-2 text-muted" // Set icon color to muted gray
              />
              <span>{round.lyric_snippet.snippet}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
