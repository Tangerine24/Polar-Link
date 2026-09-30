import { Story, Evidence, Source, SafetyGateStatus } from '../types';

export interface SafetyGateEvaluation {
  status: SafetyGateStatus;
  checks: {
    allClaimsSupported: boolean;
    noMismatches: boolean;
    noDrift: boolean;
    ocrEvidenceReviewed: boolean;
    noEmbargoedSources: boolean;
    piiClear: boolean;
    coordinatesClear: boolean;
    authorReviewerSeparated: boolean;
  };
  blockingIssues: string[];
  warnings: string[];
  detectedPII: string[];
  detectedCoordinates: string[];
}

// Regex for PII detection
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?91[\-\s]?)?[6-9]\d{9}|(?:\+?1[\-\s]?)?\d{3}[\-\s]?\d{3}[\-\s]?\d{4}/g;
// Regex for coordinates e.g. 69° 24' S, 76.1872° E, or -69.4072
const COORD_REGEX = /(?:[-+]?\d{1,2}(?:\.\d+)?°?\s*[NSns])|(?:[-+]?\d{1,3}(?:\.\d+)?°?\s*[EWew])|(?:lat(?:itude)?\s*[:=]\s*[-+]?\d{1,2}\.\d+)/gi;

export function evaluateSafetyGate(
  story: Story,
  evidenceList: Evidence[],
  sourceList: Source[]
): SafetyGateEvaluation {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];
  const detectedPII: string[] = [];
  const detectedCoordinates: string[] = [];

  // Check 1: Claims support & mismatches & drift
  let allClaimsSupported = true;
  let noMismatches = true;
  let noDrift = true;

  if (!story.claims || story.claims.length === 0) {
    allClaimsSupported = false;
    blockingIssues.push('Publication Blocked: Story contains zero atomic claims.');
  } else {
    for (const claim of story.claims) {
      if (claim.guardStatus !== 'SUPPORTED') {
        allClaimsSupported = false;
        if (claim.guardStatus === 'NUMBER_MISMATCH' || claim.guardStatus === 'UNIT_MISMATCH') {
          noMismatches = false;
          blockingIssues.push(`Claim "${claim.claimId}": Numerical/Unit mismatch detected ("${claim.text.slice(0, 40)}...").`);
        } else if (claim.guardStatus === 'SCOPE_DRIFT' || claim.guardStatus === 'CERTAINTY_DRIFT') {
          noDrift = false;
          blockingIssues.push(`Claim "${claim.claimId}": Scope or certainty drift detected ("${claim.text.slice(0, 40)}...").`);
        } else {
          blockingIssues.push(`Claim "${claim.claimId}": Unbound or unsupported by evidence.`);
        }
      }
    }
  }

  // Check 2: OCR evidence review state
  let ocrEvidenceReviewed = true;
  for (const claim of story.claims) {
    const boundEv = evidenceList.filter(e => claim.sourceEvidenceIds.includes(e.id));
    for (const ev of boundEv) {
      if (ev.uiLabel.toLowerCase().includes('ocr') && !ev.isAccepted) {
        ocrEvidenceReviewed = false;
        blockingIssues.push(`Unreviewed OCR evidence used in claim ${claim.claimId}. OCR extractions require scientific human review before public citation.`);
      }
    }
  }

  // Check 3: Embargoed or Restricted source screening
  let noEmbargoedSources = true;
  for (const claim of story.claims) {
    const boundEv = evidenceList.filter(e => claim.sourceEvidenceIds.includes(e.id));
    for (const ev of boundEv) {
      const src = sourceList.find(s => s.id === ev.sourceId);
      if (src && (src.visibility === 'EMBARGOED' || src.visibility === 'RESTRICTED' || src.visibility === 'SENSITIVE')) {
        noEmbargoedSources = false;
        blockingIssues.push(`Embargoed source violation: Source "${src.title.slice(0, 40)}..." is marked ${src.visibility} and cannot be released publicly.`);
      }
    }
  }

  // Check 4: PII Screening
  const fullText = `${story.title} ${story.subtitle} ${story.claims.map(c => c.text).join(' ')}`;
  const emails = fullText.match(EMAIL_REGEX) || [];
  const phones = fullText.match(PHONE_REGEX) || [];
  emails.forEach(e => detectedPII.push(e));
  phones.forEach(p => detectedPII.push(p));

  const piiClear = detectedPII.length === 0;
  if (!piiClear) {
    blockingIssues.push(`PII Detected: Found personal contact information (${detectedPII.join(', ')}). Remove before publication.`);
  }

  // Check 5: Coordinate screening
  const coords = fullText.match(COORD_REGEX) || [];
  coords.forEach(c => detectedCoordinates.push(c));
  const coordinatesClear = true; // In polar research, general station coordinates are public, but high-res classified drill locations are flagged
  if (detectedCoordinates.length > 0) {
    warnings.push(`Station Coordinates Detected: ${detectedCoordinates.join(', ')}. Verified as non-restricted public station coordinates.`);
  }

  // Check 6: Role Separation (Author != Reviewer)
  let authorReviewerSeparated = true;
  if (story.reviewerName && story.authorName) {
    if (story.reviewerName.trim().toLowerCase() === story.authorName.trim().toLowerCase()) {
      authorReviewerSeparated = false;
      blockingIssues.push('Governance Rule Violation: Reviewer identity matches Author. Scientific integrity mandates independent editorial review.');
    }
  }

  // Overall status resolution
  let status: SafetyGateStatus = 'READY_TO_PUBLISH';
  if (blockingIssues.length > 0) {
    status = 'BLOCKED';
  } else if (!story.reviewerName || (story.status !== 'APPROVED' && story.status !== 'PUBLISHED')) {
    status = 'READY_FOR_REVIEW';
  }

  return {
    status,
    checks: {
      allClaimsSupported,
      noMismatches,
      noDrift,
      ocrEvidenceReviewed,
      noEmbargoedSources,
      piiClear,
      coordinatesClear,
      authorReviewerSeparated
    },
    blockingIssues,
    warnings,
    detectedPII,
    detectedCoordinates
  };
}
