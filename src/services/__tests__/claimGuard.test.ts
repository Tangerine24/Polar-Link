import { describe, it, expect } from 'vitest';
import { evaluateClaim, extractNumbers, extractUnits, extractLocations } from '../claimGuard';
import { SEED_EVIDENCE, SEED_FINDINGS } from '../../data/seedData';
import { AtomicClaim, Evidence } from '../../types';

describe('Claim Guard Rule Engine (Minimum 15 Edge Cases)', () => {
  const f1 = SEED_FINDINGS[0]; // Bharati Mean Temp -14.2°C, January to February 2022

  const testEvidenceSuite: Evidence[] = [
    ...SEED_EVIDENCE,
    {
      id: 'ev-unverified-f1',
      type: 'RELATED',
      sourceId: 'src-bharati-baseline',
      quote: 'Preliminary notes from uncalibrated backup logger.',
      uiLabel: 'Unverified Candidate',
      isAccepted: false
    },
    {
      id: 'ev-ocr-f1',
      type: 'DIRECT',
      sourceId: 'src-bharati-baseline',
      quote: 'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
      uiLabel: 'Reviewed OCR Passage',
      isAccepted: true
    }
  ];

  const baseValidClaim: AtomicClaim = {
    claimId: 'test-c1',
    text: 'During January to February 2022, automated weather recordings at Bharati Station documented a mean surface air temperature of -14.2°C.',
    sourceEvidenceIds: ['ev-direct-f1'],
    numbers: [-14.2],
    units: ['°C'],
    scope: { location: 'Bharati Station', temporal: 'January to February 2022' },
    qualifiers: ['automated recordings'],
    certainty: 'CONFIRMED',
    language: 'English',
    guardStatus: 'SUPPORTED',
    guardReasons: [],
    reviewStatus: 'UNREVIEWED'
  };

  // Case 1: Valid baseline claim
  it('Case 1: Valid claim with direct evidence, exact numbers and preserved scope is SUPPORTED', () => {
    const res = evaluateClaim(baseValidClaim, testEvidenceSuite, f1);
    expect(res.status).toBe('SUPPORTED');
    expect(res.score).toBe(100);
  });

  // Case 2: Number Mismatch (-14.2 changed to -4.2)
  it('Case 2: Changing -14.2 to -4.2 triggers NUMBER_MISMATCH', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'During January to February 2022, automated weather recordings at Bharati Station documented a mean surface air temperature of -4.2°C.',
      numbers: [-4.2]
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('NUMBER_MISMATCH');
    expect(res.reasons.some(r => r.includes('-4.2'))).toBe(true);
  });

  // Case 3: Dropped location scope (Bharati removed)
  it('Case 3: Removing Bharati location causes SCOPE_DRIFT', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'During January to February 2022, automated weather recordings documented a mean surface air temperature of -14.2°C.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('SCOPE_DRIFT');
    expect(res.reasons.some(r => r.includes('Geographic Scope Drift'))).toBe(true);
  });

  // Case 4: Dropped temporal scope (Jan-Feb removed)
  it('Case 4: Removing January to February causes SCOPE_DRIFT', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'Automated weather recordings at Bharati Station documented a mean surface air temperature of -14.2°C.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('SCOPE_DRIFT');
    expect(res.reasons.some(r => r.includes('Temporal Scope Drift'))).toBe(true);
  });

  // Case 5: Certainty drift: "proves" instead of observed
  it('Case 5: Changing wording to "proves" triggers CERTAINTY_DRIFT', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'During January to February 2022, recordings at Bharati Station conclusively proves a permanent surface air temperature of -14.2°C.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('CERTAINTY_DRIFT');
    expect(res.reasons.some(r => r.includes('Certainty Drift'))).toBe(true);
  });

  // Case 6: Certainty drift with "guarantees"
  it('Case 6: Absolute assertion "guarantees" triggers CERTAINTY_DRIFT', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'Recordings at Bharati Station in January to February 2022 guarantees that temperatures stay at -14.2°C.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('CERTAINTY_DRIFT');
  });

  // Case 7: Unbound claim (empty source evidence)
  it('Case 7: Free-form scientific assertion with empty sourceEvidenceIds is UNBOUND', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      sourceEvidenceIds: []
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('UNBOUND');
    expect(res.score).toBe(0);
  });

  // Case 8: Non-existent evidence ID is UNBOUND
  it('Case 8: Referencing an unknown evidence ID is UNBOUND', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      sourceEvidenceIds: ['ev-non-existent-999']
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('UNBOUND');
  });

  // Case 9: Bound only to RELATED evidence is UNSUPPORTED
  it('Case 9: Claim bound only to contextual (RELATED) evidence without direct proof is UNSUPPORTED', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      sourceEvidenceIds: ['ev-related-f1']
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('UNSUPPORTED');
  });

  // Case 10: Bound only to UNVERIFIED evidence is UNSUPPORTED
  it('Case 10: Claim bound only to UNVERIFIED evidence candidate is UNSUPPORTED', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      sourceEvidenceIds: ['ev-unverified-f1']
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('UNSUPPORTED');
  });

  // Case 11: Invented numbers (e.g. 52.8) trigger NUMBER_MISMATCH
  it('Case 11: Invented scientific numbers trigger NUMBER_MISMATCH', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'During January to February 2022, automated weather recordings at Bharati Station documented 52.8°C.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('NUMBER_MISMATCH');
  });

  // Case 12: Unit Mismatch (e.g. cm instead of °C)
  it('Case 12: Mismatched unit (cm instead of °C) triggers UNIT_MISMATCH', () => {
    const mutated: AtomicClaim = {
      ...baseValidClaim,
      text: 'During January to February 2022, automated weather recordings at Bharati Station documented a mean surface air temperature of -14.2 cm.'
    };
    const res = evaluateClaim(mutated, testEvidenceSuite, f1);
    expect(res.status).toBe('UNIT_MISMATCH');
  });

  // Case 13: Valid derived dataset calculation binding is SUPPORTED
  it('Case 13: Calculated derivation from dataset (DERIVED) is SUPPORTED', () => {
    const derivedClaim: AtomicClaim = {
      ...baseValidClaim,
      text: 'Analysis of AWS dataset records across January-February 2022 at Bharati Station calculated an average temperature of -14.2°C.',
      sourceEvidenceIds: ['ev-derived-f1']
    };
    const res = evaluateClaim(derivedClaim, testEvidenceSuite, f1);
    expect(res.status).toBe('SUPPORTED');
    expect(res.bindingQuality).toBe('DERIVED');
  });

  // Case 14: Valid OCR reviewed & accepted evidence is SUPPORTED
  it('Case 14: Human-reviewed and accepted OCR passage is SUPPORTED', () => {
    const ocrClaim: AtomicClaim = {
      ...baseValidClaim,
      text: 'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
      sourceEvidenceIds: ['ev-ocr-f1']
    };
    const res = evaluateClaim(ocrClaim, testEvidenceSuite, f1);
    expect(res.status).toBe('SUPPORTED');
  });

  // Case 15: Valid paraphrased rewording preserving meaning is SUPPORTED
  it('Case 15: Valid editorial rewording preserving exact number, location, and timeframe is SUPPORTED', () => {
    const reworded: AtomicClaim = {
      ...baseValidClaim,
      text: 'Instruments at Bharati recorded a mid-summer average of -14.2°C between January and February 2022.'
    };
    const res = evaluateClaim(reworded, testEvidenceSuite, f1);
    expect(res.status).toBe('SUPPORTED');
  });

  // Helper unit tests
  it('Number extractor accurately extracts negative decimals', () => {
    expect(extractNumbers('Temperature dropped to -14.2°C and peaked at 2.1°C')).toEqual([-14.2, 2.1]);
  });

  it('Unit extractor identifies °C and cm', () => {
    expect(extractUnits('Surface temp -14.2°C and snow depth 142 cm')).toEqual(['°C', 'cm']);
  });

  it('Location extractor recognizes Bharati and Antarctica', () => {
    expect(extractLocations('Scientific party at Bharati in East Antarctica')).toEqual(['bharati', 'antarctica']);
  });
});
