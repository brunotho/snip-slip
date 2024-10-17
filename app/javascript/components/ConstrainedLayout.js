import React from 'react';

const ConstrainedLayout = ({ children, maxWidth = '400px' }) => (
  <div
    className="container mt-4"
    style={{
      maxWidth,
      // margin: '0 auto',
      // minHeight: '80vh',
      // display: 'flex',
      // flexDirection: 'column',
      // justifyContent: 'center'
    }}
  >
    <div style={{ padding: '2rem 0' }}>
      {children}
    </div>
  </div>
);

export default ConstrainedLayout;
