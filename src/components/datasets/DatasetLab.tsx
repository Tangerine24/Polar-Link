import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Badge } from '../common/Badge';
import {
  Database,
  Download,
  Filter,
  Layers,
  Table as TableIcon,
  LineChart as ChartIcon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DatasetLab: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { datasets, stations } = usePolarStore();

  const dataset = datasets.find(d => d.id === id) || datasets[0];
  const station = stations.find(s => s.id === dataset.stationId);

  const [dateFilter, setDateFilter] = useState<'all' | 'jan' | 'feb'>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Filter dataset points
  const filteredPoints = dataset.dataPoints.filter(p => {
    if (dateFilter === 'jan') return p.timestamp.includes('-01-');
    if (dateFilter === 'feb') return p.timestamp.includes('-02-');
    return true;
  });

  // Calculate live statistics
  const values = filteredPoints.map(p => p.value);
  const meanVal = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  const minVal = values.length > 0 ? Math.min(...values).toFixed(1) : 0;
  const maxVal = values.length > 0 ? Math.max(...values).toFixed(1) : 0;
  const countVal = values.length;

  // Download filtered CSV
  const handleExportCSV = () => {
    const headers = 'Timestamp,Value,Unit,SensorStatus\n';
    const rows = filteredPoints
      .map(p => `${p.timestamp},${p.value},${dataset.unit},${p.sensorStatus}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.id}_filtered_${dateFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Dataset Calibration & Derivation Lab</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            {dataset.title}
          </h1>
          <p className="text-xs text-polarMuted">
            Station: {station?.name} ({station?.region}) • Parameter: {dataset.variable} ({dataset.unit})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="VERIFIED" label="NCPOR Calibrated Dataset" />
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded bg-accent text-background font-semibold text-xs flex items-center space-x-1.5 hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* Statistical Derivation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">
            Calculated Mean
          </span>
          <span className="font-mono-data text-xl font-bold text-accent">
            {meanVal} {dataset.unit}
          </span>
          <span className="text-[10px] text-polarMuted block mt-1">Derived from {countVal} readings</span>
        </div>

        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Minimum</span>
          <span className="font-mono-data text-xl font-bold text-polarText">
            {minVal} {dataset.unit}
          </span>
          <span className="text-[10px] text-polarMuted block mt-1">Filtered series min</span>
        </div>

        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Maximum</span>
          <span className="font-mono-data text-xl font-bold text-polarText">
            {maxVal} {dataset.unit}
          </span>
          <span className="text-[10px] text-polarMuted block mt-1">Filtered series max</span>
        </div>

        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Count / Sample</span>
          <span className="font-mono-data text-xl font-bold text-success">{countVal}</span>
          <span className="text-[10px] text-polarMuted block mt-1">Calibrated data points</span>
        </div>
      </div>

      {/* Visualization & Filter Controls */}
      <div className="polar-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-polarBorder pb-3">
          {/* Date Filter */}
          <div className="flex items-center space-x-2 text-xs font-mono-data">
            <Filter className="w-3.5 h-3.5 text-accent" />
            <span className="text-polarMuted">Temporal Filter:</span>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                dateFilter === 'all'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface2 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              All Window
            </button>
            <button
              onClick={() => setDateFilter('jan')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                dateFilter === 'jan'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface2 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              January 2023
            </button>
            <button
              onClick={() => setDateFilter('feb')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                dateFilter === 'feb'
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface2 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              February 2023
            </button>
          </div>

          {/* Toggle between Chart & Accessible Table */}
          <div className="flex items-center space-x-1 bg-surface2 p-0.5 rounded border border-polarBorder text-xs">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 ${
                viewMode === 'chart'
                  ? 'bg-surface1 text-accent font-semibold shadow-sm'
                  : 'text-polarMuted hover:text-polarText'
              }`}
            >
              <ChartIcon className="w-3 h-3" />
              <span>Time-Series</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 ${
                viewMode === 'table'
                  ? 'bg-surface1 text-accent font-semibold shadow-sm'
                  : 'text-polarMuted hover:text-polarText'
              }`}
            >
              <TableIcon className="w-3 h-3" />
              <span>Accessible Table</span>
            </button>
          </div>
        </div>

        {/* View Surface */}
        {viewMode === 'chart' ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24344D" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#9FB0C6"
                  fontSize={11}
                  tickFormatter={t => t.slice(5)}
                />
                <YAxis
                  stroke="#9FB0C6"
                  fontSize={11}
                  unit={dataset.unit}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101B2D',
                    borderColor: '#24344D',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#EDE8DF'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7CC4F0"
                  strokeWidth={2}
                  dot={{ fill: '#7CC4F0', r: 3 }}
                  activeDot={{ r: 5, fill: '#5FB48A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs font-mono-data text-left border-collapse">
              <thead className="bg-surface2 text-polarMuted sticky top-0">
                <tr>
                  <th className="p-2 border-b border-polarBorder">Timestamp</th>
                  <th className="p-2 border-b border-polarBorder">Value ({dataset.unit})</th>
                  <th className="p-2 border-b border-polarBorder">Sensor Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polarBorder/40">
                {filteredPoints.map((p, idx) => (
                  <tr key={idx} className="hover:bg-surface2/40">
                    <td className="p-2 text-polarText">{p.timestamp}</td>
                    <td className="p-2 text-accent font-bold">{p.value}</td>
                    <td className="p-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/30">
                        {p.sensorStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sensor Calibration & Provenance Card */}
      <div className="polar-card p-5 space-y-3">
        <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Calibrated Instrument Provenance</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-surface2 border border-polarBorder space-y-1">
            <span className="font-mono-data text-polarMuted text-[10px] block">Instrument:</span>
            <span className="text-polarText font-semibold">{dataset.provenance.instrument}</span>
          </div>

          <div className="p-3 rounded bg-surface2 border border-polarBorder space-y-1">
            <span className="font-mono-data text-polarMuted text-[10px] block">Calibration Date:</span>
            <span className="text-polarText font-mono-data">{dataset.provenance.calibrationDate}</span>
          </div>

          <div className="p-3 rounded bg-surface2 border border-polarBorder space-y-1">
            <span className="font-mono-data text-polarMuted text-[10px] block">Data Curator:</span>
            <span className="text-polarText">{dataset.provenance.curator}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
