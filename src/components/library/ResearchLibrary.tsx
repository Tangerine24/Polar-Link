import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  BookOpen,
  Search,
  FileText,
  Lock,
  ExternalLink,
  Shield,
  Filter
} from 'lucide-react';

export const ResearchLibrary: React.FC = () => {
  const { sources, currentRole } = usePolarStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Filter sources based on current role permissions & search
  const visibleSources = sources.filter(src => {
    // Embargo check: Public persona cannot see embargoed sources
    if (currentRole === 'Public' && src.visibility === 'EMBARGOED') {
      return false;
    }

    if (typeFilter !== 'ALL' && src.sourceType !== typeFilter) {
      return false;
    }

    if (
      searchTerm &&
      !src.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !src.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Peer-Reviewed & Technical Reports</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Polar Research Document Library
          </h1>
          <p className="text-xs text-polarMuted">
            Repository of technical expedition reports, peer-reviewed literature, and authenticated logbooks.
          </p>
        </div>

        <Badge variant="VERIFIED" label="NCPOR Digital Repository" />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface2 p-3 rounded border border-polarBorder">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-accent" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by report title, author, or keywords..."
            className="w-full bg-transparent text-xs text-polarText placeholder-polarMuted focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono-data">
          <Filter className="w-3.5 h-3.5 text-accent" />
          <span className="text-polarMuted">Type:</span>
          {['ALL', 'REPORT', 'PEER_REVIEWED', 'FIELD_LOG'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded border transition-colors ${
                typeFilter === t
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface1 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleSources.map(src => {
          const isEmbargoed = src.visibility === 'EMBARGOED';

          return (
            <div
              key={src.id}
              className={`polar-card p-5 space-y-3 flex flex-col justify-between border-l-4 ${
                isEmbargoed ? 'border-l-danger bg-danger/5' : 'border-l-accent'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={src.sourceType} size="sm" />
                  <Badge variant={src.visibility} size="sm" />
                </div>

                <h3 className="text-sm font-editorial font-bold text-polarText leading-snug">
                  {src.title}
                </h3>

                <p className="text-xs text-polarMuted line-clamp-1">
                  Authors: {src.authors.join(', ')} ({src.publicationYear})
                </p>

                <p className="text-[11px] text-polarMuted/80 font-mono-data">
                  {src.organization} • {src.pageCount} Pages
                </p>
              </div>

              <div className="pt-3 border-t border-polarBorder/40 flex items-center justify-between text-xs">
                {isEmbargoed ? (
                  <span className="text-danger flex items-center space-x-1 text-[11px] font-mono-data">
                    <Lock className="w-3 h-3" />
                    <span>EMBARGOED: Internal Review Only</span>
                  </span>
                ) : (
                  <span className="text-polarMuted font-mono-data text-[11px]">
                    {src.passages.length} Extracted Passages
                  </span>
                )}

                <Link
                  to="/evidence/find-f1"
                  className="text-accent hover:underline flex items-center space-x-1 font-mono-data"
                >
                  <span>Passages →</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
