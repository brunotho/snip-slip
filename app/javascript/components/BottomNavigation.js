import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ userSignedIn = false }) => {
  const handleSinglePlayerClick = () => {
    if (userSignedIn) {
      // Create a form and submit it for POST request
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_single_player';
      
      // Add CSRF token
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

  const handleMultiPlayerClick = () => {
    if (userSignedIn) {
      // Create a form and submit it for POST request
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/game_sessions/start_multiplayer';
      
      // Add CSRF token
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
    <nav className="navbar navbar-dark bg-dark fixed-bottom d-flex justify-content-around py-2">
      <button
        onClick={handleSinglePlayerClick}
        className="btn btn-accent flex-fill mx-1"
        style={{
          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
          padding: '0.75rem 0.5rem',
          borderRadius: '0.375rem'
        }}
      >
Play Alone :{'<'}
      </button>
      <button
        onClick={handleMultiPlayerClick}
        className="btn btn-accent flex-fill mx-1"
        style={{
          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
          padding: '0.75rem 0.5rem',
          borderRadius: '0.375rem'
        }}
      >
Play with Friends :{'>'}
      </button>
    </nav>
  );
};

BottomNavigation.propTypes = {
  userSignedIn: PropTypes.bool
};

export default BottomNavigation; 