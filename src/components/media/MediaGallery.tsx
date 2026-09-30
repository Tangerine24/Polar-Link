import React, { useState } from 'react';
import { usePolarStore } from '../../store/polarStore';
import { SEED_MEDIA } from '../../data/seedData';
import { Badge } from '../common/Badge';
import { Image, Video, ExternalLink, Shield, Filter, Eye } from 'lucide-react';

export const MediaGallery: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');

  const mediaList = SEED_MEDIA.filter(m => {
    if (filterType !== 'ALL' && m.type !== filterType) return false;
    if (selectedStation !== 'ALL' && m.stationId !== selectedStation) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">SIH26063 Asset Class 4 & 5</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Polar Media & Photographic Repository
          </h1>
          <p className="text-xs text-polarMuted">
            Verified photographs, operational video recordings, and graphics catalogued from NCPOR and MoES official polar campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="VERIFIED" label="Authoritative Provenance" />
        </div>
      </div>

      {/* Epistemic Provenance Rule */}
      <div className="p-3 bg-surface2/60 border border-polarBorder rounded text-xs text-polarMuted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            Media Rights Policy: All entries preserve original metadata, institutional credit, and direct source links. No synthetic imagery.
          </span>
        </div>
        <span className="font-mono-data text-[10px] text-accent">Open Access / PIB</span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded bg-surface1 border border-polarBorder">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-polarMuted" />
          <span className="text-xs font-mono-data text-polarMuted">Filter:</span>
          {(['ALL', 'PHOTO', 'VIDEO'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded text-xs font-mono-data border transition-colors ${
                filterType === type
                  ? 'bg-accent/15 border-accent text-accent font-semibold'
                  : 'bg-surface2 border-polarBorder text-polarMuted hover:text-polarText'
              }`}
            >
              {type === 'ALL' ? 'All Media' : type === 'PHOTO' ? 'Photographs' : 'Videos'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono-data text-polarMuted">Station:</span>
          <select
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            className="bg-surface2 border border-polarBorder text-polarText text-xs rounded px-2.5 py-1 font-mono-data focus:border-accent outline-none"
          >
            <option value="ALL">All Stations</option>
            <option value="sta-bharati">Bharati (Larsemann Hills)</option>
            <option value="sta-maitri">Maitri (Schirmacher Oasis)</option>
            <option value="sta-himadri">Himadri (Arctic Ny-Ålesund)</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {mediaList.map(item => (
          <div key={item.id} className="polar-card overflow-hidden flex flex-col justify-between">
            {/* Visual Thumbnail / Preview Placeholder */}
            <div className="h-48 bg-surface2/80 relative flex items-center justify-center border-b border-polarBorder">
              {item.type === 'PHOTO' ? (
                <div className="flex flex-col items-center space-y-2 text-polarMuted">
                  <Image className="w-12 h-12 text-accent/60" />
                  <span className="text-xs font-mono-data">Authoritative Photographic Record</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-polarMuted">
                  <Video className="w-12 h-12 text-warning/70" />
                  <span className="text-xs font-mono-data">Operational Expedition Video Broadcast</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-background/80 border border-polarBorder text-accent font-semibold uppercase">
                  {item.type}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant={item.verificationStatus === 'VERIFIED_REAL' ? 'VERIFIED' : 'CURRENT'} size="sm" />
              </div>
            </div>

            {/* Media Information */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-editorial font-bold text-polarText">
                  {item.title}
                </h3>
                <p className="text-xs text-polarMuted mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-polarBorder/60 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Credit / Creator:</span>
                  <span className="text-polarText font-medium">{item.creatorOrCredit}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Date Captured:</span>
                  <span className="text-polarText">{item.capturedAt || 'NCPOR Archive Record'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Rights Status:</span>
                  <span className="text-success font-medium">{item.rightsStatus}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Access Level:</span>
                  <span className="text-accent">{item.accessStatus}</span>
                </div>
              </div>

              {item.externalUrl && (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded bg-surface2 hover:bg-surface1 border border-polarBorder text-xs text-accent transition-colors font-mono-data"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Authoritative Source Record</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
