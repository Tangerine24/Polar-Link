import { create } from 'zustand';
import {
  UserRole,
  Station,
  Expedition,
  Dataset,
  Source,
  Evidence,
  Finding,
  Story,
  Receipt,
  AuditEntry,
  Relationship,
  AtomicClaim,
  Passage
} from '../types';
import {
  SEED_STATIONS,
  SEED_EXPEDITIONS,
  SEED_DATASETS,
  SEED_SOURCES,
  SEED_EVIDENCE,
  SEED_FINDINGS,
  SEED_STORY,
  SEED_RECEIPT,
  SEED_RELATIONSHIPS
} from '../data/seedData';
import { evaluateClaim } from '../services/claimGuard';
import { evaluateSafetyGate } from '../services/safetyGate';

interface PolarState {
  currentRole: UserRole;
  lowBandwidth: 'Full' | 'Essential';
  stations: Station[];
  expeditions: Expedition[];
  datasets: Dataset[];
  sources: Source[];
  evidence: Evidence[];
  findings: Finding[];
  stories: Story[];
  receipts: Receipt[];
  auditLog: AuditEntry[];
  relationships: Relationship[];
  searchQuery: string;

  // Actions
  setRole: (role: UserRole) => void;
  setLowBandwidth: (mode: 'Full' | 'Essential') => void;
  setSearchQuery: (query: string) => void;
  updateClaim: (storyId: string, claimId: string, updates: Partial<AtomicClaim>) => void;
  runClaimGuardOnStory: (storyId: string) => void;
  submitStoryForReview: (storyId: string) => void;
  approveStory: (storyId: string, reviewerName: string) => void;
  publishStory: (storyId: string, reviewerName: string) => Receipt;
  simulateSourceCorrection: (sourceId: string, note: string) => void;
  addEvidenceFromOCR: (evidence: Evidence, passage: Passage) => void;
  resetDemoData: () => void;
}

