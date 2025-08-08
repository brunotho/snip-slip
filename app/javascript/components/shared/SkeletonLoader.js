import React from 'react';

// Skeleton component for various loading states
function SkeletonLoader({ type, count = 1, className = '' }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'snippet-card':
        return (
          <div className={`skeleton-snippet-card ${className}`}>
            <div className="skeleton-snippet-text"></div>
            <div className="skeleton-snippet-meta">
              <div className="skeleton-artist"></div>
              <div className="skeleton-difficulty"></div>
            </div>
          </div>
        );

      case 'friend-item':
        return (
          <div className={`skeleton-friend-item ${className}`}>
            <div className="skeleton-friend-info">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text">
                <div className="skeleton-name"></div>
                <div className="skeleton-email"></div>
              </div>
            </div>
            <div className="skeleton-action"></div>
          </div>
        );

      case 'game-progress':
        return (
          <div className={`skeleton-game-progress ${className}`}>
            <div className="skeleton-player-name"></div>
            <div className="skeleton-score"></div>
            <div className="skeleton-round">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
            <div className="skeleton-round">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
            <div className="skeleton-round">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        );

      case 'line':
        return <div className={`skeleton-line ${className}`}></div>;

      case 'line-sm':
        return <div className={`skeleton-line skeleton-line-sm ${className}`}></div>;

      case 'line-lg':
        return <div className={`skeleton-line skeleton-line-lg ${className}`}></div>;

      case 'circle':
        return <div className={`skeleton-circle ${className}`}></div>;

      case 'button':
        return <div className={`skeleton-button ${className}`}></div>;

      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton-line skeleton-line-lg" style={{ width: '60%', marginBottom: '12px' }}></div>
            <div className="skeleton-line" style={{ width: '100%' }}></div>
            <div className="skeleton-line" style={{ width: '80%' }}></div>
          </div>
        );

      default:
        return <div className={`skeleton ${className}`}></div>;
    }
  };

  // Render multiple skeleton items if count > 1
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>
            {renderSkeleton()}
          </React.Fragment>
        ))}
      </>
    );
  }

  return renderSkeleton();
}

// Specific skeleton components for common use cases
export function SkeletonSnippetCard({ count = 1, className = '' }) {
  return <SkeletonLoader type="snippet-card" count={count} className={className} />;
}

export function SkeletonFriendItem({ count = 1, className = '' }) {
  return <SkeletonLoader type="friend-item" count={count} className={className} />;
}

export function SkeletonGameProgress({ count = 1, className = '' }) {
  return <SkeletonLoader type="game-progress" count={count} className={className} />;
}

export function SkeletonLine({ size = '', className = '' }) {
  const sizeClass = size ? `skeleton-line-${size}` : '';
  return <SkeletonLoader type="line" className={`${sizeClass} ${className}`} />;
}

export function SkeletonButton({ size = '', className = '' }) {
  const sizeClass = size ? `skeleton-button-${size}` : '';
  return <SkeletonLoader type="button" className={`${sizeClass} ${className}`} />;
}

export default SkeletonLoader; 