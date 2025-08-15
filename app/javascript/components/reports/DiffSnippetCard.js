import React, {useEffect, useState, useRef} from 'react';
import DiffText from './DiffText';

function DiffSnippetCard({ snippet, suggestedSnippet, variant, handleVote, handleSkip, isBoring }) {
  const [fontSize, setFontSize] = useState('1.2rem')
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      adjustFontSize();
    }, 10);
  },[snippet]);

  const isOverflowing = (element) => {
    return element.scrollHeight > element.clientHeight;
  };
  
  const adjustFontSize = () => {
    const text = textRef.current;
    const container = containerRef.current;
    
    let currentSize = 1.2;
    text.style.fontSize = `${currentSize}rem`;
    
    while (isOverflowing(container) && currentSize > 0.95) {
      currentSize -= 0.05;
      text.style.fontSize = `${currentSize}rem`;
    }
    
    setFontSize(`${currentSize}rem`);
  }

  const buildDiffArray = (snippetAttribute, changesAttribute, variant) => {
    const originalWords = String(snippetAttribute).split(" ");
    const suggestedWords = String(changesAttribute).split(" ");

    if (variant === "original") {
      return originalWords.map(word => ({
        text: word,
        type: suggestedWords.includes(word) ? "unchanged" : "removed"
      }));
    } else {
      return suggestedWords.map(word => ({
        text: word,
        type: originalWords.includes(word) ? "unchanged" : "added"
      }));
    }
  }

  const renderSnippetAttribute = (snippetAttribute, changesAttribute, variant) => {
    return <DiffText diffArray={buildDiffArray(snippetAttribute, changesAttribute, variant)} />;
  }

  if (!snippet) {
    return (
      <div>
        <p>No snippet data available</p>
      </div>
    )
  }
  
  return (
    <div
    className="card-elevated is-interactive snippet-card"
    onClick={handleVote}
    style={{ position: 'relative' }}
    >
      {isBoring && variant === "proposed" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '5rem',
          fontWeight: 'bold',
          color: '#ef4444',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          zIndex: 10,
          pointerEvents: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          DELETE
        </div>
      )}
      <div className="d-flex h-100">
        <div style={{ flex: "1", display: "flex", flexDirection: "column", minWidth: "0" }}>
          <div className="card-body-custom d-flex flex-column h-100">
            <div
              ref={containerRef}
              className="flex-grow-1 d-flex align-items-center"
              style={{
                minHeight: "3rem",
                maxHeight: "4rem",
                overflow: "hidden",
                padding: "0.25rem 0"
              }}
            >
              <p
                ref={textRef}
                className="card-text m-0 w-100"
                style={{
                  fontSize: fontSize,
                  lineHeight: "1.3",
                  fontWeight: "600",
                  color: "#1e293b",
                  textAlign: "left"
                }}>
                {renderSnippetAttribute(snippet.snippet, suggestedSnippet.snippet, variant)}
              </p>
            </div>
            <span className="badge badge-sm">
              {renderSnippetAttribute(snippet.language, suggestedSnippet.language, variant)}
            </span>
            <div className="d-flex justify-content-between align-items-end mt-1" style={{ opacity: "0.75" }}>
              <small className="text-muted" style={{ fontSize: "0.75rem", fontWeight: "400" }}>
                Points: {renderSnippetAttribute(snippet.difficulty, suggestedSnippet.difficulty, variant)}
              </small>
              <small className="text-muted text-end" style={{ lineHeight: "1.2", fontSize: "0.75rem", fontWeight: "400" }}>
                <div>{renderSnippetAttribute(snippet.song, suggestedSnippet.song, variant)}</div>
                <div>{renderSnippetAttribute(snippet.artist, suggestedSnippet.artist, variant)}</div>
              </small>
            </div>
          </div>
        </div>
        <div style={{ height: "100%", aspectRatio: "1/1", flexShrink: "0" }}>
        <img
          src={variant === "original" ? snippet.image_url : suggestedSnippet.image_url}
          alt={`${variant === "original" ? snippet.song : suggestedSnippet.song} Album Cover`}
          style={{ 
            height: '100%', 
            width: '100%',
            objectFit: 'cover', 
            borderRadius: '0 0.375rem 0.375rem 0' 
          }}
        />
        </div>
      </div>
    </div>
  );
}

export default DiffSnippetCard;
