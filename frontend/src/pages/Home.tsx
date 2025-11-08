import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';

const menuItems = [
  {
    title: 'Routes',
    path: '/routes',
    description: 'View and manage maritime routes and their compliance data',
    icon: '🚢'
  },
  {
    title: 'Compare',
    path: '/compare',
    description: 'Compare emissions and compliance between different routes',
    icon: '📊'
  },
  {
    title: 'Banking',
    path: '/banking',
    description: 'Manage compliance credits through banking operations',
    icon: '🏦'
  },
  {
    title: 'Pooling',
    path: '/pooling',
    description: 'Pool multiple routes to optimize compliance balance',
    icon: '🔄'
  }
];

const cardStyle = {
  display: 'flex',
  padding: '24px',
  transition: 'all 0.2s',
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit',
  height: '100%'
};

const Home: React.FC = () => {
  return (
    <Container>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 700, 
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          FuelEU Maritime
        </h1>
        <p style={{ 
          fontSize: '18px',
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Comprehensive maritime emissions management and compliance platform
        </p>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        padding: '24px 0'
      }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none' }}
          >
            <Card>
              <div style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  {item.icon}
                </div>
                <h2 style={{ 
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  {item.title}
                </h2>
                <p style={{ 
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: 1.5
                }}>
                  {item.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div style={{ 
        textAlign: 'center',
        marginTop: '48px',
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <h2 style={{ 
          fontSize: '24px',
          fontWeight: 600,
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Need Help?
        </h2>
        <p style={{ 
          fontSize: '16px',
          color: '#6b7280',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          Check our documentation or contact support for assistance with maritime compliance management.
        </p>
      </div>
    </Container>
  );
};

export default Home;