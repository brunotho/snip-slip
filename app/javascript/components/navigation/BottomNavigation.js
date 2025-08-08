import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ userSignedIn = false }) => {
  const handlePlaySinglePlayer = () => {
    if (userSignedIn) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_single_player';
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'authenticity_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      document.body.appendChild(form);
      form.submit();
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  const handlePlayMultiPlayer = () => {
    if (userSignedIn) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_multiplayer';
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'authenticity_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      document.body.appendChild(form);
      form.submit();
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  return (
    <div className="bottom-nav-buttons">
      <button
        onClick={handlePlaySinglePlayer}
        className="btn btn-accent btn-pill btn-md"
      >
        Play Alone :{'<'}
      </button>
      <button
        onClick={handlePlayMultiPlayer}
        className="btn btn-accent btn-pill btn-md"
      >
        Play with Friends :{'>'}
      </button>
    </div>
  );
};

BottomNavigation.propTypes = {
  userSignedIn: PropTypes.bool
};

export default BottomNavigation; 