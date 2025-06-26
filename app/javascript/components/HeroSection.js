import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

function HeroSection({ onPlay }) {
  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <div
        className="jumbotron text-center d-flex flex-column justify-content-center"
        style={{ 
          height: '15vh', 
          marginTop: '2rem',
          minHeight: '200px' // Ensure minimum height on mobile
        }}
      >
        <h1 className="display-4" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
          Welcome playa!
        </h1>
        <div
          className="mt-3 mt-md-4"
          style={{ cursor: "pointer" }}
          onClick={onPlay}
        >
          <FontAwesomeIcon
            icon={faPlay}
            size="3x"
            className="d-md-none" // Smaller icon on mobile
            style={{ color: "black" }}
            aria-label="Play"
            beat
          />
          <FontAwesomeIcon
            icon={faPlay}
            size="4x"
            className="d-none d-md-block" // Larger icon on desktop
            style={{ color: "black" }}
            aria-label="Play"
            beat
          />
        </div>
      </div>
      <div className="rules-section d-flex justify-content-center" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <div className="container d-flex flex-column align-items-center" style={{ width: '100%', maxWidth: '100%' }}>
          <ul className="list-unstyled" style={{ marginTop: "2rem" }}>
            <div className="rules-container">
              <li className="basic-rule">Press Play</li>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Pick your lyric snippet</li>
              <div className="extended-rule">Choose from famous song lyrics of varying difficulty</div>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Slip it into conversation</li>
              <div className="extended-rule">Make it sound natural in real life conversation with friends</div>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Don't get caught!</li>
              <div className="extended-rule">Others shouldn't notice you are quoting or "saying something weird"</div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
