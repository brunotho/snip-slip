import React from 'react';

function ReportModal({ snippet, onSubmit }) {
    return (
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
        <h3>Report Snippet</h3>
        <p>Snippet: {snippet?.snippet}</p>
        <p>Artist: {snippet?.artist}</p>
        <p>Song: {snippet?.song}</p>
        <button onClick={() => console.log('Submit report')}>Submit</button>
      </div>
    );
  }

export default ReportModal;