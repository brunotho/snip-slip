import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import { createRoot } from 'react-dom/client'

// Components
import MainComponent from "./components/MainComponent"

import SnippetsGame from "./components/game/SnippetsGame"
import SnippetCard from "./components/game/snippets/SnippetCard"
import GameInviteManager from "./components/game/multiplayer-lobby/GameInviteManager"
import FriendshipManager from "./components/friends/FriendshipManager"
import UserProfile from "./components/profile/UserProfile"
import ReportReviews from "./components/reports/ReportReviews"
import AddSnippet from "./components/add-snippet/AddSnippet"
import ConstrainedLayout from "./components/shared/ConstrainedLayout"
import GameInvitationPortal from "./components/realtime/GameInvitationPortal"

// Styles
import "bootstrap/dist/css/bootstrap"
import * as bootstrap from "bootstrap"
import "./stylesheets/application.scss"

// Channels
import "./channels/notifications_channel"

// Mount all components on turbo:load
document.addEventListener('turbo:load', () => {
  // Realtime modal portal (always available)
  const realtimeRoot = document.getElementById('realtime-modal-root')
  if (realtimeRoot) {
    const root = createRoot(realtimeRoot)
    root.render(<GameInvitationPortal />)
  }
  

  // Main container
  const mainContainer = document.getElementById('main')
  if (mainContainer) {
    const gameSessionId = mainContainer.dataset.gameSessionId || null

    const root = createRoot(mainContainer)
    root.render(<MainComponent gameSessionId={gameSessionId} />)
  }

  // SnippetsGame
  const container = document.getElementById('snippets-game')
  if (container) {
    
    const root = createRoot(container)
    const gameSessionId = container.dataset.gameSessionId || null
    root.render(<SnippetsGame game_session_id={gameSessionId} />)
  }

  // ReportReviews
  const reportReviewsContainer = document.getElementById('report-reviews')
  if (reportReviewsContainer) {
    
    const root = createRoot(reportReviewsContainer)
    root.render(<ReportReviews />)
  }

  // SnippetCard for thank_you view
  const snippetLastElement = document.getElementById("snippet-last")
  if (snippetLastElement && snippetLastElement.dataset.snippet) {
    
    const snippetData = JSON.parse(snippetLastElement.dataset.snippet)
    if (!snippetData.image_url) {
      snippetData.image_url = '/assets/placeholder_album_cover.jpg'
    }
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
    
    const root = createRoot(friendshipManagerContainer)
    root.render(<FriendshipManager />)
  }

  const userProfileContainer = document.getElementById('user-profile')
  if (userProfileContainer) {
    try {
      const userData = JSON.parse(userProfileContainer.dataset.user || '{}')
      const languages = JSON.parse(userProfileContainer.dataset.languages || '[]')

      const root = createRoot(userProfileContainer)
      root.render(
        <UserProfile
          initialUser={userData}
          languages={languages}
        />
      )
    } catch (error) {
      console.error("Error initializing UserProfile:", error)
    }
  }

  // AddSnippetFormWrapper
  const wrapperElement = document.getElementById('add-snippet-form-wrapper')
  if (wrapperElement) {
    
    const wrapperRoot = createRoot(wrapperElement)
    const content = wrapperElement.innerHTML
    wrapperElement.innerHTML = ''
    wrapperRoot.render(
      <AddSnippet html={content} />
    )
  }


})

window.bootstrap = bootstrap
