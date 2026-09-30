import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  FileText,
  Database,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const EvidenceReader: React.FC = () => {
  const { findingId } = useParams<{ findingId?: string }>();
  const { findings, sources, evidence, datasets, stations } = usePolarStore();

  const activeFinding = findings.find(f => f.id === findingId) || findings[0];
  const activeSource = sources.find(s => s.id === activeFinding.sourceId) || sources[0];
  const station = stations.find(s => s.id === activeFinding.stationId);

  // Evidence attached to this finding
  const findingEvidence = evidence.filter(e => activeFinding.evidenceIds.includes(e.id));
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    findingEvidence[0]?.id || ''
  );

  const activeEvidence = findingEvidence.find(e => e.id === selectedEvidenceId) || findingEvidence[0];

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
            <span>Station: {station?.name}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent">Finding {activeFinding.code}</span>
          </div>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            {activeFinding.title}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="VERIFIED" label="Evidence-Bound Finding" />
          <Link
            to="/studio/compose"
            className="px-3 py-1.5 rounded bg-accent text-background font-medium text-xs hover:bg-accent/90 transition-colors flex items-center space-x-1"
          >
            <span>Compose Claim from this Finding</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Finding & Evidence Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Finding Meta & Canonical Numbers (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="polar-card p-5 space-y-4">
            <h2 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-accent" />
              <span>Scientific Assertion & Scope</span>
            </h2>

            <p className="text-xs text-polarText leading-relaxed">
              {activeFinding.summary}
            </p>

            {/* Scope Ledger */}
            <div className="space-y-2 border-t border-polarBorder/60 pt-3 text-xs">
              <div className="flex justify-between py-1 border-b border-polarBorder/30">
                <span className="text-polarMuted font-mono-data">Geographic Scope:</span>
                <span className="text-polarText font-medium text-right">{activeFinding.geographicScope}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-polarBorder/30">
                <span className="text-polarMuted font-mono-data">Temporal Window:</span>
                <span className="text-polarText font-medium">{activeFinding.temporalScope}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-polarBorder/30">
                <span className="text-polarMuted font-mono-data">Certainty Level:</span>
                <span className="text-success font-medium">{activeFinding.certaintyLevel}</span>
              </div>
            </div>

            {/* Canonical Measured Numbers */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono-data uppercase tracking-wider text-polarMuted block">
                Canonical Evidence Measurements
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activeFinding.canonicalNumbers.map((cn, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-surface2 border border-polarBorder flex items-center justify-between"
                  >
                    <span className="text-xs text-polarMuted">{cn.parameter}</span>
                    <span className="font-mono-data text-sm font-bold text-accent">
                      {cn.value} {cn.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence Selector List */}
          <div className="polar-card p-5 space-y-3">
            <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-accent" />
              <span>Bound Evidence Records ({findingEvidence.length})</span>
            </h3>

            <div className="space-y-2">
              {findingEvidence.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvidenceId(ev.id)}
                  className={`w-full text-left p-3 rounded border text-xs transition-all flex flex-col space-y-1.5 ${
                    activeEvidence?.id === ev.id
                      ? 'bg-accent/10 border-accent text-polarText shadow-sm'
                      : 'bg-surface2 border-polarBorder text-polarMuted hover:text-polarText hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-polarText">{ev.uiLabel}</span>
                    <Badge variant={ev.type} size="sm" />
                  </div>
                  {ev.quote && (
                    <p className="line-clamp-2 text-[11px] text-polarMuted italic">
                      "{ev.quote}"
                    </p>
                  )}
                  {ev.calculatedValue !== undefined && (
                    <span className="font-mono-data text-accent text-[11px]">
                      Value: {ev.calculatedValue} {ev.unit} (Method: {ev.derivationMethod})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Deep-Dive Reader Surface (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeEvidence ? (
            <div className="space-y-4">
              {/* Evidence Inspector Banner */}
              <div className="polar-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-polarBorder pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <div>
                      <h3 className="text-sm font-semibold text-polarText">
                        {activeEvidence.uiLabel}
                      </h3>
                      <p className="text-[11px] font-mono-data text-polarMuted">
                        Evidence Record ID: {activeEvidence.id} | State: {activeEvidence.type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={activeEvidence.type} />
                </div>

                {/* Direct Quote Paper Surface */}
                {activeEvidence.quote && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-data uppercase tracking-wider text-polarMuted">
                      Verbatim Passage Quote (Source: {activeSource.title})
                    </span>
                    <div className="paper-surface p-6 rounded-sm border-l-4 border-accent font-editorial text-sm leading-relaxed relative">
                      <div className="absolute top-2 right-2 text-[10px] font-mono-data text-polarMuted/70">
                        Passage ID: {activeEvidence.passageId || 'DIRECT-EXTRACT'}
                      </div>
                      <p className="text-paperText font-medium text-base">
                        "{activeEvidence.quote}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Derived Calculation Inspector */}
                {activeEvidence.type === 'DERIVED' && activeEvidence.datasetId && (
                  <div className="p-4 rounded bg-surface2 border border-polarBorder space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-accent" />
                        <span className="text-xs font-semibold text-polarText">
                          Calibrated Dataset Derivation
                        </span>
                      </div>
                      <Link
                        to={`/datasets/${activeEvidence.datasetId}`}
                        className="text-xs text-accent hover:underline flex items-center space-x-1"
                      >
                        <span>Open Dataset Lab</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-data">
                      <div className="p-2 rounded bg-surface1 border border-polarBorder">
                        <span className="text-polarMuted block text-[10px]">Method</span>
                        <span className="text-polarText font-bold uppercase">{activeEvidence.derivationMethod}</span>
                      </div>
                      <div className="p-2 rounded bg-surface1 border border-polarBorder">
                        <span className="text-polarMuted block text-[10px]">Result</span>
                        <span className="text-accent font-bold">
                          {activeEvidence.calculatedValue} {activeEvidence.unit}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-surface1 border border-polarBorder col-span-2">
                        <span className="text-polarMuted block text-[10px]">Date Range</span>
                        <span className="text-polarText">
                          {activeEvidence.filterRange?.start} to {activeEvidence.filterRange?.end}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Rationale */}
                <div className="p-3 rounded bg-surface2/60 border border-polarBorder text-xs text-polarMuted space-y-1">
                  <span className="font-mono-data text-[10px] text-accent block">
                    Curator Verification Notes:
                  </span>
                  <p>{activeEvidence.verificationNotes || 'Accepted under standard polar scientific data governance protocols.'}</p>
                </div>
              </div>

              {/* Source Document Context */}
              <div className="polar-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-accent" />
                    <span>Originating Source Document</span>
                  </h4>
                  <Badge variant={activeSource.status} label={`Source: ${activeSource.status}`} />
                </div>

                <div className="p-3 rounded bg-surface2 border border-polarBorder space-y-2">
                  <h5 className="text-sm font-semibold text-polarText">{activeSource.title}</h5>
                  <div className="text-xs text-polarMuted flex flex-wrap gap-x-4 gap-y-1">
                    <span>Authors: {activeSource.authors.join(', ')}</span>
                    <span>Year: {activeSource.publicationYear}</span>
                    <span>Org: {activeSource.organization}</span>
                  </div>
                  {activeSource.doi && (
                    <div className="font-mono-data text-xs text-accent">
                      DOI: {activeSource.doi}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="polar-card p-8 text-center text-polarMuted">
              Select an evidence item from the left panel to inspect its verified backing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
