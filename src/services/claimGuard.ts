import { AtomicClaim, ClaimGuardStatus, Evidence, Finding } from '../types';

export interface ClaimGuardAnalysis {
  status: ClaimGuardStatus;
  score: number; // 0 - 100
  reasons: string[];
  suggestedFix?: string;
  detectedNumbers: number[];
  detectedUnits: string[];
  detectedLocations: string[];
  detectedCertainty: 'CONFIRMED' | 'INDICATIVE' | 'EXPLORATORY';
  bindingQuality: 'DIRECT' | 'DERIVED' | 'RELATED' | 'NONE';
}

const KNOWN_LOCATIONS = [
  'bharati',
  'maitri',
  'himadri',
  'himansh',
  'antarctica',
  'arctic',
  'third pole',
  'chandra basin',
  'sutri dhaka',
  'larsmann hills',
  'schirmacher oasis',
  'ny-ålesund',
  'ny-alesund',
  'kongsfjorden'
];

const CERTAINTY_BOOSTERS = [
  'proves',
  'proved',
  'conclusive',
  'conclusively',
  'indisputable',
  'guarantees',
  'definitively',
  'established beyond doubt'
];

const CERTAINTY_HEDGES = [
  'may indicate',
  'suggests',
  'indicates',
  'observed',
  'documented',
  'preliminary',
  'estimated',
  'correlated'
];

/**
 * Extracts floating-point and integer numbers from text (handles negative numbers e.g. -14.2)
 * Ignores 4-digit calendar years (1950-2050) so dates aren't flagged as unverified values.
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/(?:^|[^\w])(-?\d+(?:\.\d+)?)/g);
  if (!matches) return [];
  return matches
    .map(m => parseFloat(m.trim()))
    .filter(n => !isNaN(n))
    .filter(n => !(Number.isInteger(n) && n >= 1950 && n <= 2050));
}

/**
 * Extracts units from text
 */
export function extractUnits(text: string): string[] {
  const units: string[] = [];
  const lower = text.toLowerCase();
  if (lower.includes('°c') || lower.includes('deg c') || lower.includes('celsius')) units.push('°C');
  if (lower.includes('cm') || lower.includes('centimeter')) units.push('cm');
  if (lower.includes('ng/m³') || lower.includes('ng/m3')) units.push('ng/m³');
  if (lower.includes('μs/cm') || lower.includes('us/cm')) units.push('μS/cm');
  if (lower.includes('mw/m²') || lower.includes('mw/m2')) units.push('mW/m²');
  if (lower.includes('km') || lower.includes('kilometer')) units.push('km');
  return units;
}

/**
 * Checks if claim contains required location tags
 */
