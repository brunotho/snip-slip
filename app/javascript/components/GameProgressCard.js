import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


export default function GameProgressCard({
  playerName="",
  totalScore = 0,
  roundsPlayed = 0,
  successfulRoundsCount = 0,
  maxRounds = 5,
  roundHistory = [],
}) {
  return (
    <div className="border p-4 rounded-lg">
      <div className="d-flex justify-content-between align-items-center">
        <div>Name: {playerName}</div>
        <div className="font-bold">Score: {totalScore}</div>
        <div>Rounds: {roundsPlayed}/{maxRounds}</div>
      </div>

      {roundHistory.length > 0 && (
        <div className="mt-2">
          {roundHistory.map((round, index) => (
            <div key={index} className="p-1">
              <div className="small text-muted">{round.success ?
                <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
                {" "}
                {round.lyric_snippet.snippet}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
