console.log("Application.js loading...");

import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client'

// Import all components
import MainComponent from "./components/MainComponent"
import SnippetsGame from "./components/SnippetsGame"
import DifficultySlider from './components/DifficultySlider'
import InviteFriend from "./components/InviteFriend"
import SnippetCard from "./components/SnippetCard"
import FriendshipManager from "./components/FriendshipManager"
import AddSnippetFormWrapper from "./components/AddSnippetForm"
import ConstrainedLayout from "./components/ConstrainedLayout"
import GameInviteManager from "./components/GameInviteManager"

// Styles
import "bootstrap/dist/css/bootstrap"
import * as bootstrap from "bootstrap"
import "./stylesheets/application.scss"

// Channels
import "./channels/notifications_channel"

// Mount all components on turbo:load
document.addEventListener('turbo:load', () => {
  console.log("turbo:load fired");

  // Main container
  const mainContainer = document.getElementById('main')
  if (mainContainer) {
    const gameSessionId = mainContainer.dataset.gameSessionId || null
    console.log("gameSessionId:", gameSessionId);
    const root = createRoot(mainContainer)
    root.render(<MainComponent gameSessionId={gameSessionId} />)
  }

  // SnippetsGame
  const container = document.getElementById('snippets-game')
  if (container) {
    console.log('Mounting SnippetsGame component')
    const root = createRoot(container)
    const gameSessionId = container.dataset.gameSessionId || null
    root.render(<SnippetsGame game_session_id={gameSessionId} />)
  }

  // InviteFriend
  const inviteFriendElement = document.getElementById('invite-friend')
  if (inviteFriendElement) {
    const root = createRoot(inviteFriendElement)
    root.render(<InviteFriend />)
  }

  // SnippetCard for thank_you view
  const snippetLastElement = document.getElementById("snippet-last")
  if (snippetLastElement && snippetLastElement.dataset.snippet) {
    console.log("Mounting SnippetCard for thank_you view")
    const snippetData = JSON.parse(snippetLastElement.dataset.snippet)
    const root = createRoot(snippetLastElement)
    root.render(
      <ConstrainedLayout maxWidth="800px">
        <SnippetCard
          snippet={snippetData}
          onClick={() => {}}
        />
      </ConstrainedLayout>
    )
  }

  // GameInviteManager
  const inviteManagerContainer = document.getElementById("game-invite-manager")
  if (inviteManagerContainer) {
    const root = createRoot(inviteManagerContainer)
    root.render(<GameInviteManager />)
  }

  // FriendshipManager
  const friendshipManagerContainer = document.getElementById('friendship-manager')
  if (friendshipManagerContainer) {
    console.log('Mounting FriendshipManager component')
    const root = createRoot(friendshipManagerContainer)
    root.render(<FriendshipManager />)
  }

  // AddSnippetFormWrapper
  const wrapperElement = document.getElementById('add-snippet-form-wrapper')
  if (wrapperElement) {
    console.log('Mounting AddSnippetFormWrapper component')
    const wrapperRoot = createRoot(wrapperElement)
    const content = wrapperElement.innerHTML
    wrapperElement.innerHTML = ''
    wrapperRoot.render(
      <AddSnippetFormWrapper>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </AddSnippetFormWrapper>
    )
  }
})

window.bootstrap = bootstrap
