import React, { useEffect, useState } from 'react';
import HeroSection from './parts/HeroSection';
import BottomNavigation from './parts/BottomNavigation';
import { submitPost } from '../shared/http';
import { useCurrentUser } from '../shared/hooks/useCurrentUser';

function Home() {
  const { userId, language: userLanguage } = useCurrentUser();

  const startSinglePlayer = () => {
    if (userId) {
      submitPost('/game_sessions/start_single_player');
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  const startMultiplayer = () => {
    if (userId) {
      submitPost('/game_sessions/start_multiplayer');
    } else {
      window.location.href = '/users/sign_in';
    }
  };

  return (
    <>
      <HeroSection userLanguage={userLanguage} onPlay={startSinglePlayer} />
      <BottomNavigation onPlaySingle={startSinglePlayer} onPlayMulti={startMultiplayer} />
    </>
  );
}

export default Home;
