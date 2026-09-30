import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { PolarMap } from './PolarMap';
import { Station } from '../../types';
import { Badge } from '../common/Badge';
import {
  Compass,
  ArrowRight,
  Database,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Observatory: React.FC = () => {
  const navigate = useNavigate();
  const { stations, expeditions, findings, receipts } = usePolarStore();
  const [selectedStation, setSelectedStation] = useState<Station>(stations[0]); // Default Bharati

  const stationExpeditions = expeditions.filter(e => e.stationId === selectedStation.id);
  const stationFindings = findings.filter(f => f.stationId === selectedStation.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Mission Statement */}
      <div className="border-b border-polarBorder pb-6 flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            <span className="text-xs font-mono-data uppercase tracking-widest text-accent font-semibold">
              SIH26063 Operational Trust Layer
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-polarText leading-tight">
            Every public scientific claim about Indian polar research comes with a receipt.
          </h1>
          <p className="text-xs sm:text-sm text-polarMuted leading-relaxed">
            POLAR-LINK connects raw polar expeditions, scanned reports, sensor datasets and public communication into an unbroken chain of custody. Never lose a number, scope, or provenance.
          </p>
        </div>

        {/* Primary Demo Shortcut */}
        <Link
          to="/r/PL-RCPT-2026-0930-BHR01"
          className="p-3 rounded bg-surface2 border border-accent/40 hover:border-accent transition-all flex items-center space-x-3 text-xs"
        >
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div>
            <div className="font-semibold text-polarText">Active Demo Receipt</div>
            <div className="text-[10px] font-mono-data text-accent">PL-RCPT-2026-0930-BHR01</div>
          </div>
          <ArrowRight className="w-4 h-4 text-accent" />
        </Link>
      </div>

      {/* Spatial Exploration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Polar Projection Radar Map (7 Cols) */}
        <div className="lg:col-span-7">
          <PolarMap
            selectedStationId={selectedStation.id}
            onSelectStation={st => setSelectedStation(st)}
          />
        </div>

        {/* Station Quick Context Drawer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="polar-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <div>
                <span className="text-xs font-mono-data text-accent uppercase">Selected Station</span>
                <h2 className="text-xl font-editorial font-bold text-polarText">
                  {selectedStation.name} Station ({selectedStation.hindiName})
                </h2>
              </div>
              <Badge variant="VERIFIED" label={selectedStation.region} />
            </div>

            <p className="text-xs text-polarText leading-relaxed">
              {selectedStation.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-data py-2">
              <div className="p-2 rounded bg-surface2 border border-polarBorder">
                <span className="text-polarMuted block text-[10px]">Coordinates</span>
                <span className="text-polarText">{selectedStation.coordinates.lat}°, {selectedStation.coordinates.lng}°</span>
              </div>
              <div className="p-2 rounded bg-surface2 border border-polarBorder">
                <span className="text-polarMuted block text-[10px]">Commissioned</span>
                <span className="text-polarText">{selectedStation.commissionedYear}</span>
              </div>
            </div>

            {/* Quick Link to full Station View */}
            <div className="pt-2 flex justify-between items-center border-t border-polarBorder text-xs">
              <span className="text-polarMuted">{stationFindings.length} Verified Findings</span>
              <Link
                to={`/stations/${selectedStation.id}`}
                className="text-accent hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Full Station Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Expedition & Finding Highlight */}
          {stationFindings[0] && (
            <div className="polar-card p-5 space-y-2 border-l-4 border-l-accent">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-data text-accent font-semibold">
                  Featured Finding: {stationFindings[0].code}
                </span>
                <Badge variant="VERIFIED" size="sm" />
              </div>
              <h3 className="text-sm font-editorial font-bold text-polarText">
                {stationFindings[0].title}
              </h3>
              <p className="text-xs text-polarMuted line-clamp-2">
                {stationFindings[0].summary}
              </p>
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/evidence/${stationFindings[0].id}`}
                  className="text-xs text-accent hover:underline flex items-center space-x-1"
                >
                  <span>Open in Evidence Reader →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
