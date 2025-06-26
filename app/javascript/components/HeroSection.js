import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function HeroSection({ onPlay }) {
  const [showDetailedRules, setShowDetailedRules] = useState(false);

  const toggleRules = () => {
    setShowDetailedRules(!showDetailedRules);
  };

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
          <ul className="list-unstyled" style={{ marginTop: "1rem", textAlign: "center" }}>
            <div className="rules-container">
              <li className="basic-rule">Press Play</li>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Pick your lyric snippet</li>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Slip it into conversation</li>
            </div>
            <div className="rules-container">
              <li className="basic-rule">Don't get caught!</li>
            </div>
          </ul>
          
          {/* Clickable toggle for detailed rules */}
          <div 
            className="mt-3 text-center"
            style={{ 
              cursor: 'pointer',
              opacity: showDetailedRules ? 0 : 1, // Hide when modal is open
              transition: 'opacity 0.2s ease'
            }}
            onClick={toggleRules}
          >
            <span style={{ 
              color: '#6b7280', 
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}>
              What's the game?
            </span>
          </div>

          {/* Full modal overlay */}
          {showDetailedRules && (
            <div 
              style={{ 
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(248, 250, 252, 0.95)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 1rem' // Equal padding top and bottom
              }}
              onClick={toggleRules}
            >
              <div 
                style={{ 
                  maxWidth: '500px', 
                  width: '100%',
                  maxHeight: 'calc(100vh - 160px)', // Account for header margin and bottom space
                  overflowY: 'auto',
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  animation: 'slideUp 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#1e293b'
                }}>
                  What's the game?
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                  <strong>SnipSlip</strong> is a sneaky party game. At a social gathering, some friends secretly start a game while others have no idea it's happening.
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                  Each player gets song lyrics and tries to work them naturally into conversations with unsuspecting friends. The goal: sound completely normal - nobody should think "that was weird."
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
                  The thrill comes from trying to make something like "You gon' be that next chump" sound like your own natural thought in casual conversation. Honor system scoring: harder lyrics = more points, highest score wins!
                </p>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={toggleRules}
                    className="btn btn-neutral btn-rounded"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
