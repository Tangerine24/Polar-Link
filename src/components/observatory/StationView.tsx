import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  Compass,
  MapPin,
  Calendar,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';

export const StationView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { stations, expeditions, findings, datasets } = usePolarStore();

  const station = stations.find(s => s.id === id) || stations[0];
  const stationExpeditions = expeditions.filter(e => e.stationId === station.id);
  const stationFindings = findings.filter(f => f.stationId === station.id);
  const stationDatasets = datasets.filter(d => d.stationId === station.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-polarBorder pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-data text-polarMuted">
            <Link to="/" className="hover:text-accent">
              Observatory
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>Region: {station.region}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent">{station.name}</span>
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <h1 className="text-3xl font-editorial font-bold text-polarText">
              {station.name} Station
            </h1>
            <span className="text-xl font-devanagari text-accent">
              ({station.hindiName})
            </span>
          </div>
        </div>

        <Badge variant="VERIFIED" label={station.operationalStatus} />
      </div>

      {/* Station Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Coordinates & Metadata (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="polar-card p-5 space-y-3 text-xs">
            <h3 className="font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Geodetic Location & Base Facts</span>
            </h3>

            <div className="space-y-2 font-mono-data border-t border-polarBorder/60 pt-3">
              <div className="flex justify-between">
                <span className="text-polarMuted">Latitude:</span>
                <span className="text-polarText">{station.coordinates.lat}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Longitude:</span>
                <span className="text-polarText">{station.coordinates.lng}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Elevation:</span>
                <span className="text-polarText">{station.coordinates.elevationMeters} m AMSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Commissioned:</span>
                <span className="text-polarText">{station.commissionedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-polarMuted">Region:</span>
                <span className="text-accent">{station.region}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-polarBorder/40">
              <span className="text-[10px] font-mono-data text-polarMuted block">Fact Source:</span>
              <p className="text-[11px] text-polarText mt-0.5">{station.factSource}</p>
            </div>
          </div>

          {/* Research Themes */}
          <div className="polar-card p-5 space-y-3">
            <h4 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Primary Scientific Disciplines
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {station.primaryThemes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-surface2 border border-polarBorder text-[11px] text-polarText"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Expeditions, Findings & Datasets (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Description */}
          <div className="polar-card p-6 space-y-2">
            <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Operational Facility Description
            </h3>
            <p className="text-xs text-polarText leading-relaxed">
              {station.description}
            </p>
          </div>

          {/* Findings at this Station */}
          <div className="polar-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-polarText uppercase font-mono-data tracking-wider">
                Published Scientific Findings ({stationFindings.length})
              </h3>
            </div>

            <div className="space-y-3">
              {stationFindings.map(f => (
                <div
                  key={f.id}
                  className="p-4 rounded bg-surface2 border border-polarBorder space-y-2 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-data text-accent font-semibold">
                      Finding {f.code}
                    </span>
                    <Badge variant="VERIFIED" size="sm" />
                  </div>
                  <h4 className="text-sm font-editorial font-bold text-polarText">{f.title}</h4>
                  <p className="text-xs text-polarMuted leading-relaxed">{f.summary}</p>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/evidence/${f.id}`}
                      className="text-xs text-accent hover:underline flex items-center space-x-1 font-mono-data"
                    >
                      <span>Open in Evidence Reader</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibrated Datasets at this Station */}
          {stationDatasets.length > 0 && (
            <div className="polar-card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-polarText uppercase font-mono-data tracking-wider flex items-center space-x-2">
                <Database className="w-4 h-4 text-accent" />
                <span>Calibrated Datasets ({stationDatasets.length})</span>
              </h3>
              <div className="space-y-2">
                {stationDatasets.map(ds => (
                  <div
                    key={ds.id}
                    className="p-3 rounded bg-surface2 border border-polarBorder flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-polarText">{ds.title}</span>
                      <p className="text-[11px] text-polarMuted">
                        Variable: {ds.variable} • Unit: {ds.unit} • Mean: {ds.statistics.mean} {ds.unit}
                      </p>
                    </div>
                    <Link
                      to={`/datasets/${ds.id}`}
                      className="px-3 py-1 rounded bg-surface1 border border-polarBorder text-accent hover:border-accent font-mono-data text-xs"
                    >
                      Lab Analysis →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
