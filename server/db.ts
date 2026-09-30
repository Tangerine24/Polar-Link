import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'polar_link.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Initialize SQLite Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      publicationYear INTEGER,
      organization TEXT,
      sourceType TEXT,
      sourceClass TEXT,
      verificationStatus TEXT,
      canonicalUrl TEXT,
      retrievedAt TEXT,
      currentVersion TEXT DEFAULT 'v1.0',
      status TEXT DEFAULT 'CURRENT',
      statusNotes TEXT,
      visibility TEXT DEFAULT 'PUBLIC',
      doi TEXT,
      pageCount INTEGER,
      passagesJson TEXT
    );

    CREATE TABLE IF NOT EXISTS source_versions (
      id TEXT PRIMARY KEY,
      sourceId TEXT NOT NULL,
      versionNumber TEXT NOT NULL,
      title TEXT NOT NULL,
      changesSummary TEXT,
      changedAt TEXT NOT NULL,
      changedBy TEXT NOT NULL,
      previousContentHash TEXT,
      newContentHash TEXT,
      FOREIGN KEY (sourceId) REFERENCES sources(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      fileName TEXT NOT NULL,
      fileSize TEXT,
      uploadedAt TEXT NOT NULL,
      status TEXT NOT NULL,
      progressPercent INTEGER DEFAULT 100,
      pagesJson TEXT NOT NULL,
      truthLabel TEXT,
      sourceDocId TEXT
    );

    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      sourceId TEXT NOT NULL,
      passageId TEXT,
      datasetId TEXT,
      quote TEXT,
      derivationMethod TEXT,
      calculatedValue REAL,
      unit TEXT,
      uiLabel TEXT NOT NULL,
      isAccepted INTEGER DEFAULT 1,
      verificationNotes TEXT
    );

    CREATE TABLE IF NOT EXISTS claims (
      claimId TEXT PRIMARY KEY,
      storyId TEXT,
      text TEXT NOT NULL,
      sourceEvidenceIdsJson TEXT NOT NULL,
      numbersJson TEXT,
      unitsJson TEXT,
      scopeJson TEXT,
      qualifiersJson TEXT,
      certainty TEXT,
      language TEXT,
      guardStatus TEXT NOT NULL,
      guardReasonsJson TEXT,
      reviewStatus TEXT DEFAULT 'UNREVIEWED'
    );

    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      targetAudience TEXT,
      language TEXT,
      findingId TEXT,
      claimsJson TEXT NOT NULL,
      authorRole TEXT,
      authorName TEXT,
      reviewerName TEXT,
      reviewerRole TEXT,
      status TEXT NOT NULL,
      safetyGateJson TEXT,
      publishedAt TEXT,
      receiptId TEXT
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      storyId TEXT NOT NULL,
      reviewerName TEXT NOT NULL,
      reviewerRole TEXT NOT NULL,
      decision TEXT NOT NULL,
      comments TEXT,
      reviewedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS receipts (
      receiptId TEXT PRIMARY KEY,
      storyId TEXT NOT NULL,
      storyTitle TEXT NOT NULL,
      publicationTimestamp TEXT NOT NULL,
      qrPayload TEXT NOT NULL,
      status TEXT NOT NULL,
      statusReason TEXT,
      sourceStatusSnapshot TEXT,
      cryptographicHash TEXT NOT NULL,
      canonicalDigest TEXT,
      signature TEXT,
      publicKey TEXT,
      signatureState TEXT,
      payloadVersion TEXT,
      claimsSummaryJson TEXT,
      lineageNodesJson TEXT,
      lineageLinksJson TEXT,
      canonicalPayloadRaw TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      performedBy TEXT NOT NULL,
      role TEXT NOT NULL,
      notes TEXT,
      affectedEntityId TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sourceId TEXT,
      stationId TEXT,
      expeditionId TEXT,
      activityId TEXT,
      capturedAt TEXT,
      creatorOrCredit TEXT,
      rightsStatus TEXT,
      accessStatus TEXT,
      externalUrl TEXT,
      thumbnailPath TEXT,
      provenance TEXT,
      verificationStatus TEXT
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      dateOrRange TEXT NOT NULL,
      location TEXT,
      activityType TEXT NOT NULL,
      sourceId TEXT,
      summary TEXT,
      audience TEXT,
      relatedMediaIdsJson TEXT,
      relatedPeopleIdsJson TEXT,
      relatedStationId TEXT,
      relatedExpeditionId TEXT,
      verificationStatus TEXT
    );

    CREATE TABLE IF NOT EXISTS planted_errors (
      id TEXT PRIMARY KEY,
      testCaseName TEXT NOT NULL,
      errorType TEXT NOT NULL,
      detected INTEGER NOT NULL,
      executedAt TEXT NOT NULL,
      details TEXT
    );
  `);
}
