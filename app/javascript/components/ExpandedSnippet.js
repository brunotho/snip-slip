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
    <div 
      className="expanded-snippet-new" 
      style={{ 
        margin: "0.5rem auto 1rem auto",
        padding: "0",
        maxHeight: "calc(100vh - 240px)",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "visible"
      }}
    >
      {/* Integrated card design */}
      <div className="card-elevated" style={{ margin: "0 1rem", overflow: "visible" }}>
        {/* Lyric text - Full width with larger canvas */}
        <div 
          className="mb-3 d-flex align-items-center card-flat"
          style={{ 
            minHeight: "clamp(80px, 12vh, 140px)",
            flex: "1"
          }}
        >
          <p 
            className="m-0 text-center w-100"
            style={{
              color: "#1e293b",
              fontSize: "clamp(0.9rem, 3vw, 1.4rem)",
              fontWeight: "600",
              lineHeight: "1.4"
            }}
          >
            {snippet.snippet}
          </p>
        </div>

        {/* Buttons - All gray */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          {game_session_id ? (
            <>
              <button 
                className="btn btn-neutral btn-rounded"
                onClick={handleSuccess}
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap"
                }}
              >
                Got it! 😎
              </button>
              <button 
                className="btn btn-neutral btn-rounded"
                onClick={handleFailure}
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap"
                }}
              >
                Missed! 😅
              </button>
            </>
          ) : (
            <button 
              className="btn btn-neutral btn-rounded"
              onClick={handleNext}
              style={{ 
                minWidth: "120px",
                whiteSpace: "nowrap"
              }}
            >
              Next 🤓
            </button>
          )}
        </div>

        {/* Metadata in one line - dynamic font sizing */}
        <div 
          className="mb-2 text-center"
          style={{ 
            color: "#374151",
            overflow: "hidden"
          }}
        >
          <div 
            ref={metadataRef}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              lineHeight: "1.2",
              whiteSpace: "nowrap",
              fontSize: "0.9rem" // Default size, will be adjusted by JavaScript
            }}
          >
            <span style={{ fontWeight: "500" }}>
              {snippet.song}
            </span>
            <span style={{ color: "#9ca3af", flexShrink: "0" }}>•</span>
            <span style={{ fontWeight: "500" }}>
              {snippet.artist}
            </span>
            <span style={{ color: "#9ca3af", flexShrink: "0" }}>•</span>
            <span style={{ fontWeight: "500", flexShrink: "0" }}>
              {snippet.difficulty} pts
            </span>
          </div>
        </div>

        {/* Full-width image - more opaque */}
        <div 
          style={{ 
            width: "100%", 
            aspectRatio: "1", 
            borderRadius: "0.75rem", 
            overflow: "hidden",
            flexShrink: "0"
          }}
        >
          <img
            src={snippet.image_url}
            alt={`${snippet.song} Album Cover`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: "0.95"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpandedSnippet;
