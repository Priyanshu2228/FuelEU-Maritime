import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '../components/ui/Container';

interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

const vesselTypes = ['Bulk carrier', 'Container ship', 'Oil tanker', 'Chemical tanker', 'LNG carrier', 'Other'];
const fuelTypes = ['HFO', 'MDO', 'LNG', 'Diesel', 'Other'];
const years = [2024, 2025, 2026];

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const inputStyle = {
  padding: '6px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    vesselType: '',
    fuelType: '',
    year: ''
  });

  const API_BASE = ((import.meta as any).env || {}).VITE_API_BASE_URL || 'http://localhost:3000/api';
  
  const filteredRoutes = routes.filter(route => {
    return (!filters.vesselType || route.vesselType === filters.vesselType) &&
           (!filters.fuelType || route.fuelType === filters.fuelType) &&
           (!filters.year || route.year === parseInt(filters.year));
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE + '/routes');
      setRoutes(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSetBaseline = async (routeId: string) => {
    try {
      await axios.post(`${API_BASE}/routes/${routeId}/baseline`);
      await load();
    } catch (e: any) {
      setError('Failed to set baseline: ' + (e?.response?.data?.message || e?.message || 'unknown error'));
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Routes</h1>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <select 
            value={filters.vesselType} 
            onChange={(e) => setFilters(f => ({ ...f, vesselType: e.target.value }))}
            style={inputStyle}
          >
            <option value="">All Vessel Types</option>
            {vesselTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={filters.fuelType}
            onChange={(e) => setFilters(f => ({ ...f, fuelType: e.target.value }))}
            style={inputStyle}
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
            style={inputStyle}
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <button onClick={() => setFilters({ vesselType: '', fuelType: '', year: '' })} style={buttonStyle}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <p>Loading routes...</p>}
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: '12px' }}>
            Showing {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Route ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Vessel Type</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Fuel Type</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Year</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>GHG Intensity</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Fuel Used</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Distance</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Total Emissions</th>
                  <th style={{ textAlign: 'center', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Baseline</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 8px' }}>{r.routeId}</td>
                    <td style={{ padding: '12px 8px' }}>{r.vesselType}</td>
                    <td style={{ padding: '12px 8px' }}>{r.fuelType}</td>
                    <td style={{ padding: '12px 8px' }}>{r.year}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{r.ghgIntensity.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{r.fuelConsumption.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{r.distance.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{r.totalEmissions.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      {r.isBaseline ? '✅' : ''}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        onClick={() => handleSetBaseline(r.routeId)}
                        style={{ ...buttonStyle, opacity: r.isBaseline ? 0.5 : 1 }}
                        disabled={r.isBaseline}
                      >
                        {r.isBaseline ? 'Baseline Set' : 'Set Baseline'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Container>
  );
};

export default RoutesPage;
