import { expect, describe, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComparePage from '../../pages/Compare';

describe('ComparePage', () => {
  it('renders comparison table and chart', async () => {
    render(
      <BrowserRouter>
        <ComparePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Compare Routes')).toBeInTheDocument();
    expect(screen.getByText('Loading comparison data...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    // Mock API error
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <ComparePage />
      </BrowserRouter>
    );

    expect(await screen.findByText(/failed to load comparison/i)).toBeInTheDocument();
  });

  it('displays comparison results correctly', async () => {
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        baseline: {
          routeId: 'R001',
          ghgIntensity: 91.0
        },
        results: [{
          routeId: 'R002',
          baseline: {
            ghgIntensity: 91.0,
            year: 2024
          },
          comparison: {
            ghgIntensity: 88.0,
            year: 2024
          },
          percentDiff: -3.30,
          compliant: true
        }]
      })
    });

    render(
      <BrowserRouter>
        <ComparePage />
      </BrowserRouter>
    );

    expect(await screen.findByText('R001')).toBeInTheDocument();
    expect(await screen.findByText('91.0')).toBeInTheDocument();
    expect(await screen.findByText('-3.30%')).toBeInTheDocument();
    expect(await screen.findByText('Compliant')).toBeInTheDocument();
  });
});