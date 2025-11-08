import React, { useState } from 'react';
import axios from 'axios';
import Container from '../components/ui/Container';

interface CBResponse {
  shipId: string;
  year: number;
  cb_gco2eq: number;
}

interface AdjustedCBResponse {
  shipId: string;
  year: number;
  cb_before: number;
  cb_after: number;
  banked: number;
}

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  fontSize: '14px',
  width: '120px'
};

const Banking: React.FC = () => {
  const [shipId, setShipId] = useState<string>('R001');
  const [year, setYear] = useState<number>(2024);
  const [cb, setCb] = useState<CBResponse | null>(null);
  const [adjustedCB, setAdjustedCB] = useState<AdjustedCBResponse | null>(null);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE = ((import.meta as any).env || {}).VITE_API_BASE_URL || 'http://localhost:3000/api';

  const fetchCB = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/compliance/cb`, { params: { shipId, year } });
      setCb(res.data);
      setAdjustedCB(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to fetch CB');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjusted = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/compliance/adjusted-cb`, { params: { shipId, year } });
      setAdjustedCB(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to fetch adjusted CB');
    } finally {
      setLoading(false);
    }
  };

  const doBank = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/banking/bank`, { shipId, year, amount: bankAmount });
      setSuccess('Successfully banked surplus');
      await fetchAdjusted(); // Refresh the adjusted CB
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  const doApply = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/banking/apply`, { shipId, year, amount: bankAmount });
      setSuccess('Successfully applied banked amount');
      await fetchAdjusted(); // Refresh the adjusted CB
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to apply banked amount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Banking</h1>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Route Details</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#4b5563' }}>
              Route ID
            </label>
            <input
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              style={inputStyle}
              placeholder="e.g. R001"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#4b5563' }}>
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={inputStyle}
              min="2024"
              max="2026"
            />
          </div>
          <div style={{ marginTop: '24px' }}>
            <button 
              style={buttonStyle} 
              onClick={fetchCB}
              disabled={loading}
            >
              Get CB
            </button>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button 
              style={buttonStyle} 
              onClick={fetchAdjusted}
              disabled={loading}
            >
              Get Adjusted CB
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px', marginBottom: '16px' }}>
          {success}
        </div>
      )}

      {(cb || adjustedCB) && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Compliance Balance</h2>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            {cb && (
              <div>
                <label style={{ fontSize: '14px', color: '#4b5563' }}>Original CB</label>
                <p style={{ fontSize: '24px', fontWeight: 500 }}>{cb.cb_gco2eq.toFixed(2)}</p>
              </div>
            )}
            
            {adjustedCB && (
              <>
                <div>
                  <label style={{ fontSize: '14px', color: '#4b5563' }}>Adjusted CB</label>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{adjustedCB.cb_after.toFixed(2)}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: '#4b5563' }}>Banked Amount</label>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{adjustedCB.banked.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Banking Actions</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#4b5563' }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(Number(e.target.value))}
                  style={inputStyle}
                  min="0"
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button 
                  style={buttonStyle} 
                  onClick={doBank}
                  disabled={loading || !cb}
                >
                  Bank Surplus
                </button>
              </div>
              <div style={{ marginTop: '24px' }}>
                <button 
                  style={buttonStyle} 
                  onClick={doApply}
                  disabled={loading || !cb}
                >
                  Apply Banked
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Banking;
