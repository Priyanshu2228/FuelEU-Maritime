import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'Routes', path: '/routes' },
  { label: 'Compare', path: '/compare' },
  { label: 'Banking', path: '/banking' },
  { label: 'Pooling', path: '/pooling' },
];

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      padding: '48px 0',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          <div>
            <Link to="/" style={{
              textDecoration: 'none',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              <span>⚓</span>
              <span>FuelEU Maritime</span>
            </Link>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.5,
            }}>
              Comprehensive maritime emissions management and compliance platform
            </p>
          </div>

          <div>
            <h3 style={{
              color: '#1f2937',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {footerLinks.map(({ label, path }) => (
                <li key={path} style={{ marginBottom: '8px' }}>
                  <Link
                    to={path}
                    style={{
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{
              color: '#1f2937',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              Contact
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.5,
              marginBottom: '8px',
            }}>
              Need help with compliance?
            </p>
            <a
              href="mailto:support@fueleu-maritime.eu"
              style={{
                color: '#10b981',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#10b981';
              }}
            >
              support@fueleu-maritime.eu
            </a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '24px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
        }}>
          <p>&copy; {new Date().getFullYear()} FuelEU Maritime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
