import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";
import React from "react";
import { createRoot } from "react-dom/client";

import SnippetsGame from "../components/SnippetsGame";
import MainComponent from '../components/MainComponent';
import DifficultySlider from '../components/DifficultySlider';
import InviteFriend from "../components/InviteFriend";
import SnippetCard from "../components/SnippetCard";
import FriendshipManager from "../components/FriendshipManager";

import "bootstrap/dist/css/bootstrap";
import * as bootstrap from "bootstrap";

import "../stylesheets/application.scss";
import AddSnippetFormWrapper from "../components/AddSnippetForm";
import ConstrainedLayout from "../components/ConstrainedLayout";
import GameInviteManager from "../components/GameInviteManager";

import "../channels/notifications_channel"

Rails.start();
Turbolinks.start();
window.bootstrap = bootstrap;

document.addEventListener('turbolinks:load', () => {
  // Mount SnippetsGame
  const container = document.getElementById('snippets-game');
  if (container) {
    console.log('Mounting SnippetsGame component');
    const root = createRoot(container);
    const gameSessionId = container.dataset.gameSessionId || null;
    root.render(<SnippetsGame game_session_id={gameSessionId} />);
  }

  // Mount InviteFriend
  const inviteFriendElement = document.getElementById('invite-friend');
  if (inviteFriendElement) {
    console.log('Mounting InviteFriend component');
    const root = createRoot(inviteFriendElement);
    root.render(<InviteFriend />);
  }

  // Mount SnippetCard for thank_you view
  const snippetLastElement = document.getElementById("snippet-last");
  if (snippetLastElement && snippetLastElement.dataset.snippet) {
    console.log("Mounting SnippetCard for thank_you view");
    const snippetData = JSON.parse(snippetLastElement.dataset.snippet)
    const root = createRoot(snippetLastElement);
    root.render(
      <ConstrainedLayout maxWidth="800px">
        <SnippetCard
          snippet={snippetData}
          onClick={() => {}}
        />
      </ConstrainedLayout>
    )
  }

  const inviteManagerContainer = document.getElementById("game-invite-manager");
  if (inviteManagerContainer) {
    const root = createRoot(inviteManagerContainer);
    root.render(<GameInviteManager />);
  }

  const friendshipManagerContainer = document.getElementById('friendship-manager');
  if (friendshipManagerContainer) {
    console.log('Mounting FriendshipManager component');
    const root = createRoot(friendshipManagerContainer);
    root.render(<FriendshipManager />);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Mount MainComponent
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Mounting MainComponent');
    const gameSessionId = rootElement.dataset.gameSessionId;
    const root = createRoot(rootElement);
    root.render(<MainComponent gameSessionId={gameSessionId} />);
  }

  const wrapperElement = document.getElementById('add-snippet-form-wrapper');
  if (wrapperElement) {
    console.log('Mounting AddSnippetFormWrapper component');
    const wrapperRoot = createRoot(wrapperElement);
    const content = wrapperElement.innerHTML;
    wrapperElement.innerHTML = '';
    wrapperRoot.render(
      <AddSnippetFormWrapper>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </AddSnippetFormWrapper>
    );
  }

  // Mount DifficultySlider
  // const sliderElement = document.getElementById('difficulty-slider');
  // if (sliderElement) {
  //   console.log('Mounting DifficultySlider component');
  //   const root = createRoot(sliderElement);
  //   root.render(<DifficultySlider />);
  // }
});