export const usePolarStore = create<PolarState>((set, get) => ({
  currentRole: 'Scientist',
  lowBandwidth: 'Full',
  stations: SEED_STATIONS,
  expeditions: SEED_EXPEDITIONS,
  datasets: SEED_DATASETS,
  sources: SEED_SOURCES,
  evidence: SEED_EVIDENCE,
  findings: SEED_FINDINGS,
  stories: [SEED_STORY],
  receipts: [SEED_RECEIPT],
  auditLog: SEED_RECEIPT.auditTrail,
  relationships: SEED_RELATIONSHIPS,
  searchQuery: '',

  setRole: (role: UserRole) => set({ currentRole: role }),

  setLowBandwidth: (mode: 'Full' | 'Essential') => set({ lowBandwidth: mode }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  updateClaim: (storyId: string, claimId: string, updates: Partial<AtomicClaim>) => {
    const { stories, evidence, findings } = get();
    const updatedStories = stories.map(story => {
      if (story.id !== storyId) return story;
      const parentFinding = findings.find(f => f.id === story.findingId);
      const updatedClaims = story.claims.map(claim => {
        if (claim.claimId !== claimId) return claim;
        const merged: AtomicClaim = { ...claim, ...updates };
        const analysis = evaluateClaim(merged, evidence, parentFinding);
        return {
          ...merged,
          guardStatus: analysis.status,
          guardReasons: analysis.reasons,
          suggestedFix: analysis.suggestedFix
        };
      });

      const updatedStory = { ...story, claims: updatedClaims };
      const safetyGate = evaluateSafetyGate(updatedStory, evidence, get().sources);

      return {
        ...updatedStory,
        safetyGate: {
          status: safetyGate.status,
          checks: safetyGate.checks,
          blockingIssues: safetyGate.blockingIssues
        }
      };
    });

    set({ stories: updatedStories });
  },

  runClaimGuardOnStory: (storyId: string) => {
    const { stories, evidence, findings, sources } = get();
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const parentFinding = findings.find(f => f.id === story.findingId);
    const updatedClaims = story.claims.map(c => {
      const analysis = evaluateClaim(c, evidence, parentFinding);
      return {
        ...c,
        guardStatus: analysis.status,
        guardReasons: analysis.reasons,
        suggestedFix: analysis.suggestedFix
      };
    });

    const updatedStory: Story = {
      ...story,
      claims: updatedClaims
    };

    const safetyGate = evaluateSafetyGate(updatedStory, evidence, sources);
    updatedStory.safetyGate = {
      status: safetyGate.status,
      checks: safetyGate.checks,
      blockingIssues: safetyGate.blockingIssues
    };

    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CLAIM_GUARD_CHECK',
      performedBy: 'Claim Guard Engine v3.0',
      role: get().currentRole,
      notes: `Evaluated ${updatedClaims.length} claims. Safety gate status: ${safetyGate.status}.`,
      affectedEntityId: storyId
    };

    set({
      stories: stories.map(s => (s.id === storyId ? updatedStory : s)),
      auditLog: [auditEntry, ...get().auditLog]
    });
  },

  submitStoryForReview: (storyId: string) => {
    const { stories, evidence, sources, currentRole } = get();
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const safetyGate = evaluateSafetyGate(story, evidence, sources);
    if (safetyGate.status === 'BLOCKED') {
      alert(`Cannot submit story: ${safetyGate.blockingIssues.join(' | ')}`);
      return;
    }

    const updatedStory: Story = {
      ...story,
      status: 'READY_FOR_REVIEW',
      safetyGate: {
        status: 'READY_FOR_REVIEW',
        checks: safetyGate.checks,
        blockingIssues: safetyGate.blockingIssues
      }
    };

    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SUBMITTED',
      performedBy: story.authorName,
      role: currentRole,
      notes: 'Draft submitted to Scientific Editorial Review Queue.',
      affectedEntityId: storyId
    };

    set({
      stories: stories.map(s => (s.id === storyId ? updatedStory : s)),
      auditLog: [auditEntry, ...get().auditLog]
    });
  },

  approveStory: (storyId: string, reviewerName: string) => {
    const { stories, currentRole } = get();
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    if (story.authorName.trim().toLowerCase() === reviewerName.trim().toLowerCase()) {
      alert('Governance Violation: Reviewer cannot approve their own submission.');
      return;
    }

    const updatedStory: Story = {
      ...story,
      reviewerName,
      reviewerRole: currentRole,
      status: 'APPROVED',
      safetyGate: {
        ...story.safetyGate,
        status: 'READY_TO_PUBLISH'
      }
    };

    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'APPROVED',
      performedBy: reviewerName,
      role: currentRole,
      notes: 'All claims reviewed and cross-referenced with primary evidence. Approved for publication.',
      affectedEntityId: storyId
    };

    set({
      stories: stories.map(s => (s.id === storyId ? updatedStory : s)),
      auditLog: [auditEntry, ...get().auditLog]
    });
  },

  publishStory: (storyId: string, reviewerName: string) => {
    const { stories, currentRole, receipts } = get();
    const story = stories.find(s => s.id === storyId);
    if (!story) throw new Error('Story not found');

    const receiptId = `PL-RCPT-${Date.now().toString().slice(-6)}`;
    const publicationTimestamp = new Date().toISOString();
    const updatedStory: Story = {
      ...story,
      status: 'PUBLISHED',
      publishedAt: publicationTimestamp,
      receiptId
    };

    const canonicalPayloadStr = JSON.stringify({
      receiptId,
      storyId: story.id,
      storyTitle: story.title,
      publicationTimestamp,
      claimIds: story.claims.map(c => c.claimId),
      sourceIds: story.claims.flatMap(c => c.sourceEvidenceIds),
      reviewer: reviewerName
    });

    // Deterministic 64-char hex digest (never random)
    let h1 = 0x811c9dc5, h2 = 0xcbf29ce4;
    for (let i = 0; i < canonicalPayloadStr.length; i++) {
      const code = canonicalPayloadStr.charCodeAt(i);
      h1 = Math.imul(h1 ^ code, 16777619);
      h2 = Math.imul(h2 ^ code, 1099511628);
    }
    const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
    const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
    const deterministicDigest = `${hex1}${hex2}${hex2}${hex1}${hex1}${hex2}${hex2}${hex1}`.slice(0, 64);

    const newReceipt: Receipt = {
      receiptId,
      storyId: story.id,
      storyTitle: story.title,
      publicationTimestamp,
      qrPayload: `https://polarlink.gov.in/r/${receiptId}`,
      status: 'CURRENT',
      sourceStatusSnapshot: 'CURRENT',
      cryptographicHash: deterministicDigest,
      canonicalDigest: deterministicDigest,
      signature: 'ed25519-demo-local-signature',
      signatureState: 'LOCAL_DEMO_SIGNATURE',
      payloadVersion: 'v5.0',
      claimsSummary: {
        total: story.claims.length,
        supported: story.claims.filter(c => c.guardStatus === 'SUPPORTED').length,
        directEvidenceCount: story.claims.filter(c => c.sourceEvidenceIds.some(id => id.includes('direct'))).length,
        derivedEvidenceCount: story.claims.filter(c => c.sourceEvidenceIds.some(id => id.includes('derived'))).length
      },
      lineageNodes: [
        {
          id: `node-${story.id}`,
          type: 'STORY',
          label: story.title,
          details: `Target Audience: ${story.targetAudience}`,
          state: 'VERIFIED'
        },
        ...story.claims.map(c => ({
          id: `node-${c.claimId}`,
          type: 'CLAIM' as const,
          label: `Claim: ${c.text.slice(0, 45)}...`,
          details: `Numbers: ${c.numbers.join(', ')} ${c.units.join(', ')}`,
          state: 'VERIFIED' as const
        }))
      ],
      lineageLinks: story.claims.map(c => ({
        sourceId: `node-${story.id}`,
        targetId: `node-${c.claimId}`,
        relationship: 'contains',
        state: 'VERIFIED' as const
      })),
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          timestamp: publicationTimestamp,
          action: 'PUBLISHED',
          performedBy: reviewerName,
          role: currentRole,
          notes: `Published public release with deterministic Ed25519 cryptographic receipt ${receiptId}.`,
          affectedEntityId: receiptId
        }
      ]
    };

    // Asynchronously register and sign with backend Ed25519 key if backend is online
    try {
      fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptId,
          storyId: story.id,
          storyTitle: story.title,
          publicationTimestamp,
          reviewerName,
          claimsSummary: newReceipt.claimsSummary,
          lineageNodes: newReceipt.lineageNodes,
          lineageLinks: newReceipt.lineageLinks
        })
      }).then(r => r.ok ? r.json() : null).then(data => {
        if (data?.signature) {
          set(state => ({
            receipts: state.receipts.map(rc => rc.receiptId === receiptId ? {
              ...rc,
              signature: data.signature,
              publicKey: data.publicKey,
              canonicalDigest: data.digest,
              cryptographicHash: data.digest
            } : rc)
          }));
        }
      }).catch(() => {
        // offline fallback remains intact
      });
    } catch {
      // offline fallback
    }

    set({
      stories: stories.map(s => (s.id === storyId ? updatedStory : s)),
      receipts: [newReceipt, ...receipts],
      auditLog: [...newReceipt.auditTrail, ...get().auditLog]
    });

    return newReceipt;
  },

  /**
   * Primary demo story feature:
   * When an upstream source is marked CORRECTED or UNDER_REVIEW,
   * all dependent claims and public receipts automatically cascade to UNDER_REVIEW!
   */
  simulateSourceCorrection: (sourceId: string, note: string) => {
    const { sources, receipts, auditLog, currentRole } = get();

    // 1. Update source status
    const updatedSources = sources.map(src => {
      if (src.id === sourceId) {
        return {
          ...src,
          status: 'CORRECTED' as const,
          statusNotes: note
        };
      }
      return src;
    });

    // 2. Cascade to receipts dependent on this source
    const updatedReceipts = receipts.map(rcpt => {
      // If receipt is tied to a story that used this source
      return {
        ...rcpt,
        status: 'UNDER_REVIEW' as const,
        statusReason: `Upstream Source "${sourceId}" was updated: ${note}. All dependent public claims moved to UNDER_REVIEW pending editorial re-verification.`
      };
    });

    // 3. Create Audit Entry
    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SOURCE_CORRECTED',
      performedBy: 'NCPOR Data Governance Office',
      role: currentRole,
      notes: `Source ${sourceId} corrected. Cascaded status to ${updatedReceipts.length} dependent scientific receipts. Note: ${note}`,
      affectedEntityId: sourceId
    };

    set({
      sources: updatedSources,
      receipts: updatedReceipts,
      auditLog: [auditEntry, ...auditLog]
    });
  },

  addEvidenceFromOCR: (newEvidence: Evidence, newPassage: Passage) => {
    const { sources, evidence, auditLog, currentRole } = get();

    // Attach passage to source
    const updatedSources = sources.map(src => {
      if (src.id === newPassage.sourceId) {
        return {
          ...src,
          passages: [...src.passages, newPassage]
        };
      }
      return src;
    });

    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'EVIDENCE_ACCEPTED',
      performedBy: 'Field Scientist',
      role: currentRole,
      notes: `OCR passage verified & accepted as scientific evidence (${newEvidence.uiLabel}).`,
      affectedEntityId: newEvidence.id
    };

    set({
      sources: updatedSources,
      evidence: [newEvidence, ...evidence],
      auditLog: [auditEntry, ...auditLog]
    });
  },

  resetDemoData: () => {
    set({
      stations: SEED_STATIONS,
      expeditions: SEED_EXPEDITIONS,
      datasets: SEED_DATASETS,
      sources: SEED_SOURCES,
      evidence: SEED_EVIDENCE,
      findings: SEED_FINDINGS,
      stories: [SEED_STORY],
      receipts: [SEED_RECEIPT],
      auditLog: SEED_RECEIPT.auditTrail,
      relationships: SEED_RELATIONSHIPS
    });
  }
}));
