import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  Compass,
  Calendar,
  Users,
  Layers,
  FileText,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ExpeditionView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { expeditions, stations, findings } = usePolarStore();

  const activeExp = expeditions.find(e => e.id === id || e.code === id) || expeditions[0];
  const station = stations.find(s => s.id === activeExp.stationId);
  const expFindings = findings.filter(f => activeExp.publishedFindings.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-data text-polarMuted">
            <Link to="/expeditions" className="hover:text-accent">
              Expeditions
            </Link>
            <span>/</span>
            <span className="text-accent">{activeExp.code}</span>
          </div>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            {activeExp.name}
          </h1>
          <p className="text-xs text-polarMuted">
            Base Facility: {station?.name} ({station?.region}) • Season: {activeExp.season}
          </p>
        </div>

        <Badge variant="VERIFIED" label={activeExp.code} />
      </div>

      {/* Expedition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="polar-card p-5 space-y-3 text-xs">
            <h3 className="font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-accent" />
              <span>Expedition Registry</span>
            </h3>

            <div className="space-y-2 font-mono-data border-t border-polarBorder/60 pt-3">
              <div className="flex justify-between">
                <span className="text-polarMuted">Expedition Code:</span>
                <span className="text-accent font-bold">{activeExp.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Season:</span>
                <span className="text-polarText">{activeExp.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Start Date:</span>
                <span className="text-polarText">{activeExp.dates.start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">End Date:</span>
                <span className="text-polarText">{activeExp.dates.end}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-polarBorder/40">
              <span className="text-[10px] font-mono-data text-polarMuted block">Expedition Leader:</span>
              <p className="text-polarText font-semibold mt-0.5">{activeExp.leader}</p>
              <p className="text-[11px] text-polarMuted">{activeExp.leaderAffiliation}</p>
            </div>
          </div>

          {/* Research Themes */}
          <div className="polar-card p-5 space-y-3">
            <h4 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Scientific Program Themes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeExp.researchThemes.map((th, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-surface2 border border-polarBorder text-[11px] text-polarText"
                >
                  {th}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline Phases & Findings (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Summary */}
          <div className="polar-card p-6 space-y-2">
            <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Operational Mission Summary
            </h3>
            <p className="text-xs text-polarText leading-relaxed">
              {activeExp.summary}
            </p>
          </div>

          {/* Phases Timeline */}
          <div className="polar-card p-6 space-y-4">
            <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Operational Campaign Phases
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeExp.phases.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-surface2 border border-polarBorder flex items-center space-x-2 text-xs"
                >
                  <span className="font-mono-data font-bold text-accent">0{idx + 1}</span>
                  <span className="text-polarText font-medium">{phase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Published Findings from this Expedition */}
          <div className="polar-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-polarText uppercase font-mono-data tracking-wider">
              Published Science Findings ({expFindings.length})
            </h3>
            <div className="space-y-2">
              {expFindings.map(f => (
                <div
                  key={f.id}
                  className="p-3.5 rounded bg-surface2 border border-polarBorder flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono-data text-accent font-semibold block">
                      {f.code}: {f.title}
                    </span>
                    <p className="text-polarMuted line-clamp-1 mt-0.5">{f.summary}</p>
                  </div>
                  <Link
                    to={`/evidence/${f.id}`}
                    className="px-3 py-1.5 rounded bg-surface1 border border-polarBorder text-accent hover:border-accent text-xs font-mono-data whitespace-nowrap ml-3"
                  >
                    Evidence Reader →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
