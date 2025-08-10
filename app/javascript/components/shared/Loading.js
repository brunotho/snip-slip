import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <Skeleton circle width={60} height={60} />
    <Skeleton width={200} height={20} />
    <Skeleton width={150} height={16} />
    <p className="text-muted mt-3">{message}</p>
  </div>
);

export default Loading;