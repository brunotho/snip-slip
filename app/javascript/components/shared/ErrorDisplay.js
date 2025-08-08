import React from 'react';

const ErrorDisplay = ({ 
  error, 
  title = "Something went wrong",
  onRetry = () => window.location.reload()
}) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div className="text-center">
      <div className="text-danger mb-3" style={{ fontSize: '2rem' }}>⚠️</div>
      <h4 className="text-danger mb-2">{title}</h4>
      <p className="text-muted">{error?.message || "An unexpected error occurred"}</p>
      <button 
        className="btn btn-outline-primary" 
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorDisplay;