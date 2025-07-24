import React from 'react';

function ImageSelector({ isOpen, onSelect, onClose, alternativeCovers, loadingCovers }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-centered" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px' }}>
          <h3>Select Alternative Image</h3>
          
          {loadingCovers ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Loading alternative covers...
            </div>
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
          
          <button onClick={onClose} style={{ marginTop: '1rem' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ImageSelector;