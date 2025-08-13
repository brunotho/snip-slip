import React, { useEffect, useState } from 'react';
import HeroSection from './parts/HeroSection';
import BottomNavigation from './parts/BottomNavigation';
import ConstrainedLayout from '../shared/ConstrainedLayout';
import { submitFormPost } from '../shared/form_post';
import { useCurrentUser } from '../shared/hooks/useCurrentUser';

function Home({ onQuickPlay }) {
  const { userId, language: userLanguage } = useCurrentUser();

  const startSinglePlayer = () => {
    if (userId) {
      submitFormPost('/game_sessions/start_single_player');
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  const startMultiplayer = () => {
    if (userId) {
      submitFormPost('/game_sessions/start_multiplayer');
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  return (
    <ConstrainedLayout>
      <HeroSection userLanguage={userLanguage} onPlay={() => {
        if (onQuickPlay) return onQuickPlay();
      }} />
      <BottomNavigation onPlaySingle={startSinglePlayer} onPlayMulti={startMultiplayer} />
    </ConstrainedLayout>
  );
}

export default Home;
