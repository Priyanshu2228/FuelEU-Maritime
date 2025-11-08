import React from 'react';

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="container" style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>{children}</div>;
};

export default Container;
