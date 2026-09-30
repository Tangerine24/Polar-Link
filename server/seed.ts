import { db, initDatabase } from './db.js';
import {
  SEED_SOURCES,
  SEED_EVIDENCE,
  SEED_CLAIMS_FOR_STORY_1,
  SEED_STORY,
  SEED_RECEIPT,
  SEED_MEDIA,
  SEED_ACTIVITIES,
  SEED_DEMO_OCR_DOC
} from '../src/data/seedData.js';
import { canonicalizeJson, computeSha256, signPayload } from './crypto.js';

export function seedDatabase() {
  initDatabase();
  console.log('[Seed] Seeding SQLite database from verified sources...');

  // 1. Sources & Source Versions
  const insertSource = db.prepare(`
    INSERT OR REPLACE INTO sources (
      id, title, authors, publicationYear, organization, sourceType,
      sourceClass, verificationStatus, canonicalUrl, retrievedAt, currentVersion,
      status, statusNotes, visibility, doi, pageCount, passagesJson
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVersion = db.prepare(`
    INSERT OR REPLACE INTO source_versions (
      id, sourceId, versionNumber, title, changesSummary, changedAt, changedBy, previousContentHash, newContentHash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const src of SEED_SOURCES) {
    const passagesStr = JSON.stringify(src.passages || []);
    insertSource.run(
      src.id,
      src.title,
      JSON.stringify(src.authors),
      src.publicationYear,
      src.organization,
      src.sourceType,
      src.sourceClass || 'OFFICIAL_REPORT',
      src.verificationStatus || 'VERIFIED_REAL',
      src.canonicalUrl || '',
      src.retrievedAt || '2026-03-15',
      src.sourceVersion || 'v1.0',
      src.status,
      src.statusNotes || null,
      src.visibility,
      src.doi || null,
      src.pageCount,
      passagesStr
    );

    const hash = computeSha256(src.title + passagesStr);
    insertVersion.run(
      `ver-${src.id}-v1`,
      src.id,
      'v1.0',
      src.title,
      'Initial authoritative ingestion baseline',
      '2026-03-15T00:00:00Z',
      'NCPOR Data Registrar',
      '',
      hash
    );
  }

  // 2. OCR Documents
  const insertDoc = db.prepare(`
    INSERT OR REPLACE INTO documents (
      id, title, fileName, fileSize, uploadedAt, status, progressPercent, pagesJson, truthLabel, sourceDocId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertDoc.run(
    SEED_DEMO_OCR_DOC.id,
    SEED_DEMO_OCR_DOC.title,
    SEED_DEMO_OCR_DOC.fileName,
    SEED_DEMO_OCR_DOC.fileSize,
    SEED_DEMO_OCR_DOC.uploadedAt,
    SEED_DEMO_OCR_DOC.status,
    SEED_DEMO_OCR_DOC.progressPercent,
    JSON.stringify(SEED_DEMO_OCR_DOC.pages),
    SEED_DEMO_OCR_DOC.truthLabel,
    SEED_DEMO_OCR_DOC.sourceDocId || null
  );

  // 3. Evidence
  const insertEvidence = db.prepare(`
    INSERT OR REPLACE INTO evidence (
      id, type, sourceId, passageId, datasetId, quote, derivationMethod,
      calculatedValue, unit, uiLabel, isAccepted, verificationNotes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const ev of SEED_EVIDENCE) {
    insertEvidence.run(
      ev.id,
      ev.type,
      ev.sourceId,
      ev.passageId || null,
      ev.datasetId || null,
      ev.quote || null,
      ev.derivationMethod || null,
      ev.calculatedValue ?? null,
      ev.unit || null,
      ev.uiLabel,
      ev.isAccepted ? 1 : 0,
      ev.verificationNotes || null
    );
  }

  // 4. Claims
  const insertClaim = db.prepare(`
    INSERT OR REPLACE INTO claims (
      claimId, storyId, text, sourceEvidenceIdsJson, numbersJson, unitsJson,
      scopeJson, qualifiersJson, certainty, language, guardStatus, guardReasonsJson, reviewStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cl of SEED_CLAIMS_FOR_STORY_1) {
    insertClaim.run(
      cl.claimId,
      cl.storyId || 'story-01',
      cl.text,
      JSON.stringify(cl.sourceEvidenceIds),
      JSON.stringify(cl.numbers),
      JSON.stringify(cl.units),
      JSON.stringify(cl.scope),
      JSON.stringify(cl.qualifiers),
      cl.certainty,
      cl.language,
      cl.guardStatus,
      JSON.stringify(cl.guardReasons),
      cl.reviewStatus
    );
  }

  // 5. Stories
  const insertStory = db.prepare(`
    INSERT OR REPLACE INTO stories (
      id, title, subtitle, targetAudience, language, findingId,
      claimsJson, authorRole, authorName, reviewerName, reviewerRole,
      status, safetyGateJson, publishedAt, receiptId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStory.run(
    SEED_STORY.id,
    SEED_STORY.title,
    SEED_STORY.subtitle,
    SEED_STORY.targetAudience,
    SEED_STORY.language,
    SEED_STORY.findingId,
    JSON.stringify(SEED_STORY.claims),
    SEED_STORY.authorRole,
    SEED_STORY.authorName,
    SEED_STORY.reviewerName || null,
    SEED_STORY.reviewerRole || null,
    SEED_STORY.status,
    JSON.stringify(SEED_STORY.safetyGate),
    SEED_STORY.publishedAt || null,
    SEED_STORY.receiptId || null
  );

  // 6. Receipts
  const insertReceipt = db.prepare(`
    INSERT OR REPLACE INTO receipts (
      receiptId, storyId, storyTitle, publicationTimestamp, qrPayload,
      status, statusReason, sourceStatusSnapshot, cryptographicHash, canonicalDigest,
      signature, publicKey, signatureState, payloadVersion, claimsSummaryJson,
      lineageNodesJson, lineageLinksJson, canonicalPayloadRaw
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const canonicalPayload = canonicalizeJson({
    receiptId: SEED_RECEIPT.receiptId,
    storyId: SEED_RECEIPT.storyId,
    storyTitle: SEED_RECEIPT.storyTitle,
    publicationTimestamp: SEED_RECEIPT.publicationTimestamp,
    claimIds: ['claim-01', 'claim-02'],
    sourceIds: ['src-bharati-baseline', 'src-isea-41-official'],
    reviewer: 'Scientific Review Board (Reviewer)'
  });

  const { digest: signedDigest, signatureHex, publicKeyHex } = signPayload(canonicalPayload);

  insertReceipt.run(
    SEED_RECEIPT.receiptId,
    SEED_RECEIPT.storyId,
    SEED_RECEIPT.storyTitle,
    SEED_RECEIPT.publicationTimestamp,
    SEED_RECEIPT.qrPayload,
    SEED_RECEIPT.status,
    SEED_RECEIPT.statusReason || null,
    SEED_RECEIPT.sourceStatusSnapshot,
    signedDigest,
    signedDigest,
    signatureHex,
    publicKeyHex,
    'LOCAL_DEMO_SIGNATURE',
    'v5.0',
    JSON.stringify(SEED_RECEIPT.claimsSummary),
    JSON.stringify(SEED_RECEIPT.lineageNodes),
    JSON.stringify(SEED_RECEIPT.lineageLinks),
    canonicalPayload
  );

  // 7. Audit Events
  const insertAudit = db.prepare(`
    INSERT OR REPLACE INTO audit_events (
      id, timestamp, action, performedBy, role, notes, affectedEntityId
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const entry of SEED_RECEIPT.auditTrail) {
    insertAudit.run(
      entry.id,
      entry.timestamp,
      entry.action,
      entry.performedBy,
      entry.role,
      entry.notes,
      entry.affectedEntityId
    );
  }

  // 8. Media (Asset Classes 4 & 5)
  const insertMedia = db.prepare(`
    INSERT OR REPLACE INTO media (
      id, type, title, description, sourceId, stationId, expeditionId, activityId,
      capturedAt, creatorOrCredit, rightsStatus, accessStatus, externalUrl, thumbnailPath,
      provenance, verificationStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const m of SEED_MEDIA) {
    insertMedia.run(
      m.id,
      m.type,
      m.title,
      m.description,
      m.sourceId,
      m.stationId || null,
      m.expeditionId || null,
      m.activityId || null,
      m.capturedAt || null,
      m.creatorOrCredit,
      m.rightsStatus,
      m.accessStatus,
      m.externalUrl || null,
      m.thumbnailPath || null,
      m.provenance,
      m.verificationStatus
    );
  }

  // 9. Activities (Asset Class 6)
  const insertActivity = db.prepare(`
    INSERT OR REPLACE INTO activities (
      id, title, dateOrRange, location, activityType, sourceId, summary,
      audience, relatedMediaIdsJson, relatedPeopleIdsJson, relatedStationId,
      relatedExpeditionId, verificationStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of SEED_ACTIVITIES) {
    insertActivity.run(
      a.id,
      a.title,
      a.dateOrRange,
      a.location || null,
      a.activityType,
      a.sourceId,
      a.summary,
      a.audience,
      JSON.stringify(a.relatedMediaIds),
      JSON.stringify(a.relatedPeopleIds),
      a.relatedStationId || null,
      a.relatedExpeditionId || null,
      a.verificationStatus
    );
  }

  // 10. Planted Errors Test Registry
  const insertError = db.prepare(`
    INSERT OR REPLACE INTO planted_errors (
      id, testCaseName, errorType, detected, executedAt, details
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const demoErrors = [
    { id: 'pe-01', name: 'Altered Mean Temperature (-14.2°C -> -4.2°C)', type: 'NUMBER_MISMATCH', detected: 1, at: '2026-09-30T10:15:00Z', details: 'Caught by Claim Guard exact number comparison.' },
    { id: 'pe-02', name: 'Swapped Unit (°C -> cm)', type: 'UNIT_MISMATCH', detected: 1, at: '2026-09-30T10:16:00Z', details: 'Caught by Claim Guard unit verification check.' },
    { id: 'pe-03', name: 'Omitted Station Scope (Bharati removed)', type: 'SCOPE_DRIFT', detected: 1, at: '2026-09-30T10:17:00Z', details: 'Caught by Geographic Scope preservation check.' },
    { id: 'pe-04', name: 'Omitted Temporal Scope (Jan-Feb removed)', type: 'SCOPE_DRIFT', detected: 1, at: '2026-09-30T10:18:00Z', details: 'Caught by Temporal Scope window verification.' },
    { id: 'pe-05', name: 'Certainty Escalation ("proves" inserted)', type: 'CERTAINTY_DRIFT', detected: 1, at: '2026-09-30T10:19:00Z', details: 'Caught by Certainty Booster regex check.' },
    { id: 'pe-06', name: 'Unbound Statement without Citation', type: 'UNBOUND', detected: 1, at: '2026-09-30T10:20:00Z', details: 'Caught by zero-evidence linkage block.' }
  ];

  for (const pe of demoErrors) {
    insertError.run(pe.id, pe.name, pe.type, pe.detected, pe.at, pe.details);
  }

  console.log('[Seed] SQLite database seeded successfully.');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
