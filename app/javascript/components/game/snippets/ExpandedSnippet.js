import React, { useEffect, useRef } from 'react';

function ExpandedSnippet({ snippet, game_session_id, onSubmit, onNext }) {
  const metadataRef = useRef(null);

  const handleSuccess = () => {
    onSubmit(snippet.id, true);
  };

  const handleFailure = () => {
    onSubmit(snippet.id, false);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  useEffect(() => {
    const adjustFontSize = () => {
      const container = metadataRef.current;
      if (!container) return;

      const parentWidth = container.parentElement.offsetWidth;
      let fontSize = 14.4; // 0.9rem in pixels (0.9 * 16)
      
      container.style.fontSize = `${fontSize}px`;
      
      // If content overflows, gradually reduce font size
      while (container.scrollWidth > parentWidth && fontSize > 11.2) { // 0.7rem minimum
        fontSize -= 0.4;
        container.style.fontSize = `${fontSize}px`;
      }
    };

    // Adjust on mount and resize
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [snippet.song, snippet.artist, snippet.difficulty]);

  return (
    <div className="expanded-snippet">
      {/* Integrated card design */}
      <div className="card-elevated expanded-snippet-card">
        {/* Lyric text - Full width with larger canvas */}
        <div className="mb-3 d-flex align-items-center card-flat expanded-snippet-lyric">
          <p className="m-0 text-center w-100 expanded-snippet-text">
            {snippet.snippet}
          </p>
        </div>

        {/* Buttons - Enhanced button styling without bright colors */}
        <div className="d-flex justify-content-center gap-3 mb-3">
            {game_session_id ? (
              <>
              <button 
                className="btn btn-pill btn-game-action"
                onClick={handleSuccess}
              >
                Got it! 😎
                </button>
              <button 
                className="btn btn-pill btn-game-action"
                onClick={handleFailure}
              >
                Missed! 😅
                </button>
              </>
            ) : (
            <button 
              className="btn btn-pill btn-game-action"
              onClick={handleNext}
            >
                Next 🤓
              </button>
            )}
        </div>

        {/* Metadata in one line - dynamic font sizing */}
        <div className="mb-2 text-center expanded-snippet-meta">
          <div 
            ref={metadataRef}
            className="expanded-snippet-meta-row"
          >
            <span>
              {snippet.song}
            </span>
            <span className="sep">•</span>
            <span>
              {snippet.artist}
            </span>
            <span className="sep">•</span>
            <span className="tight">
              {snippet.difficulty} pts
            </span>
          </div>
        </div>

        {/* Full-width image - more opaque */}
        <div className="expanded-snippet-image">
          <img
            src={snippet.image_url}
            alt={`${snippet.song} Album Cover`}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpandedSnippet;
