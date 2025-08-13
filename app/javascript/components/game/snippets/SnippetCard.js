import React, {useEffect, useState, useRef} from 'react';
import { useLongPress } from '@uidotdev/usehooks';

function SnippetCard({ snippet, onClick, onLongPress }) {
  const [fontSize, setFontSize] = useState('clamp(0.95rem, 2.8vw, 1.35rem)')
  const textRef = useRef(null);
  const containerRef = useRef(null);
  
  const longPressProps = useLongPress(() => {
    if (onLongPress) {
      onLongPress(snippet);
    }
  }, {
    threshold: 500,
  });

  if (!snippet) {
    return <div>No snippet data available</div>;
  }

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

  useEffect(() => {
    setTimeout(() => {
      adjustFontSize();
    }, 10);
  },[snippet]);

  return (
    <div
      className="card-elevated is-interactive snippet-card"
      onClick={onClick}
      {...longPressProps}
    >
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
                {snippet.snippet}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-end mt-1" style={{ opacity: "0.75" }}>
              <small className="text-muted" style={{ fontSize: "0.75rem", fontWeight: "400" }}>
                Points: {snippet.difficulty}
              </small>
              <small className="text-muted text-end" style={{ lineHeight: "1.2", fontSize: "0.75rem", fontWeight: "400" }}>
                <div>{snippet.song}</div>
                <div>{snippet.artist}</div>
              </small>
            </div>
          </div>
        </div>
        <div style={{ height: "100%", aspectRatio: "1/1", flexShrink: "0" }}>
          <img
            src={snippet.image_url}
            alt={`${snippet.song} Album Cover`}
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

export default SnippetCard;
