import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import SVGChart from '../components/SVGChart';

interface ComparisonResult {
  routeId: string;
  baseline: {
    ghgIntensity: number;
    year: number;
  };
  comparison: {
    ghgIntensity: number;
    year: number;
  };
  percentDiff: number;
  compliant: boolean;
}

interface ComparisonData {
  baseline?: {
    routeId: string;
    ghgIntensity: number;
  };
  results: ComparisonResult[];
}

const ComparePage: React.FC = () => {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = ((import.meta as any).env || {}).VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [routesRes, comparisonRes] = await Promise.all([
          axios.get(API_BASE + '/routes'),
          axios.get(API_BASE + '/routes/comparison')
        ]);
        setRoutes(routesRes.data);
        setData(comparisonRes.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const setBaselineRoute = async (routeId: string) => {
    try {
      await axios.post(`${API_BASE}/routes/${routeId}/baseline`);
      // Refresh data
      const comparisonRes = await axios.get(API_BASE + '/routes/comparison');
      setData(comparisonRes.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to set baseline');
    }
  };

  const chartData = React.useMemo(() => {
    if (!data?.baseline || !data?.results) return [];
    
    const TARGET_VALUE = 89.3368; // Reference value from assignment
    
    return data.results.slice(0, 5).map(r => ([
      { 
        label: 'Baseline', 
        value: r.baseline.ghgIntensity, 
        group: r.routeId,
        type: 'baseline' as const
      },
      { 
        label: 'Actual', 
        value: r.comparison.ghgIntensity, 
        group: r.routeId,
        type: 'actual' as const
      },
      { 
        label: 'Target', 
        value: TARGET_VALUE, 
        group: r.routeId,
        type: 'target' as const
      }
    ])).flat();
  }, [data]);

  return (
    <Container>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Compare Routes</h1>
      </div>

      {loading && <p>Loading comparison data...</p>}
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #dcfce7'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#047857',
          marginBottom: '16px'
        }}>Route Selection</h2>
        
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Baseline Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#047857'
            }}>
              Select Baseline Route:
            </label>
            <select 
              value={data?.baseline?.routeId || ''} 
              onChange={(e) => setBaselineRoute(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#065f46',
                fontSize: '0.95rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value="">Select a route...</option>
              {routes.map(route => (
                <option key={route.routeId} value={route.routeId}>
                  {route.routeId} - {route.vesselType} ({route.fuelType})
                </option>
              ))}
            </select>
          </div>

          {/* Current Selection Info */}
          {data?.baseline && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#dcfce7',
              borderRadius: '6px',
              border: '1px solid #a7f3d0'
            }}>
              <div style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '4px' }}>
                Current Baseline
              </div>
              <div style={{ 
                color: '#065f46', 
                fontWeight: '600',
                fontSize: '1.125rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{data.baseline.routeId}</span>
                <span>{data.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ</span>
              </div>
              <div style={{ 
                fontSize: '0.875rem',
                color: '#059669',
                marginTop: '8px'
              }}>
                {routes.find(r => r.routeId === data.baseline.routeId)?.vesselType || ''} - {routes.find(r => r.routeId === data.baseline.routeId)?.fuelType || ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {data?.baseline && (
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #dcfce7',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #dcfce7',
            backgroundColor: '#f0fdf4'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#047857',
              margin: 0
            }}>GHG Intensity Comparison</h2>
          </div>
          
          <div style={{ 
            padding: '24px',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #dcfce7'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#34d399',
                  borderRadius: '2px'
                }}></div>
                <span style={{ color: '#047857', fontSize: '0.875rem' }}>Baseline</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #dcfce7'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#059669',
                  borderRadius: '2px'
                }}></div>
                <span style={{ color: '#047857', fontSize: '0.875rem' }}>Actual</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #dcfce7'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#047857',
                  borderRadius: '2px'
                }}></div>
                <span style={{ color: '#047857', fontSize: '0.875rem' }}>Target</span>
              </div>
            </div>

            <SVGChart 
              data={chartData} 
              height={300} 
              width={800}
            />
          </div>
        </div>
      )}

      {data?.results && (
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #dcfce7',
          marginTop: '24px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #dcfce7',
            backgroundColor: '#f0fdf4'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#047857',
              margin: 0
            }}>Route Comparison Results</h2>
          </div>

          <div style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0fdf4' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Route ID</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Baseline GHG</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Actual GHG</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Target GHG</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Difference</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #dcfce7' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r) => (
                  <tr key={r.routeId} style={{ borderBottom: '1px solid #dcfce7' }}>
                    <td style={{ padding: '16px', backgroundColor: '#f0fdf4', fontWeight: 500, color: '#065f46' }}>
                      {r.routeId}
                      <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
                        {routes.find(route => route.routeId === r.routeId)?.vesselType}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#065f46' }}>
                      {r.baseline.ghgIntensity.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#065f46' }}>
                      {r.comparison.ghgIntensity.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#065f46' }}>
                      89.34
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      textAlign: 'right',
                      color: r.percentDiff > 0 ? '#b91c1c' : '#047857'
                    }}>
                      {(r.percentDiff * 100).toFixed(2)}%
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: r.compliant ? '#dcfce7' : '#fef2f2',
                        color: r.compliant ? '#047857' : '#b91c1c',
                        fontSize: '12px',
                        fontWeight: 500,
                        border: `1px solid ${r.compliant ? '#a7f3d0' : '#fecaca'}`
                      }}>
                        {r.compliant ? 'Compliant' : 'Non-Compliant'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ComparePage;
