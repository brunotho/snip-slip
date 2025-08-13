import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import GameRulesModal from './GameRulesModal';
import { translations } from '../translations';

function HeroSection({ onPlay, userLanguage = 'English' }) {
  const [showDetailedRules, setShowDetailedRules] = useState(false);
  
  const t = translations[userLanguage] || translations.English;

  const toggleRules = () => {
    setShowDetailedRules(!showDetailedRules);
  };

  return (
    <div className="hero-container">
      <div className="jumbotron text-center d-flex flex-column justify-content-center hero-jumbotron">
        <h1 className="display-4 hero-title">
          {t.welcome}
        </h1>
        <div className="mt-3 mt-md-4 hero-play-button" onClick={onPlay}>
          <FontAwesomeIcon
            icon={faPlay}
            size="3x"
            className="d-md-none hero-play-icon"
            aria-label="Play"
            beat
          />
          <FontAwesomeIcon
            icon={faPlay}
            size="4x"
            className="d-none d-md-block hero-play-icon"
            aria-label="Play"
            beat
          />
        </div>
      </div>
      
      <div className="rules-section d-flex justify-content-center">
        <div className="container d-flex flex-column align-items-center rules-container">
          <ul className="list-unstyled rules-list">
            {t.basicRules.map((rule, index) => (
              <div key={index} className="rules-container">
                <li className="basic-rule">{rule}</li>
              </div>
            ))}
          </ul>
          
          <div 
            className={`mt-3 text-center rules-toggle ${showDetailedRules ? 'hidden' : ''}`}
            onClick={toggleRules}
          >
            <span className="rules-toggle-text">
              {t.toggleText}
            </span>
          </div>
        </div>
      </div>

      <GameRulesModal
        isOpen={showDetailedRules}
        onClose={toggleRules}
        translations={translations}
        userLanguage={userLanguage}
      />
    </div>
  );
}

export default HeroSection;
