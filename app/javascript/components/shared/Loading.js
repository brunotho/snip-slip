import React from 'react';
import ReactLoading from 'react-loading';

const Loading = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <ReactLoading type="spin" color="#6c757d" height={50} width={50} />
    <p className="text-muted mt-3">{message}</p>
  </div>
);

export default Loading;