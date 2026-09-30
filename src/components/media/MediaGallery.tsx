import React, { useState, useMemo } from 'react';
import { SEED_MEDIA } from '../../data/seedData';
import { Badge } from '../common/Badge';
import { 
  Image as ImageIcon, 
  Video, 
  ExternalLink, 
  Shield, 
  Filter, 
  Search, 
  Play, 
  X, 
  Maximize2, 
  Calendar, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Media } from '../../types';

export const MediaGallery: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'TITLE'>('NEWEST');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMedia, setActiveMedia] = useState<Media | null>(null);

  // Extract all unique available years dynamically from media items
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    SEED_MEDIA.forEach(m => {
      if (m.capturedAt) {
        const y = new Date(m.capturedAt).getFullYear();
        if (!isNaN(y)) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  // Filter & Sort Pipeline
  const filteredMedia = useMemo(() => {
    return SEED_MEDIA.filter(m => {
      // 1. Filter by Media Type (Photo / Video)
      if (filterType !== 'ALL' && m.type !== filterType) {
        return false;
      }

      // 2. Filter by Station ID
      if (selectedStation !== 'ALL' && m.stationId !== selectedStation) {
        return false;
      }

      // 3. Filter by Date / Year parameter
      if (selectedYear !== 'ALL') {
        const itemYear = m.capturedAt ? new Date(m.capturedAt).getFullYear() : null;
        if (selectedYear === 'HISTORIC') {
          if (!itemYear || itemYear >= 2000) return false;
        } else {
          if (itemYear !== Number(selectedYear)) return false;
        }
      }

      // 4. Filter by Free-Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchCredit = m.creatorOrCredit.toLowerCase().includes(q);
        const matchStation = (m.stationId || '').toLowerCase().includes(q);
        const matchDate = (m.capturedAt || '').includes(q);
        if (!matchTitle && !matchDesc && !matchCredit && !matchStation && !matchDate) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'NEWEST') {
        const timeA = a.capturedAt ? new Date(a.capturedAt).getTime() : 0;
        const timeB = b.capturedAt ? new Date(b.capturedAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortOrder === 'OLDEST') {
        const timeA = a.capturedAt ? new Date(a.capturedAt).getTime() : 0;
        const timeB = b.capturedAt ? new Date(b.capturedAt).getTime() : 0;
        return timeA - timeB;
      }
      if (sortOrder === 'TITLE') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filterType, selectedStation, selectedYear, sortOrder, searchQuery]);

  const hasActiveFilters = filterType !== 'ALL' || selectedStation !== 'ALL' || selectedYear !== 'ALL' || searchQuery.trim() !== '';

  const resetAllFilters = () => {
    setFilterType('ALL');
    setSelectedStation('ALL');
    setSelectedYear('ALL');
    setSearchQuery('');
    setSortOrder('NEWEST');
  };

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
            Showing {filteredMedia.length} of {SEED_MEDIA.length} Assets
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

      {/* Multi-Parameter Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-surface1 border border-polarBorder space-y-4 shadow-sm">
        {/* Top Controls: Type Tabs & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Media Type Tabs */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono-data text-polarMuted flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-accent" />
              Type:
            </span>
            {(['ALL', 'PHOTO', 'VIDEO'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-xs font-mono-data border transition-colors flex items-center gap-1.5 ${
                  filterType === type
                    ? 'bg-accent/15 border-accent text-accent font-semibold shadow-sm'
                    : 'bg-surface2 border-polarBorder text-polarMuted hover:text-polarText'
                }`}
              >
                {type === 'ALL' && <Sparkles className="w-3 h-3" />}
                {type === 'PHOTO' && <ImageIcon className="w-3 h-3" />}
                {type === 'VIDEO' && <Video className="w-3 h-3" />}
                <span>{type === 'ALL' ? 'All Media' : type === 'PHOTO' ? 'Photos' : 'Videos'}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-polarMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic, creator..."
              className="w-full sm:w-64 bg-surface2 border border-polarBorder text-polarText text-xs rounded pl-8 pr-3 py-1.5 font-mono-data focus:border-accent outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-polarMuted hover:text-polarText"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Controls: Station Filter, Date Parameter Filter, and Sort */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-polarBorder/60 text-xs font-mono-data">
          {/* Station Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-polarMuted">Station:</span>
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
              className="bg-surface2 border border-polarBorder text-polarText rounded px-2.5 py-1 font-mono-data focus:border-accent outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All Stations (Any)</option>
              <option value="sta-bharati">Bharati (Larsemann Hills)</option>
              <option value="sta-maitri">Maitri (Schirmacher Oasis)</option>
              <option value="sta-dakshin-gangotri">Dakshin Gangotri (Ice Shelf)</option>
              <option value="sta-himadri">Himadri (Arctic Ny-Ålesund)</option>
            </select>
          </div>

          {/* Date Parameter Filter (User Requested) */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span className="text-polarMuted">Date / Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-surface2 border border-polarBorder text-polarText rounded px-2.5 py-1 font-mono-data focus:border-accent outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All Dates (1983 - Present)</option>
              {availableYears.map(yr => (
                <option key={yr} value={String(yr)}>
                  Year {yr}
                </option>
              ))}
              <option value="HISTORIC">Historic Archive (&lt; 2000)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-polarMuted" />
            <span className="text-polarMuted">Sort:</span>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="bg-surface2 border border-polarBorder text-polarText rounded px-2.5 py-1 font-mono-data focus:border-accent outline-none text-xs cursor-pointer"
            >
              <option value="NEWEST">Newest Date First</option>
              <option value="OLDEST">Oldest Date First</option>
              <option value="TITLE">Title (A - Z)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="ml-auto text-xs font-mono-data text-accent hover:text-accent/80 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-accent/5 border border-accent/20"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-polarBorder/40">
            <span className="text-[11px] font-mono-data text-polarMuted">Active Filters:</span>
            {filterType !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-data bg-accent/10 border border-accent/30 text-accent">
                Type: {filterType === 'PHOTO' ? 'Photos' : 'Videos'}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFilterType('ALL')} />
              </span>
            )}
            {selectedStation !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-data bg-accent/10 border border-accent/30 text-accent">
                Station: {
                  selectedStation === 'sta-bharati' ? 'Bharati' :
                  selectedStation === 'sta-maitri' ? 'Maitri' :
                  selectedStation === 'sta-dakshin-gangotri' ? 'Dakshin Gangotri' : 'Himadri'
                }
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedStation('ALL')} />
              </span>
            )}
            {selectedYear !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-data bg-accent/10 border border-accent/30 text-accent">
                Date: {selectedYear === 'HISTORIC' ? 'Pre-2000' : selectedYear}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedYear('ALL')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-data bg-accent/10 border border-accent/30 text-accent">
                Query: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredMedia.map(item => (
          <div key={item.id} className="polar-card overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-all duration-200">
            {/* Visual Thumbnail with Click Action */}
            <div 
              onClick={() => setActiveMedia(item)}
              className="h-60 bg-surface2 relative overflow-hidden cursor-pointer flex items-center justify-center border-b border-polarBorder"
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
                  {item.type === 'PHOTO' ? <ImageIcon className="w-12 h-12 text-accent/60" /> : <Video className="w-12 h-12 text-warning/70" />}
                  <span className="text-xs font-mono-data">Authoritative Record Preview</span>
                </div>
              )}

              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-data bg-background/85 backdrop-blur-sm border border-polarBorder text-accent font-semibold uppercase flex items-center space-x-1 shadow-sm">
                  {item.type === 'PHOTO' ? <ImageIcon className="w-3 h-3 inline mr-1" /> : <Video className="w-3 h-3 inline mr-1" />}
                  {item.type}
                </span>
                {item.capturedAt && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-background/85 backdrop-blur-sm border border-polarBorder text-polarMuted flex items-center space-x-1 shadow-sm">
                    <Calendar className="w-2.5 h-2.5 text-accent inline mr-1" />
                    {item.capturedAt}
                  </span>
                )}
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
                  <span className="px-3 py-1.5 rounded-full bg-surface1/90 text-polarText text-xs font-mono-data flex items-center space-x-1.5 shadow-md">
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
                  <span className="text-polarMuted">Captured Date:</span>
                  <span className="text-polarText font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    {item.capturedAt || 'NCPOR Archive Record'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Station ID:</span>
                  <span className="text-accent font-mono-data">{item.stationId || 'Pan-Antarctic'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-polarMuted">Rights Status:</span>
                  <span className="text-success font-medium">{item.rightsStatus}</span>
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

      {/* Empty State when zero results match */}
      {filteredMedia.length === 0 && (
        <div className="p-12 text-center border border-dashed border-polarBorder rounded-xl bg-surface1 space-y-3">
          <Filter className="w-8 h-8 text-polarMuted mx-auto opacity-50" />
          <h3 className="text-sm font-editorial font-bold text-polarText">No Media Matching Selected Filters</h3>
          <p className="text-xs font-mono-data text-polarMuted max-w-md mx-auto">
            No polar records matched your combination of Type ({filterType}), Station ({selectedStation}), and Date ({selectedYear}).
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono-data bg-accent/15 border border-accent text-accent hover:bg-accent/25 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
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
                    <span className="text-polarMuted">Captured Date: </span>
                    <span className="text-polarText font-semibold">{activeMedia.capturedAt || 'NCPOR Historical Archive'}</span>
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