export function extractLocations(text: string): string[] {
  const lower = text.toLowerCase();
  return KNOWN_LOCATIONS.filter(loc => {
    // Word boundary check to prevent 'arctic' matching inside 'antarctica'
    const regex = new RegExp(`\\b${loc}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * Deterministic Claim Guard verification engine
 */
export function evaluateClaim(
  claim: AtomicClaim,
  availableEvidence: Evidence[],
  parentFinding?: Finding
): ClaimGuardAnalysis {
  const reasons: string[] = [];
  let status: ClaimGuardStatus = 'SUPPORTED';
  let score = 100;
  let suggestedFix: string | undefined = undefined;

  // 1. Check if claim is completely unbound from evidence
  if (!claim.sourceEvidenceIds || claim.sourceEvidenceIds.length === 0) {
    return {
      status: 'UNBOUND',
      score: 0,
      reasons: ['Claim has no bound evidence records. Scientific statements must link to direct or derived evidence.'],
      suggestedFix: 'Attach at least one direct passage or derived dataset calculation to this claim.',
      detectedNumbers: extractNumbers(claim.text),
      detectedUnits: extractUnits(claim.text),
      detectedLocations: extractLocations(claim.text),
      detectedCertainty: 'EXPLORATORY',
      bindingQuality: 'NONE'
    };
  }

  // 2. Resolve bound evidence
  const boundEvidence = availableEvidence.filter(e => claim.sourceEvidenceIds.includes(e.id));
  if (boundEvidence.length === 0) {
    return {
      status: 'UNBOUND',
      score: 10,
      reasons: ['Referenced evidence IDs do not exist in the active evidence repository.'],
      suggestedFix: 'Re-bind claim to valid indexed evidence passages.',
      detectedNumbers: extractNumbers(claim.text),
      detectedUnits: extractUnits(claim.text),
      detectedLocations: extractLocations(claim.text),
      detectedCertainty: 'EXPLORATORY',
      bindingQuality: 'NONE'
    };
  }

  // Check if bound evidence only contains RELATED or UNVERIFIED
  const hasDirectOrDerived = boundEvidence.some(e => e.type === 'DIRECT' || e.type === 'DERIVED');
  const bindingQuality = boundEvidence.some(e => e.type === 'DIRECT')
    ? 'DIRECT'
    : boundEvidence.some(e => e.type === 'DERIVED')
    ? 'DERIVED'
    : 'RELATED';

  if (!hasDirectOrDerived) {
    return {
      status: 'UNSUPPORTED',
      score: 25,
      reasons: ['Claim is bound only to contextual (RELATED) or UNVERIFIED evidence. DIRECT or DERIVED evidence is required for public science release.'],
      suggestedFix: 'Bind to an accepted direct report passage or calculated dataset derivation.',
      detectedNumbers: extractNumbers(claim.text),
      detectedUnits: extractUnits(claim.text),
      detectedLocations: extractLocations(claim.text),
      detectedCertainty: 'INDICATIVE',
      bindingQuality
    };
  }

  // 3. Extract numbers from claim text and compare against evidence & finding
  const claimNumbers = extractNumbers(claim.text);
  const evidenceQuotes = boundEvidence.map(e => e.quote || '').join(' ');
  const evidenceNumbers = extractNumbers(evidenceQuotes);
  
  // Include derived calculated numbers from evidence
  boundEvidence.forEach(e => {
    if (e.calculatedValue !== undefined && !evidenceNumbers.includes(e.calculatedValue)) {
      evidenceNumbers.push(e.calculatedValue);
    }
  });

  if (parentFinding) {
    parentFinding.canonicalNumbers.forEach(cn => {
      if (!evidenceNumbers.includes(cn.value)) evidenceNumbers.push(cn.value);
    });
  }

  // Check each number in claim: does it match canonical evidence?
  for (const cn of claimNumbers) {
    const matched = evidenceNumbers.some(en => Math.abs(en - cn) < 0.05);
    if (!matched) {
      status = 'NUMBER_MISMATCH';
      score = 20;
      reasons.push(
        `Number mismatch: The value "${cn}" appears in the claim but is not verified by bound evidence passages (${evidenceNumbers.join(', ')}).`
      );
      suggestedFix = `Correct numerical value to match the underlying evidence record (${evidenceNumbers[0] !== undefined ? evidenceNumbers[0] : 'verified number'}).`;
      break;
    }
  }

  // 4. Scope drift: Check location preservation if parent finding specifies one
  const claimLower = claim.text.toLowerCase();
  const detectedLocations = extractLocations(claim.text);

  if (parentFinding?.geographicScope) {
    const geoLower = parentFinding.geographicScope.toLowerCase();
    const expectedLocations = KNOWN_LOCATIONS.filter(loc => geoLower.includes(loc));
    const hasExpectedLocation = expectedLocations.some(loc => claimLower.includes(loc));

    if (expectedLocations.length > 0 && !hasExpectedLocation) {
      if (status === 'SUPPORTED') {
        status = 'SCOPE_DRIFT';
        score = 35;
      }
      reasons.push(
        `Geographic Scope Drift: Finding is specific to "${expectedLocations.join(', ')}", but the claim omits this mandatory spatial boundary.`
      );
      if (!suggestedFix) {
        suggestedFix = `Restore the location constraint (e.g. "${expectedLocations[0]}") to prevent misleading public overgeneralization.`;
      }
    }
  }

  // 5. Temporal scope check: Check if finding specifies dates that claim stripped
  if (parentFinding?.temporalScope) {
    const tempLower = parentFinding.temporalScope.toLowerCase();
    // Check key months or years
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan-feb', '2023', '2022', '2021'];
    const expectedTimes = months.filter(m => tempLower.includes(m));
    const hasExpectedTime = expectedTimes.some(m => claimLower.includes(m));

    if (expectedTimes.length > 0 && !hasExpectedTime) {
      if (status === 'SUPPORTED') {
        status = 'SCOPE_DRIFT';
        score = 40;
      }
      reasons.push(
        `Temporal Scope Drift: Evidence is scoped to temporal window "${parentFinding.temporalScope}", but the claim omits this timeframe.`
      );
      if (!suggestedFix) {
        suggestedFix = `Specify the observation window (e.g. "${parentFinding.temporalScope}") in the public statement.`;
      }
    }
  }

  // 6. Certainty drift: Check for unjustified certainty escalation
  const hasBooster = CERTAINTY_BOOSTERS.some(b => claimLower.includes(b));
  const hasHedge = CERTAINTY_HEDGES.some(h => claimLower.includes(h));

  if (hasBooster) {
    if (status === 'SUPPORTED') {
      status = 'CERTAINTY_DRIFT';
      score = 45;
    }
    reasons.push(
      'Certainty Drift: Claim uses definitive absolutes ("proves", "conclusively", "guarantees") while polar scientific evidence requires disciplined hedging.'
    );
    if (!suggestedFix) {
      suggestedFix = 'Replace absolute wording with scientific hedging: "observed", "documented", or "indicates".';
    }
  }

  // 7. Unit check
  const claimUnits = extractUnits(claim.text);
  if (parentFinding && parentFinding.canonicalNumbers.length > 0) {
    const expectedUnit = parentFinding.canonicalNumbers[0].unit;
    if (claimNumbers.length > 0 && claimUnits.length > 0 && !claimUnits.includes(expectedUnit)) {
      if (status === 'SUPPORTED') {
        status = 'UNIT_MISMATCH';
        score = 30;
      }
      reasons.push(`Unit Mismatch: Found "${claimUnits.join(', ')}", but evidence specifies "${expectedUnit}".`);
      if (!suggestedFix) suggestedFix = `Change unit to "${expectedUnit}".`;
    }
  }

  if (status === 'SUPPORTED') {
    reasons.push('Claim verified against bound evidence. Numbers, spatial scope, and certainty level strictly preserved.');
  }

  return {
    status,
    score,
    reasons,
    suggestedFix,
    detectedNumbers: claimNumbers,
    detectedUnits: claimUnits,
    detectedLocations,
    detectedCertainty: hasBooster ? 'CONFIRMED' : hasHedge ? 'INDICATIVE' : 'CONFIRMED',
    bindingQuality
  };
}
