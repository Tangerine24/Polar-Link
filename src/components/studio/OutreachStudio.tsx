import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { AtomicClaim } from '../../types';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Send,
  Zap,
  BookOpen
} from 'lucide-react';

export const OutreachStudio: React.FC = () => {
  const navigate = useNavigate();
  const {
    stories,
    updateClaim,
    runClaimGuardOnStory,
    submitStoryForReview,
    currentRole
  } = usePolarStore();

  const activeStory = stories[0]; // Bharati thermal baseline story
  const [activeClaimId, setActiveClaimId] = useState<string>(activeStory.claims[0].claimId);

  const selectedClaim = activeStory.claims.find(c => c.claimId === activeClaimId) || activeStory.claims[0];

  // Planted error shortcuts for judge demo
  const plantNumberError = () => {
    updateClaim(activeStory.id, selectedClaim.claimId, {
      text: 'During January to February 2023, automated weather recordings at Bharati Station documented a mean surface air temperature of -4.2°C.',
      numbers: [-4.2]
    });
  };

  const plantLocationError = () => {
    updateClaim(activeStory.id, selectedClaim.claimId, {
      text: 'During January to February 2023, automated weather recordings documented a mean surface air temperature of -14.2°C.'
    });
  };

  const plantCertaintyError = () => {
    updateClaim(activeStory.id, selectedClaim.claimId, {
      text: 'Recordings at Bharati Station in Jan-Feb 2023 conclusively proves a permanent surface air temperature of -14.2°C.'
    });
  };

  const restoreValidClaim = () => {
    updateClaim(activeStory.id, selectedClaim.claimId, {
      text: 'During January to February 2023, automated weather recordings at Bharati Station documented a mean surface air temperature of -14.2°C.',
      numbers: [-14.2]
    });
  };

  const handleSubmit = () => {
    submitStoryForReview(activeStory.id);
    navigate('/studio/review');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Outreach Studio & Claim Guard</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Atomic Scientific Claim Composer
          </h1>
          <p className="text-xs text-polarMuted">
            Transform research findings into publicly communicable claims without losing numbers, spatial scope, or certainty hedging.
          </p>
        </div>

        {/* Demo Error Injection Panel for Judges */}
        <div className="flex flex-wrap items-center gap-2 bg-surface2 p-2 rounded border border-polarBorder">
          <span className="text-[10px] font-mono-data text-polarMuted px-2 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-warning" />
            <span className="font-semibold text-warning">DEMO ERROR INJECTORS:</span>
          </span>
          <button
            onClick={plantNumberError}
            className="px-2 py-1 rounded bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30 text-xs font-mono-data transition-colors"
          >
            Plant Number Error (-4.2°C)
          </button>
          <button
            onClick={plantLocationError}
            className="px-2 py-1 rounded bg-warning/15 hover:bg-warning/25 text-warning border border-warning/30 text-xs font-mono-data transition-colors"
          >
            Drop Location Scope
          </button>
          <button
            onClick={plantCertaintyError}
            className="px-2 py-1 rounded bg-warning/15 hover:bg-warning/25 text-warning border border-warning/30 text-xs font-mono-data transition-colors"
          >
            Inflate Certainty ("proves")
          </button>
          <button
            onClick={restoreValidClaim}
            className="px-2 py-1 rounded bg-success/20 hover:bg-success/30 text-success border border-success/40 text-xs font-mono-data transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore Valid</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Claims Ledger (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="polar-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
                Atomic Claims in Story
              </span>
              <span className="text-xs font-mono-data text-accent">
                {activeStory.claims.length} Units
              </span>
            </div>

            <div className="space-y-2">
              {activeStory.claims.map((claim, idx) => (
                <button
                  key={claim.claimId}
                  onClick={() => setActiveClaimId(claim.claimId)}
                  className={`w-full text-left p-3 rounded border text-xs transition-all space-y-2 ${
                    activeClaimId === claim.claimId
                      ? 'bg-surface2 border-accent text-polarText shadow-sm'
                      : 'bg-surface1 border-polarBorder text-polarMuted hover:text-polarText hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data font-semibold text-accent">
                      Unit 0{idx + 1}
                    </span>
                    <Badge variant={claim.guardStatus} size="sm" />
                  </div>
                  <p className="line-clamp-2 text-polarText leading-relaxed">
                    "{claim.text}"
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] font-mono-data text-polarMuted">
                    <span>Evidence: {claim.sourceEvidenceIds.length} bound</span>
                    <span>•</span>
                    <span>Lang: {claim.language}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upstream Finding Summary */}
          <div className="polar-card p-4 space-y-2 text-xs">
            <span className="text-[11px] font-mono-data uppercase tracking-wider text-polarMuted block">
              Originating Finding (F1)
            </span>
            <p className="text-polarText font-medium">
              Mid-Summer Surface Air Temperature Baseline at Bharati Station (-14.2°C)
            </p>
            <p className="text-polarMuted text-[11px]">
              Spatial Scope: Bharati Station, East Antarctica • Window: Jan-Feb 2023
            </p>
          </div>
        </div>

        {/* Right Column: Claim Guard Inspector & Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="polar-card p-6 space-y-5">
            {/* Unit Header */}
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <div>
                <h3 className="text-sm font-semibold text-polarText">
                  Atomic Claim Editor: {selectedClaim.claimId}
                </h3>
                <p className="text-xs text-polarMuted">
                  Edit the public outreach text. Claim Guard validates mathematical & scope preservation in real-time.
                </p>
              </div>
              <Badge variant={selectedClaim.guardStatus} />
            </div>

            {/* Claim Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-mono-data text-polarMuted flex justify-between">
                <span>Public Assertion Text</span>
                <span className="text-accent">Auto-analyzed by Claim Guard Engine</span>
              </label>
              <textarea
                value={selectedClaim.text}
                onChange={e =>
                  updateClaim(activeStory.id, selectedClaim.claimId, { text: e.target.value })
                }
                rows={4}
                className="w-full bg-surface2 border border-polarBorder rounded p-3 text-sm text-polarText leading-relaxed focus:border-accent focus:outline-none"
              />
            </div>

            {/* Claim Guard Analysis Feedback Box */}
            <div
              className={`p-4 rounded border space-y-2 text-xs transition-colors ${
                selectedClaim.guardStatus === 'SUPPORTED'
                  ? 'bg-success/10 border-success/40 text-success'
                  : selectedClaim.guardStatus === 'NUMBER_MISMATCH' ||
                    selectedClaim.guardStatus === 'UNIT_MISMATCH' ||
                    selectedClaim.guardStatus === 'UNSUPPORTED'
                  ? 'bg-danger/10 border-danger/40 text-danger'
                  : 'bg-warning/10 border-warning/40 text-warning'
              }`}
            >
              <div className="flex items-center space-x-2 font-semibold">
                {selectedClaim.guardStatus === 'SUPPORTED' ? (
                  <ShieldCheck className="w-4 h-4 text-success" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
                <span className="uppercase tracking-wider font-mono-data">
                  Claim Guard Status: {selectedClaim.guardStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-1 text-polarText/90">
                {selectedClaim.guardReasons.map((reason, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {reason}
                  </li>
                ))}
              </ul>

              {selectedClaim.suggestedFix && (
                <div className="pt-2 border-t border-current/20 text-xs font-mono-data">
                  <span className="font-bold">Suggested Remediation: </span>
                  <span>{selectedClaim.suggestedFix}</span>
                </div>
              )}
            </div>

            {/* Scope & Qualifier Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-data">
              <div className="p-2.5 rounded bg-surface2 border border-polarBorder">
                <span className="text-polarMuted block text-[10px]">Location Scope</span>
                <span className="text-polarText font-semibold">
                  {selectedClaim.scope.location || 'OMITTED (DRIFT)'}
                </span>
              </div>
              <div className="p-2.5 rounded bg-surface2 border border-polarBorder">
                <span className="text-polarMuted block text-[10px]">Temporal Scope</span>
                <span className="text-polarText font-semibold">
                  {selectedClaim.scope.temporal || 'OMITTED (DRIFT)'}
                </span>
              </div>
              <div className="p-2.5 rounded bg-surface2 border border-polarBorder">
                <span className="text-polarMuted block text-[10px]">Certainty Stance</span>
                <span className="text-polarText font-semibold">{selectedClaim.certainty}</span>
              </div>
            </div>
          </div>

          {/* Publication Safety Gate Pre-Flight Banner */}
          <div className="polar-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold text-polarText">
                    Publication Safety Gate: Pre-Flight Check
                  </h4>
                  <p className="text-xs text-polarMuted">
                    All claims must pass deterministic Claim Guard verification before editorial submission.
                  </p>
                </div>
              </div>
              <Badge variant={activeStory.safetyGate.status} />
            </div>

            {/* Checks list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-data">
              <div
                className={`p-2 rounded border ${
                  activeStory.safetyGate.checks.allClaimsSupported
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <span>Claims Supported: </span>
                <span className="font-bold">
                  {activeStory.safetyGate.checks.allClaimsSupported ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div
                className={`p-2 rounded border ${
                  activeStory.safetyGate.checks.noMismatches
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <span>No Mismatches: </span>
                <span className="font-bold">
                  {activeStory.safetyGate.checks.noMismatches ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div
                className={`p-2 rounded border ${
                  activeStory.safetyGate.checks.piiClear
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <span>PII Screened: </span>
                <span className="font-bold">
                  {activeStory.safetyGate.checks.piiClear ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div
                className={`p-2 rounded border ${
                  activeStory.safetyGate.checks.noEmbargoedSources
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <span>Embargo Free: </span>
                <span className="font-bold">
                  {activeStory.safetyGate.checks.noEmbargoedSources ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={activeStory.safetyGate.status === 'BLOCKED'}
                className="px-5 py-2 rounded bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:hover:bg-accent text-background font-semibold text-xs transition-all flex items-center space-x-2"
              >
                <span>Submit to Scientific Review Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
