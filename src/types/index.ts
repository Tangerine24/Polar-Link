// POLAR-LINK Domain Types (v3.0)

export type UserRole = 'Public' | 'Scientist' | 'Reviewer' | 'Admin';

export type SourceStatus = 'CURRENT' | 'CORRECTED' | 'UNDER_REVIEW' | 'ARCHIVED';

export type SourceClass =
  | 'OFFICIAL_GOVERNMENT'
  | 'OFFICIAL_DATA_PORTAL'
  | 'OFFICIAL_REPORT'
  | 'OFFICIAL_DATASET'
  | 'OFFICIAL_LIBRARY'
  | 'INSTITUTIONAL_ACTIVITY'
  | 'PEER_REVIEWED'
  | 'SECONDARY'
  | 'SYNTHETIC_TEST';

export type VerificationStatus =
  | 'VERIFIED_REAL'
  | 'DERIVED'
  | 'SYNTHETIC_TEST'
  | 'CATALOG_ONLY'
  | 'EXTERNAL_SOURCE'
  | 'CONFLICTING_EVIDENCE';

export type AssetClass =
  | 'REPORT'
  | 'DATASET'
  | 'PUBLICATION'
  | 'PHOTOGRAPH'
  | 'VIDEO'
  | 'ACTIVITY';

export type Visibility = 'PUBLIC' | 'INTERNAL' | 'EMBARGOED' | 'SENSITIVE' | 'RESTRICTED';

export type RelationshipStatus = 'VERIFIED' | 'DERIVED' | 'SUGGESTED' | 'UNVERIFIED' | 'REJECTED';

export type EvidenceState = 'DIRECT' | 'DERIVED' | 'RELATED' | 'UNVERIFIED';

export type LineageState = 'VERIFIED' | 'DERIVED' | 'INFERRED' | 'SUGGESTED' | 'UNKNOWN';

export type ClaimGuardStatus =
  | 'SUPPORTED'
  | 'NUMBER_MISMATCH'
  | 'UNIT_MISMATCH'
  | 'SCOPE_DRIFT'
  | 'CERTAINTY_DRIFT'
  | 'UNSUPPORTED'
  | 'UNBOUND';

export type SafetyGateStatus = 'BLOCKED' | 'READY_FOR_REVIEW' | 'READY_TO_PUBLISH';

export type OCRTruthStatus = 'OCR_EXTRACTED' | 'HUMAN_REVIEWED' | 'EVIDENCE_ACCEPTED';

export type OCRProcessStatus =
  | 'QUEUED'
  | 'RENDERING'
  | 'OCR_RUNNING'
  | 'TEXT_EXTRACTED'
  | 'OCR_REVIEW_REQUIRED'
  | 'READY'
  | 'FAILED';

export interface Station {
  id: string;
  name: string;
  hindiName: string;
  region: 'Antarctic' | 'Arctic' | 'Third Pole';
  coordinates: {
    lat: number;
    lng: number;
    elevationMeters: number;
  };
  commissionedYear: number;
  operationalStatus: 'Active (Year-Round)' | 'Active (Seasonal)' | 'Historical';
  description: string;
  factSource: string;
  connectedExpeditions: string[];
  primaryThemes: string[];
  findingsCount: number;
  datasetsCount: number;
}

export interface Expedition {
  id: string;
  code: string; // e.g. DEMO-A, DEMO-B
  name: string;
  stationId: string;
  season: string; // e.g. "2022-2023"
  leader: string;
  leaderAffiliation: string;
  dates: {
    start: string;
    end: string;
  };
  phases: string[];
  researchThemes: string[];
  summary: string;
  sourceDocId: string;
  publishedFindings: string[];
}

