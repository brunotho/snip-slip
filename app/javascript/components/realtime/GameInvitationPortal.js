import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Modal from '../shared/Modal'

function GameInvitationPortal() {
  const [isOpen, setIsOpen] = useState(false)
  const [inviter, setInviter] = useState(null)
  const [gameSessionId, setGameSessionId] = useState(null)

  useEffect(() => {
    function onInvite(event) {
      const detail = event.detail || {}
      if (!detail.inviter || !detail.inviter.name || !detail.game_session_id) {
        console.error('Invalid invitation payload; missing inviter or game_session_id', detail)
        return
      }
      setInviter(detail.inviter)
      setGameSessionId(detail.game_session_id)
      setIsOpen(true)
    }

    window.addEventListener('game:invitation', onInvite)
    return () => window.removeEventListener('game:invitation', onInvite)
  }, [])

  const root = typeof document !== 'undefined' ? document.getElementById('realtime-modal-root') : null
  if (!root) return null

  const acceptInvitation = async () => {
    if (!gameSessionId) { setIsOpen(false); return }
    try {
      const token = document.querySelector('[name="csrf-token"]').content
      const response = await fetch(`/game_sessions/${gameSessionId}/accept_invitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
      })
      if (!response.ok) throw new Error('Failed to accept invitation')
      window.location.href = `/game_sessions/${gameSessionId}/invite`
    } catch (e) {
      console.error(e)
      setIsOpen(false)
    }
  }

  return createPortal(
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="modal-content-centered">
      <div className="card-modal modal-frame">
        <div className="card-header-custom">You're invited</div>
        <div className="card-body-custom">{`${inviter?.name} invited you to play.`}</div>
        <div className="modal-button-group">
          <button className="btn btn-neutral" onClick={() => setIsOpen(false)}>Not now</button>
          <button className="btn btn-accent" onClick={acceptInvitation}>Join lobby</button>
        </div>
      </div>
    </Modal>,
    root
  )
}

export default GameInvitationPortal


