import React from 'react';

function GameRulesModal({ isOpen, onClose, translations, userLanguage }) {
  if (!isOpen) return null;

  const t = translations[userLanguage] || translations.English;

  return (
    <div className="game-rules-modal" onClick={onClose}>
      <div 
        className="card-modal modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">
          {t.modalTitle}
        </h3>
        {t.modalContent.map((paragraph, index) => (
          <p key={index} className="modal-paragraph">
            {index === 0 ? (
              <>
                <strong>SnipSlip</strong> {paragraph}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
        <div className="modal-button-container">
          <button
            onClick={onClose}
            className="btn btn-neutral btn-rounded"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameRulesModal;