export interface Dataset {
  id: string;
  title: string;
  stationId: string;
  expeditionId: string;
  variable: string;
  unit: string;
  temporalCoverage: {
    start: string;
    end: string;
  };
  samplingFrequency: string;
  dataPoints: Array<{
    timestamp: string;
    value: number;
    sensorStatus: 'VALID' | 'SUSPECT' | 'FLAGGED';
  }>;
  statistics: {
    mean: number;
    min: number;
    max: number;
    count: number;
  };
  provenance: {
    instrument: string;
    calibrationDate: string;
    curator: string;
    doi?: string;
  };
  visibility: Visibility;
}

export interface OCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRBlock {
  id: string;
  pageNumber: number;
  box: OCRBoundingBox;
  extractedText: string;
  correctedText?: string;
  confidence: number;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface OCRPage {
  pageNumber: number;
  imageUrl?: string;
  blocks: OCRBlock[];
  pageText: string;
}

export interface OCRDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: OCRProcessStatus;
  progressPercent: number;
  pages: OCRPage[];
  truthLabel: string;
  sourceDocId?: string;
}

export interface Source {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  organization: string;
  sourceType: 'REPORT' | 'PEER_REVIEWED' | 'DATASET_DOC' | 'FIELD_LOG';
  sourceClass?: SourceClass;
  verificationStatus?: VerificationStatus;
  canonicalUrl?: string;
  retrievedAt?: string;
  sourceVersion?: string;
  status: SourceStatus;
  statusNotes?: string;
  visibility: Visibility;
  doi?: string;
  pageCount: number;
  scannedUrl?: string;
  passages: Passage[];
}

export interface Passage {
  id: string;
  sourceId: string;
  pageNumber: number;
  sectionTitle: string;
  text: string;
  isOCR: boolean;
  ocrBlockId?: string;
  ocrTruthStatus?: OCRTruthStatus;
  boundingBox?: OCRBoundingBox;
}

export interface Evidence {
  id: string;
  type: EvidenceState; // DIRECT | DERIVED | RELATED | UNVERIFIED
  sourceId: string;
  passageId?: string;
  datasetId?: string;
  quote?: string;
  derivationMethod?: 'mean' | 'min' | 'max' | 'count';
  filterRange?: {
    start: string;
    end: string;
  };
  calculatedValue?: number;
  unit?: string;
  uiLabel: string;
  isAccepted: boolean;
  verificationNotes?: string;
}

export interface Finding {
  id: string;
  code: string; // e.g. F1, F2
  title: string;
  stationId: string;
  expeditionId: string;
  sourceId: string;
  summary: string;
  evidenceIds: string[];
  publishedYear: number;
  canonicalNumbers: {
    value: number;
    unit: string;
    parameter: string;
  }[];
  temporalScope: string;
  geographicScope: string;
  certaintyLevel: 'Observed' | 'Indicative' | 'Projected';
  tags: string[];
}

export interface AtomicClaim {
  claimId: string;
  storyId?: string;
  text: string;
  sourceEvidenceIds: string[];
  numbers: number[];
  units: string[];
  scope: {
    location?: string;
    temporal?: string;
    sampleWindow?: string;
  };
  qualifiers: string[];
  certainty: 'CONFIRMED' | 'INDICATIVE' | 'EXPLORATORY';
  language: 'English' | 'Hindi';
  guardStatus: ClaimGuardStatus;
  guardReasons: string[];
  suggestedFix?: string;
  reviewStatus: 'UNREVIEWED' | 'ACCEPTED' | 'REJECTED' | 'CORRECTION_REQUESTED';
  reviewNotes?: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: 'General Public' | 'Students & Schools' | 'Policy Makers' | 'Scientific Media';
  language: 'English' | 'Hindi';
  findingId: string;
  claims: AtomicClaim[];
  authorRole: UserRole;
  authorName: string;
  reviewerName?: string;
  reviewerRole?: UserRole;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REVISE_REQUESTED';
  safetyGate: {
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
  };
  publishedAt?: string;
  receiptId?: string;
}

