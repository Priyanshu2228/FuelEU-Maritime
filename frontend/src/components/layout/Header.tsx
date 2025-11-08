import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/routes', label: 'Routes', icon: '🚢' },
  { path: '/compare', label: 'Compare', icon: '📊' },
  { path: '/banking', label: 'Banking', icon: '🏦' },
  { path: '/pooling', label: 'Pooling', icon: '🔄' },
  { path: '/dashboard', label: 'Dashboard', icon: '📈' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'white',
      backdropFilter: isScrolled ? 'blur(8px)' : 'none',
      boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      padding: '12px 0',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link to="/" style={{
          textDecoration: 'none',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '24px',
          fontWeight: 600,
          transition: 'transform 0.2s ease',
        }}>
          <span>⚓</span>
          <span>FuelEU Maritime</span>
        </Link>

        <nav>
          <ul style={{
            display: 'flex',
            gap: '8px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}>
            {navItems.map(({ path, label, icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    textDecoration: 'none',
                    color: location.pathname === path ? '#10b981' : '#6b7280',
                    backgroundColor: location.pathname === path ? '#f0fdf4' : 'transparent',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.color = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.color = location.pathname === path ? '#10b981' : '#6b7280';
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                  {location.pathname === path && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '0',
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#10b981',
                      borderRadius: '2px',
                      animation: 'slideIn 0.3s ease'
                    }} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: scaleX(0);
              opacity: 0;
            }
            to {
              transform: scaleX(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;