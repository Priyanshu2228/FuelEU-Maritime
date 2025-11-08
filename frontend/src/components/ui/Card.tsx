import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', action }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px'
      }}
    >
      {(title || action) && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: subtitle ? '4px' : '16px'
        }}>
          <div>
            {title && (
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 500,
                color: '#1f2937'
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ 
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;