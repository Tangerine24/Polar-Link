import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  CheckSquare,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  ExternalLink,
  Send,
  Eye
} from 'lucide-react';

export const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  const {
    stories,
    evidence,
    sources,
    approveStory,
    publishStory,
    currentRole,
    setRole
  } = usePolarStore();

  const activeStory = stories[0];
  const [reviewerName, setReviewerName] = useState('Prof. A. Mukherjee');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const totalClaims = activeStory.claims.length;
  const supportedClaims = activeStory.claims.filter(c => c.guardStatus === 'SUPPORTED').length;
  const flaggedClaims = activeStory.claims.filter(c => c.guardStatus !== 'SUPPORTED');

  const handleApprove = () => {
    if (activeStory.authorName.trim().toLowerCase() === reviewerName.trim().toLowerCase()) {
      alert('Governance Violation: Reviewer cannot approve their own submission.');
      return;
    }
    approveStory(activeStory.id, reviewerName);
    setSuccessMsg('Story approved by independent reviewer. Ready for publication and receipt issuance.');
  };

  const handlePublish = () => {
    const rcpt = publishStory(activeStory.id, reviewerName);
    navigate(`/r/${rcpt.receiptId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Editorial Governance</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Scientific Claim Review Queue
          </h1>
          <p className="text-xs text-polarMuted">
            Scientists review atomic claims, not generic AI prose. Every claim must have reproducible evidence.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2">
          <Badge variant={activeStory.status} />
          {currentRole !== 'Reviewer' && (
            <button
              onClick={() => setRole('Reviewer')}
              className="px-3 py-1.5 rounded bg-warning/20 border border-warning/40 text-warning text-xs font-mono-data hover:bg-warning/30 transition-colors flex items-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Reviewer Role</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-success/15 border border-success/40 text-success rounded text-xs flex items-center justify-between animate-fade-in">
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Total Claims</span>
          <span className="font-mono-data text-xl font-bold text-polarText">{totalClaims}</span>
        </div>
        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Supported</span>
          <span className="font-mono-data text-xl font-bold text-success">{supportedClaims}</span>
        </div>
        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Flagged / Drift</span>
          <span className={`font-mono-data text-xl font-bold ${flaggedClaims.length > 0 ? 'text-danger' : 'text-polarMuted'}`}>
            {flaggedClaims.length}
          </span>
        </div>
        <div className="polar-card p-4">
          <span className="text-[10px] font-mono-data uppercase text-polarMuted block">Evidence Coverage</span>
          <span className="font-mono-data text-xl font-bold text-accent">
            {((supportedClaims / totalClaims) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Claim-by-Claim Inspection Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-polarText uppercase font-mono-data tracking-wider">
            Claim Inspection Ledger (Flagged Prioritized First)
          </h2>
          <span className="text-xs text-polarMuted font-mono-data">Author: {activeStory.authorName}</span>
        </div>

        <div className="space-y-3">
          {activeStory.claims.map((claim, idx) => {
            const boundEv = evidence.filter(e => claim.sourceEvidenceIds.includes(e.id));
            const isFlagged = claim.guardStatus !== 'SUPPORTED';

            return (
              <div
                key={claim.claimId}
                className={`polar-card p-5 space-y-3 border-l-4 transition-all ${
                  isFlagged ? 'border-l-danger bg-danger/5' : 'border-l-success'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono-data text-xs text-accent font-semibold">
                        Claim {idx + 1} ({claim.claimId})
                      </span>
                      <Badge variant={claim.guardStatus} size="sm" />
                      <Badge variant={claim.reviewStatus} size="sm" />
                    </div>
                    <p className="text-sm text-polarText font-medium leading-relaxed">
                      "{claim.text}"
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/studio/compose')}
                    className="text-xs text-polarMuted hover:text-accent font-mono-data whitespace-nowrap"
                  >
                    Edit in Studio →
                  </button>
                </div>

                {/* Evidence snippet */}
                <div className="p-3 rounded bg-surface2 border border-polarBorder space-y-2 text-xs">
                  <div className="flex items-center justify-between text-polarMuted font-mono-data text-[10px]">
                    <span>BOUND SCIENTIFIC EVIDENCE:</span>
                    <span>{boundEv.length} Evidence Records</span>
                  </div>
                  {boundEv.map(ev => (
                    <div key={ev.id} className="flex items-start justify-between gap-2 border-t border-polarBorder/40 pt-1.5 first:border-0 first:pt-0">
                      <div>
                        <span className="font-semibold text-polarText">{ev.uiLabel}</span>
                        {ev.quote && (
                          <p className="text-polarMuted italic text-[11px] mt-0.5">
                            "{ev.quote}"
                          </p>
                        )}
                        {ev.calculatedValue !== undefined && (
                          <p className="text-accent font-mono-data text-[11px] mt-0.5">
                            Calculated: {ev.calculatedValue} {ev.unit}
                          </p>
                        )}
                      </div>
                      <Badge variant={ev.type} size="sm" />
                    </div>
                  ))}
                </div>

                {/* Claim Guard issue explanation if flagged */}
                {isFlagged && (
                  <div className="p-3 rounded bg-danger/10 border border-danger/30 text-xs text-danger space-y-1">
                    <span className="font-semibold font-mono-data block">Remediation Required:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-polarText/90">
                      {claim.guardReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Sign-off Box */}
      <div className="polar-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-polarBorder pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-sm font-semibold text-polarText">
                Publication Approval & Governance Check
              </h3>
              <p className="text-xs text-polarMuted">
                Reviewer role verification. An author cannot approve their own submission.
              </p>
            </div>
          </div>
          <Badge variant={activeStory.safetyGate.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-mono-data text-polarMuted block">Author of Submission</label>
            <input
              type="text"
              disabled
              value={activeStory.authorName}
              className="w-full p-2.5 rounded bg-surface2 border border-polarBorder text-polarText text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono-data text-polarMuted block">Assigned Editorial Reviewer</label>
            <input
              type="text"
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
              className="w-full p-2.5 rounded bg-surface2 border border-polarBorder text-polarText text-xs focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-polarBorder">
          <div className="text-xs text-polarMuted">
            {activeStory.status === 'APPROVED' ? (
              <span className="text-success font-medium">✓ Story Approved by {activeStory.reviewerName}. Ready to publish receipt.</span>
            ) : (
              <span>Requires approval before issuing scientific receipt.</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {activeStory.status !== 'APPROVED' && activeStory.status !== 'PUBLISHED' && (
              <button
                onClick={handleApprove}
                disabled={activeStory.safetyGate.status === 'BLOCKED'}
                className="px-4 py-2 rounded bg-surface2 hover:bg-surface1 border border-polarBorder text-accent hover:border-accent text-xs font-semibold transition-colors disabled:opacity-40"
              >
                Approve Story Claims
              </button>
            )}

            <button
              onClick={handlePublish}
              disabled={activeStory.status !== 'APPROVED' && activeStory.status !== 'PUBLISHED'}
              className="px-5 py-2 rounded bg-success hover:bg-success/90 text-background font-semibold text-xs transition-colors flex items-center space-x-2 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>Publish & Generate Public Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
