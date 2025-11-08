import React from 'react';
import axios from 'axios';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';

const Pooling: React.FC = () => {
  const [name, setName] = React.useState<string>('');
  const [year, setYear] = React.useState<number>(2024);
  const [membersText, setMembersText] = React.useState<string>('R001:1000,R002:-500');
  const [result, setResult] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const createPool = async () => {
    setMessage(null);
    try {
      // expect membersText as CSV shipId:cb_before,...
      const members = membersText.split(',').map((s) => {
        const [shipId, val] = s.split(':');
        return { shipId: shipId.trim(), cb_before: Number(val) };
      });
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + '/pools', { name, year, members });
      setResult(res.data);
    } catch (e: any) {
      setMessage(e?.response?.data?.error || e?.message || 'Failed');
      setResult(null);
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Compliance Pool Management</h1>
        <p style={{ color: '#6b7280' }}>Create and manage vessel compliance pools for emissions balancing</p>
      </div>

      <Card title="Create New Pool">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pool Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter pool name" 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ width: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Compliance Year</label>
              <input 
                type="number" 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))} 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pool Members</label>
            <p style={{ color: '#6b7280', marginBottom: '8px', fontSize: '14px' }}>
              Enter member details in format: shipId:creditBalance (e.g., R001:1000,R002:-500)
            </p>
            <textarea 
              value={membersText} 
              onChange={(e) => setMembersText(e.target.value)} 
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <button 
              onClick={createPool}
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating Pool...' : 'Create Pool'}
            </button>
          </div>

          {message && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '4px' 
            }}>
              {message}
            </div>
          )}
        </div>
      </Card>

      {result && (
        <Card title="Pool Created Successfully" style={{ marginTop: '24px' }}>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '16px', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <strong>Pool ID:</strong> {result.pool?.id}
            </div>
            <div>
              <strong>Members:</strong>
              <pre style={{ 
                margin: '8px 0 0',
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '4px'
              }}>
                {JSON.stringify(result.members, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default Pooling;