export interface LivingLineageNode {
  id: string;
  type: 'STORY' | 'CLAIM' | 'FINDING' | 'PASSAGE' | 'SOURCE' | 'DATASET' | 'EXPEDITION' | 'STATION';
  label: string;
  details: string;
  state: LineageState; // VERIFIED | DERIVED | INFERRED | SUGGESTED | UNKNOWN
  message?: string; // e.g. "Lineage incomplete: the source does not provide an original dataset identifier."
  url?: string;
}

export interface LivingLineageLink {
  sourceId: string;
  targetId: string;
  relationship: string;
  state: LineageState;
}

export interface Receipt {
  receiptId: string;
  storyId: string;
  storyTitle: string;
  publicationTimestamp: string;
  qrPayload: string;
  status: 'CURRENT' | 'UNDER_REVIEW' | 'REVOKED';
  statusReason?: string;
  sourceStatusSnapshot: SourceStatus;
  cryptographicHash: string; // Deterministic SHA-256 digest
  canonicalDigest?: string; // Explicit SHA-256
  signature?: string; // Real Ed25519 signature hex or "SIGNING UNAVAILABLE"
  publicKey?: string; // Ed25519 public key in SPKI/hex
  signatureState?: 'VERIFIED' | 'LOCAL_DEMO_SIGNATURE' | 'SIGNING_UNAVAILABLE';
  payloadVersion?: string;
  claimsSummary: {
    total: number;
    supported: number;
    directEvidenceCount: number;
    derivedEvidenceCount: number;
  };
  lineageNodes: LivingLineageNode[];
  lineageLinks: LivingLineageLink[];
  auditTrail: AuditEntry[];
}

export interface Media {
  id: string;
  type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'GRAPHIC';
  title: string;
  description: string;
  sourceId: string;
  stationId?: string;
  expeditionId?: string;
  activityId?: string;
  capturedAt?: string;
  creatorOrCredit: string;
  rightsStatus: string;
  accessStatus: 'PUBLIC' | 'RESTRICTED' | 'CATALOG_ONLY';
  externalUrl?: string;
  thumbnailPath?: string;
  embedUrl?: string;
  provenance: string;
  verificationStatus: VerificationStatus;
}

export interface Activity {
  id: string;
  title: string;
  dateOrRange: string;
  location?: string;
  activityType:
    | 'Outreach Event'
    | 'Science Festival'
    | 'School Interaction'
    | 'Exhibition'
    | 'Institutional Programme'
    | 'Public Lecture';
  sourceId: string;
  summary: string;
  audience: string;
  relatedMediaIds: string[];
  relatedPeopleIds: string[];
  relatedStationId?: string;
  relatedExpeditionId?: string;
  verificationStatus: VerificationStatus;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action:
    | 'CREATED'
    | 'EDITED'
    | 'CLAIM_GUARD_CHECK'
    | 'SUBMITTED'
    | 'REVIEWED'
    | 'APPROVED'
    | 'REJECTED'
    | 'PUBLISHED'
    | 'SOURCE_CORRECTED'
    | 'OCR_CORRECTED'
    | 'EVIDENCE_ACCEPTED';
  performedBy: string;
  role: UserRole;
  notes: string;
  affectedEntityId: string;
}

export interface DisseminationPack {
  storyId: string;
  receiptId: string;
  channels: {
    websiteArticle: {
      headline: string;
      body: string;
      verifiedReceiptBadge: string;
      canonicalUrl: string;
    };
    socialPost: {
      text: string;
      hashtags: string[];
      characterCount: number;
      previewPlatform: 'Twitter/X' | 'LinkedIn' | 'Mastodon';
    };
    pressNote: {
      dateline: string;
      leadParagraph: string;
      bodyParagraphs: string[];
      scientificContact: string;
      embargoText: string;
    };
    embedCard: {
      htmlSnippet: string;
      cardDimensions: string;
    };
  };
  exportJson: string;
}

export interface Relationship {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  targetEntityId: string;
  targetEntityType: string;
  relationshipType: string;
  status: RelationshipStatus;
  confidenceScore?: number;
  reason: string;
  verifiedBy?: string;
  verifiedAt?: string;
}
