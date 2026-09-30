import React, { useState } from 'react';
import { SEED_MEDIA } from '../../data/seedData';
import { Badge } from '../common/Badge';
import { Image, Video, ExternalLink, Shield, Filter, Search, Play, X, Maximize2 } from 'lucide-react';
import { Media } from '../../types';

export const MediaGallery: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMedia, setActiveMedia] = useState<Media | null>(null);

  const mediaList = SEED_MEDIA.filter(m => {
    if (filterType !== 'ALL' && m.type !== filterType) return false;
    if (selectedStation !== 'ALL' && m.stationId !== selectedStation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchCredit = m.creatorOrCredit.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCredit) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent font-semibold tracking-wider uppercase">SIH26063 Asset Class 4 & 5</span>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-polarText mt-1">
            Polar Media & Photographic Repository
          </h1>
          <p className="text-xs sm:text-sm text-polarMuted mt-1">
            Verified photographs, operational video recordings, and scientific media catalogued from NCPOR and MoES polar expeditions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="VERIFIED" label="Authoritative Provenance" />
          <span className="text-xs font-mono-data px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent font-medium">
            {mediaList.length} Verified Assets
          </span>
        </div>
      </div>

      {/* Provenance & Rights Policy */}
      <div className="p-3 bg-surface2/60 border border-polarBorder rounded text-xs text-polarMuted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-accent shrink-0" />
          <span>
            Media Integrity Policy: All entries preserve original metadata, institutional credit, and direct authoritative source links.
          </span>
        </div>
        <span className="font-mono-data text-[10px] text-accent hidden sm:inline">Open Access / PIB / Wikimedia Commons</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded bg-surface1 border border-polarBorder">
        {/* Media Type Tabs */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-polarMuted" />
          <span className="text-xs font-mono-data text-polarMuted">Type:</span>
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

        {/* Station Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-polarMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="bg-surface2 border border-polarBorder text-polarText text-xs rounded pl-8 pr-3 py-1 font-mono-data focus:border-accent outline-none w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center space-x-1.5">
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
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {mediaList.map(item => (
          <div key={item.id} className="polar-card overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-all duration-200">
            {/* Real Visual Thumbnail or Video Player Trigger */}
            <div 
              onClick={() => setActiveMedia(item)}
              className="h-56 bg-surface2 relative overflow-hidden cursor-pointer flex items-center justify-center border-b border-polarBorder"
            >
              {item.thumbnailPath ? (
                <img
                  src={item.thumbnailPath}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2 text-polarMuted">
                  {item.type === 'PHOTO' ? <Image className="w-12 h-12 text-accent/60" /> : <Video className="w-12 h-12 text-warning/70" />}
                  <span className="text-xs font-mono-data">Authoritative Record Preview</span>
                </div>
              )}

              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-background/80 backdrop-blur-sm border border-polarBorder text-accent font-semibold uppercase flex items-center space-x-1">
                  {item.type === 'PHOTO' ? <Image className="w-3 h-3 inline mr-1" /> : <Video className="w-3 h-3 inline mr-1" />}
                  {item.type}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <Badge variant={item.verificationStatus === 'VERIFIED_REAL' ? 'VERIFIED' : 'CURRENT'} size="sm" />
              </div>

              {/* Video Play Button Overlay */}
              {item.type === 'VIDEO' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/25 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Photo Zoom Hover Indicator */}
              {item.type === 'PHOTO' && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-surface1/90 text-polarText text-xs font-mono-data flex items-center space-x-1.5 shadow">
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    <span>View High-Res Photo</span>
                  </span>
                </div>
              )}
            </div>

            {/* Media Information */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-editorial font-bold text-polarText group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-polarMuted mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-polarBorder/60 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Credit / Institution:</span>
                  <span className="text-polarText font-medium text-right max-w-[65%] truncate">{item.creatorOrCredit}</span>
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

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => setActiveMedia(item)}
                  className="flex-1 py-2 px-3 rounded bg-surface2 hover:bg-surface1 border border-polarBorder text-xs text-polarText hover:text-accent transition-colors font-mono-data flex items-center justify-center space-x-1.5"
                >
                  {item.type === 'VIDEO' ? <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" /> : <Maximize2 className="w-3.5 h-3.5 text-accent" />}
                  <span>{item.type === 'VIDEO' ? 'Watch Video' : 'Enlarge Photo'}</span>
                </button>

                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded bg-accent/10 hover:bg-accent/20 border border-accent/30 text-xs text-accent transition-colors font-mono-data flex items-center justify-center space-x-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mediaList.length === 0 && (
        <div className="p-12 text-center border border-dashed border-polarBorder rounded-lg bg-surface1">
          <p className="text-sm font-mono-data text-polarMuted">No polar media records match the current filter or search criteria.</p>
          <button
            onClick={() => { setFilterType('ALL'); setSelectedStation('ALL'); setSearchQuery(''); }}
            className="mt-3 px-3 py-1.5 rounded text-xs font-mono-data bg-accent/10 border border-accent text-accent"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Media Lightbox / Video Player Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface1 border border-polarBorder rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-polarBorder flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-accent/15 border border-accent/30 text-accent font-semibold uppercase">
                  {activeMedia.type}
                </span>
                <h3 className="text-sm font-editorial font-bold text-polarText truncate max-w-lg">
                  {activeMedia.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1.5 rounded hover:bg-surface2 text-polarMuted hover:text-polarText transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High-res Photo or Video Embed */}
            <div className="p-4 overflow-y-auto space-y-4">
              {activeMedia.type === 'VIDEO' ? (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-polarBorder">
                  {activeMedia.embedUrl ? (
                    <iframe
                      src={activeMedia.embedUrl}
                      title={activeMedia.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-polarMuted">
                      <p className="text-xs font-mono-data mb-2">Video broadcast external reference:</p>
                      <a
                        href={activeMedia.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded bg-red-600 text-white font-mono-data text-xs flex items-center space-x-1.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch on Official Video Portal</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-h-[60vh] bg-surface2 rounded-lg overflow-hidden flex items-center justify-center border border-polarBorder">
                  <img
                    src={activeMedia.thumbnailPath}
                    alt={activeMedia.title}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
              )}

              {/* Description & Metadata */}
              <div className="space-y-3 bg-surface2/50 p-4 rounded-lg border border-polarBorder text-xs">
                <p className="text-polarText leading-relaxed">
                  {activeMedia.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-polarBorder/60 text-[11px] font-mono-data">
                  <div>
                    <span className="text-polarMuted">Credit: </span>
                    <span className="text-polarText">{activeMedia.creatorOrCredit}</span>
                  </div>
                  <div>
                    <span className="text-polarMuted">Date: </span>
                    <span className="text-polarText">{activeMedia.capturedAt || 'NCPOR Historical Archive'}</span>
                  </div>
                  <div>
                    <span className="text-polarMuted">Provenance: </span>
                    <span className="text-polarText">{activeMedia.provenance}</span>
                  </div>
                  <div>
                    <span className="text-polarMuted">Rights: </span>
                    <span className="text-success">{activeMedia.rightsStatus}</span>
                  </div>
                </div>

                {activeMedia.externalUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={activeMedia.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-accent text-xs font-mono-data hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Authoritative Institutional Source Page</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
