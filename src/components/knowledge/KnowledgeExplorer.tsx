import React, { useState } from 'react';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  Share2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Shield,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { Relationship, RelationshipStatus } from '../../types';

export const KnowledgeExplorer: React.FC = () => {
  const { relationships } = usePolarStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = relationships.filter(rel => {
    if (filterStatus === 'ALL') return true;
    return rel.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Entity Resolution & Graph Governance</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Knowledge Explorer & Relationship Ledger
          </h1>
          <p className="text-xs text-polarMuted">
            Explore connections between stations, expeditions, datasets, and publications with honest, transparent relationship statuses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono-data">
          {['ALL', 'VERIFIED', 'SUGGESTED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded border transition-colors ${
                filterStatus === st
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface2 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Epistemic Rule Notice */}
      <div className="p-3 bg-surface2/60 border border-polarBorder rounded text-xs text-polarMuted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            Integrity Rule: AI suggestions never become verified automatically. Rejected links are preserved as negative evidence rather than deleted.
          </span>
        </div>
        <span className="font-mono-data text-[10px] text-accent">{filtered.length} Relationships</span>
      </div>

      {/* Relationships Table / Cards */}
      <div className="space-y-3">
        {filtered.map(rel => (
          <div
            key={rel.id}
            className={`polar-card p-5 space-y-3 border-l-4 transition-all ${
              rel.status === 'VERIFIED'
                ? 'border-l-success'
                : rel.status === 'SUGGESTED'
                ? 'border-l-warning'
                : 'border-l-danger'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 font-mono-data text-xs">
                <span className="text-accent font-semibold">{rel.sourceEntityType}: {rel.sourceEntityId}</span>
                <span className="text-polarMuted">──[{rel.relationshipType}]──▶</span>
                <span className="text-polarText font-semibold">{rel.targetEntityType}: {rel.targetEntityId}</span>
              </div>
              <Badge variant={rel.status} />
            </div>

            <p className="text-xs text-polarText leading-relaxed">
              <span className="text-polarMuted font-mono-data">Verification Rationale: </span>
              {rel.reason}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-polarBorder/40 text-[11px] font-mono-data text-polarMuted">
              <div>
                {rel.verifiedBy ? (
                  <span>Verified By: <span className="text-polarText">{rel.verifiedBy}</span> ({rel.verifiedAt})</span>
                ) : (
                  <span className="text-warning">Pending Human Verification • Confidence: {rel.confidenceScore}</span>
                )}
              </div>
              <div>ID: {rel.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
