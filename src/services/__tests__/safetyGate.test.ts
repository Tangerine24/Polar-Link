import { describe, it, expect } from 'vitest';
import { evaluateSafetyGate } from '../safetyGate';
import { SEED_STORY, SEED_EVIDENCE, SEED_SOURCES } from '../../data/seedData';
import { Story } from '../../types';

describe('Publication Safety Gate & Governance Rules', () => {
  it('Approves valid story with verified claims, clear PII, and separated roles', () => {
    const res = evaluateSafetyGate(SEED_STORY, SEED_EVIDENCE, SEED_SOURCES);
    expect(res.checks.allClaimsSupported).toBe(true);
    expect(res.checks.noMismatches).toBe(true);
    expect(res.checks.piiClear).toBe(true);
    expect(res.checks.noEmbargoedSources).toBe(true);
    expect(res.checks.authorReviewerSeparated).toBe(true);
    expect(res.blockingIssues.length).toBe(0);
    expect(res.status).toBe('READY_TO_PUBLISH');
  });

  it('Blocks story when author attempts to review their own submission', () => {
    const violatingStory: Story = {
      ...SEED_STORY,
      authorName: 'Demo Scientist Alpha',
      reviewerName: 'Demo Scientist Alpha'
    };
    const res = evaluateSafetyGate(violatingStory, SEED_EVIDENCE, SEED_SOURCES);
    expect(res.checks.authorReviewerSeparated).toBe(false);
    expect(res.status).toBe('BLOCKED');
    expect(res.blockingIssues.some(b => b.includes('Governance Rule Violation'))).toBe(true);
  });

  it('Blocks story when personal PII (email/phone) is detected in outreach text', () => {
    const piiStory: Story = {
      ...SEED_STORY,
      subtitle: 'For queries, contact field lead at scientist.demo@example.org or call 9876543210'
    };
    const res = evaluateSafetyGate(piiStory, SEED_EVIDENCE, SEED_SOURCES);
    expect(res.checks.piiClear).toBe(false);
    expect(res.status).toBe('BLOCKED');
    expect(res.detectedPII.length).toBeGreaterThan(0);
  });

  it('Blocks story when claim binds to an EMBARGOED scientific source', () => {
    const embargoStory: Story = {
      ...SEED_STORY,
      claims: [
        {
          ...SEED_STORY.claims[0],
          sourceEvidenceIds: ['ev-embargo-test']
        }
      ]
    };
    const customEvidence = [
      ...SEED_EVIDENCE,
      {
        id: 'ev-embargo-test',
        type: 'DIRECT' as const,
        sourceId: 'src-embargo-2024',
        quote: 'Classified subglacial heat flux exceeding 85 mW/m2.',
        uiLabel: 'Embargoed Passage',
        isAccepted: true
      }
    ];

    const customSources = [
      ...SEED_SOURCES,
      {
        id: 'src-embargo-2024',
        title: 'Classified Subglacial Geothermal Survey',
        authors: ['Confidential Research Group'],
        publicationYear: 2024,
        organization: 'NCPOR Restricted Archives',
        sourceType: 'REPORT' as const,
        status: 'CURRENT' as const,
        visibility: 'EMBARGOED' as const,
        pageCount: 10,
        passages: []
      }
    ];

    const res = evaluateSafetyGate(embargoStory, customEvidence, customSources);
    expect(res.checks.noEmbargoedSources).toBe(false);
    expect(res.status).toBe('BLOCKED');
    expect(res.blockingIssues.some(b => b.includes('Embargoed source violation'))).toBe(true);
  });

  it('Blocks story when claim has uncorrected Claim Guard mismatch', () => {
    const brokenStory: Story = {
      ...SEED_STORY,
      claims: [
        {
          ...SEED_STORY.claims[0],
          guardStatus: 'NUMBER_MISMATCH',
          text: 'Temperature recorded at -4.2°C.'
        }
      ]
    };
    const res = evaluateSafetyGate(brokenStory, SEED_EVIDENCE, SEED_SOURCES);
    expect(res.checks.allClaimsSupported).toBe(false);
    expect(res.checks.noMismatches).toBe(false);
    expect(res.status).toBe('BLOCKED');
  });
});
