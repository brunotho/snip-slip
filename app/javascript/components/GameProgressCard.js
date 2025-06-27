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

  // console.log("GAMEPROGRESSCARD rendering with:", playerName);

  return (
    <div
      className={`p-2 rounded-lg shadow bg-light game-progress-card ${winner ? 'game-progress-card--winner' : 'game-progress-card--default'}`}
      style={{ maxWidth: "min(300px, 90vw)", margin: "0 auto" }}
    >
      <div className={roundHistory.length > 0 ? "mb-1" : ""}>
        <div className="fw-bold" style={{ fontSize: "1.1em" }}>{playerName}</div>
        <div className="text-dark" style={{ fontSize: "0.9em" }}>
          <span>Score: {totalScore}</span> | <span>Rounds: {roundsPlayed}/{maxRounds}</span>
        </div>
      </div>

      {roundHistory.length > 0 && (
        <div>
          {roundHistory.map((round, index) => (
            <div
              key={index}
              className="d-flex align-items-center border-top small"
              style={{ padding: "0.25rem 0.25rem 0 0.25rem", margin: "0 -2px" }}
            >
              <FontAwesomeIcon
                icon={round.success ? faCheck : faXmark}
                className="me-2 text-muted"
              />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{round.lyric_snippet.snippet}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
