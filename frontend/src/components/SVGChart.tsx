import React from 'react';

type Point = { 
  label: string; 
  value: number; 
  group: string;
  type: 'baseline' | 'actual' | 'target';
};

interface SVGChartProps {
  data: Point[];
  height?: number;
  width?: number;
}

const SVGChart: React.FC<SVGChartProps> = ({ 
  data, 
  height = 300, 
  width = 800 
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc' }}>
        No data available
      </div>
    );
  }

  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value));
  const max = Math.max(...validData.map((d) => d.value), 1);
  const groups = [...new Set(validData.map(d => d.group))];
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Group width calculations
  const groupWidth = chartWidth / groups.length;
  const barWidth = (groupWidth * 0.8) / 3; // 3 bars per group with some spacing
  
  // Colors for different bar types
  const colors = {
    baseline: '#34d399', // light green
    actual: '#059669',   // medium green
    target: '#047857'    // dark green
  };

  // Calculate Y axis ticks
  const yTicks = Array.from({ length: 6 }, (_, i) => max * i / 5);
  
  return (
    <svg width={width} height={height} style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '8px' }}>
      {/* Background grid */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {yTicks.map((tick, i) => (
          <line
            key={`grid-${i}`}
            x1={0}
            x2={chartWidth}
            y1={chartHeight - (tick / max) * chartHeight}
            y2={chartHeight - (tick / max) * chartHeight}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
      </g>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Y-axis and ticks */}
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#666" />
        {yTicks.map((tick, i) => (
          <g key={i} transform={`translate(0, ${chartHeight - (tick / max) * chartHeight})`}>
            <line x1={-5} x2={0} stroke="#666" />
            <text x={-10} dy=".32em" textAnchor="end" fontSize={10}>
              {tick.toFixed(1)}
            </text>
          </g>
        ))}
        <text 
          transform="rotate(-90)" 
          y={-padding.left + 20} 
          x={-chartHeight/2}
          textAnchor="middle"
          fontSize={12}
        >
          GHG Intensity (gCO₂e/MJ)
        </text>

        {/* Bars */}
        {groups.map((group, groupIndex) => {
          const groupData = validData.filter(d => d.group === group);
          return (
            <g key={group} transform={`translate(${groupIndex * groupWidth + groupWidth * 0.1}, 0)`}>
              {groupData.map((d, i) => {
                const barHeight = (d.value / max) * chartHeight;
                const x = i * barWidth;
                const y = chartHeight - barHeight;
                const color = i === 0 ? colors.baseline : i === 1 ? colors.actual : colors.target;
                
                return (
                  <g key={`${d.group}-${i}`}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 2}
                      height={barHeight}
                      fill={color}
                      rx={2}
                    />
                    <text
                      x={x + barWidth/2}
                      y={y - 5}
                      fontSize={10}
                      textAnchor="middle"
                      fill="#666"
                    >
                      {d.value.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              {/* Group label */}
              <text
                x={barWidth * 1.5}
                y={chartHeight + 20}
                fontSize={12}
                textAnchor="middle"
              >
                {group}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${chartWidth/2}, ${chartHeight + 40})`}>
          {Object.entries(colors).map(([key, color], i) => (
            <g key={key} transform={`translate(${i * 100 - 150}, 0)`}>
              <rect width={15} height={15} fill={color} rx={2} />
              <text x={20} y={12} fontSize={10} textAnchor="start">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

export default SVGChart;
