import React from 'react';

type Props = {
  vesselTypes: string[];
  fuelTypes: string[];
  years: number[];
  selectedVessel?: string;
  selectedFuel?: string;
  selectedYear?: number | '';
  onChange: (filters: { vessel?: string; fuel?: string; year?: number | '' }) => void;
};

const RoutesFilter: React.FC<Props> = ({ vesselTypes, fuelTypes, years, selectedVessel, selectedFuel, selectedYear, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        Vessel:
        <select value={selectedVessel || ''} onChange={(e) => onChange({ vessel: e.target.value || undefined })}>
          <option value="">All</option>
          {vesselTypes.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        Fuel:
        <select value={selectedFuel || ''} onChange={(e) => onChange({ fuel: e.target.value || undefined })}>
          <option value="">All</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        Year:
        <select value={selectedYear ?? ''} onChange={(e) => onChange({ year: e.target.value ? Number(e.target.value) : '' })}>
          <option value="">All</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>

      <button className="button" onClick={() => onChange({ vessel: undefined, fuel: undefined, year: '' })}>Reset</button>
    </div>
  );
};

export default RoutesFilter;
