import React from 'react';
import { createPortal } from 'react-dom';
import Loading from '../shared/Loading';

function ImageSelector({ isOpen, onSelect, onClose, alternativeCovers, loadingCovers }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="image-modal-backdrop" onClick={onClose}>
      <div className="image-modal-content-centered" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px' }}>
          <h3>Select Alternative Image</h3>
          
          {loadingCovers ? (
            <Loading message="Loading alternative covers..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {alternativeCovers.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  onClick={() => onSelect(url)}
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    cursor: 'pointer',
                    border: '2px solid transparent'
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="modal-button-group">
            <button className="btn btn-neutral" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ImageSelector;