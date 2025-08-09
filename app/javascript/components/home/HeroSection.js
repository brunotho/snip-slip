import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const translations = {
  English: {
    welcome: "Welcome playa!",
    basicRules: [
      "Press Play",
      "Pick your lyric snippet", 
      "Slip it into conversation",
      "Don't get caught!"
    ],
    toggleText: "What's the game?",
    modalTitle: "What's the game?",
    modalContent: [
      "SnipSlip is a sneaky party game. At a social gathering, some friends secretly start a game while others have no idea it's happening.",
      "Each player gets song lyrics and tries to work them naturally into conversations with unsuspecting friends. The goal: sound completely normal - nobody should think \"that was weird.\"",
      "The thrill comes from trying to make something like \"You gon' be that next chump\" sound like your own natural thought in casual conversation. Honor system scoring, harder lyrics = more points, highest score wins!"
    ],
    gotIt: "Got it!"
  },
  German: {
    welcome: "Willkommen Spieler!",
    basicRules: [
      "Drücke Play",
      "Wähle deinen Textschnipsel",
      "Baue ihn ins Gespräch ein", 
      "Lass dich nicht erwischen!"
    ],
    toggleText: "Was ist das Spiel?",
    modalTitle: "Was ist das Spiel?",
    modalContent: [
      "ist ein heimliches Partyspiel. Bei einem geselligen Beisammensein beginnen einige Freunde heimlich ein Spiel, während andere keine Ahnung haben, dass es stattfindet.",
      "Jeder Spieler bekommt Songtexte und versucht, sie natürlich in Gespräche mit ahnungslosen Freunden einzubauen. Das Ziel: völlig normal klingen - niemand sollte denken \"das war seltsam.\"",
      "Der Nervenkitzel kommt daher, dass man versucht, schwierige Texte wie einen eigenen natürlichen Gedanken in einem lockeren Gespräch klingen zu lassen. Ehrensystem-Bewertung, schwierigere Texte = mehr Punkte, höchste Punktzahl gewinnt!"
    ],
    gotIt: "Verstanden!"
  }
};

function HeroSection({ onPlay, userLanguage = 'English' }) {
  const [showDetailedRules, setShowDetailedRules] = useState(false);
  
  // Get translations for current language
  const t = translations[userLanguage] || translations.English;

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
          minHeight: '200px'
        }}
        >
        <h1 className="display-4" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
          {t.welcome}
        </h1>
        <div
          className="mt-3 mt-md-4"
          style={{ cursor: "pointer" }}
          onClick={onPlay}
          >
          <FontAwesomeIcon
            icon={faPlay}
            size="3x"
            className="d-md-none"
            style={{ color: "black" }}
            aria-label="Play"
            beat
          />
          <FontAwesomeIcon
            icon={faPlay}
            size="4x"
            className="d-none d-md-block"
            style={{ color: "black" }}
            aria-label="Play"
            beat
            />
        </div>
      </div>
      <div className="rules-section d-flex justify-content-center" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <div className="container d-flex flex-column align-items-center" style={{ width: '100%', maxWidth: '100%' }}>
          <ul className="list-unstyled" style={{ marginTop: "1rem", textAlign: "center" }}>
            {t.basicRules.map((rule, index) => (
              <div key={index} className="rules-container">
                <li className="basic-rule">{rule}</li>
              </div>
            ))}
          </ul>
          
          {/* Clickable toggle for detailed rules */}
          <div 
            className="mt-3 text-center"
            style={{ 
              cursor: 'pointer',
              opacity: showDetailedRules ? 0 : 1,
              transition: 'opacity 0.2s ease'
            }}
            onClick={toggleRules}
          >
            <span style={{ 
              color: '#6b7280', 
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}>
              {t.toggleText}
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
                padding: '60px 1rem'
              }}
              onClick={toggleRules}
            >
              <div 
                style={{ 
                  maxWidth: '500px', 
                  width: '100%',
                  maxHeight: 'calc(100vh - 160px)',
                  overflowY: 'auto',
                  animation: 'slideUp 0.3s ease-out'
                }}
                className="card-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#1e293b'
                }}>
                  {t.modalTitle}
                </h3>
                {t.modalContent.map((paragraph, index) => (
                  <p key={index} style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                    {index === 0 ? (
                      <>
                        <strong>SnipSlip</strong> {paragraph}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={toggleRules}
                    className="btn btn-neutral btn-rounded"
                  >
                    {t.gotIt}
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
