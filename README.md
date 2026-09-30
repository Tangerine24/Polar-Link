# POLAR-LINK (v5.0) — SIH26063 Master Prototype
> **Evidence-First Access to Indian Polar Science**  
> *Every public scientific claim created through POLAR-LINK has a traceable receipt back to evidence.*

An independent, evidence-first integration and scientific outreach portal developed for **Smart India Hackathon 2026** (Problem ID: **SIH26063**, Ministry of Earth Sciences / National Centre for Polar and Ocean Research).

POLAR-LINK connects authoritative polar expedition records, scientific datasets, publications, photographic media, video archives, and institutional outreach activities into a verified, cryptographically signed dissemination workflow.

> [!NOTE]
> **Independent Outreach Layer**: POLAR-LINK is an independent research and media dissemination portal utilizing public NCPOR/MoES source records. It is not an official replacement for the institutional infrastructure of NCPOR or the National Polar Data Center (NPDC).

---

## 🏛️ Comprehensive SIH26063 Asset Coverage

POLAR-LINK provides unified search, relationship modeling, and provenance tracking across all **six required asset classes**:

1. **Expedition Reports**: NCPOR Scientific Reports and technical baseline documentation (e.g., Bharati Geodetic Baseline, 41st ISEA Expedition program).
2. **Scientific Datasets**: Automated Weather Station (AWS) surface meteorology time-series, glaciological accumulation logs, and limnological indices.
3. **Publications**: Peer-reviewed polar science papers and NCPOR Digital Library repository records.
4. **Photographs**: Verified high-resolution imagery with metadata, provenance, and rights status (`/media`).
5. **Videos**: Operational expedition embarkation broadcasts and field documentaries with transcript references (`/media`).
6. **Institutional Activities**: Science festivals, school interactions, National Science Day teleconferences, and Antarctic governance workshops (`/activities`).

---

## 🧭 Core Architectural Capabilities

1. **Official-Source-First Provenance**: Every factual claim is anchored to verified records (`data/source-manifest.json`). Synthetic test records are strictly isolated and labeled `ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE` (`DEMO-BHR-001`).
2. **Deterministic Claim Guard Engine**: Pure rule engine catching:
   - `NUMBER_MISMATCH` (e.g. -14.2°C changed to -4.2°C)
   - `UNIT_MISMATCH` (e.g. °C swapped for cm)
   - `SCOPE_DRIFT` (dropping station location or temporal observation window)
   - `CERTAINTY_DRIFT` (converting hedging/observed to "conclusively proves")
   - `UNSUPPORTED` & `UNBOUND` assertions
3. **Publication Safety Gate**: Pre-flight verification screening for PII, sensitive coordinates, embargoed classifications, and mandatory Author/Reviewer role separation.
4. **Cryptographic Proofs & Real Ed25519 Signing**: Canonical JSON payload serialization, deterministic SHA-256 digest calculation, and real Ed25519 asymmetric signature generation and verification.
5. **Living Lineage & Source Correction Cascade**: When an upstream scientific source is amended to `v2.0`, all dependent public claims and receipts automatically transition to `UNDER REVIEW`.
6. **Persistent Thin Backend (SQLite)**: Built-in `node:sqlite` persistence for sources, version histories, audit trails, and reviews.
7. **Event-Driven Trust Dashboard**: Replaces all hardcoded percentages with dynamic metrics computed directly from stored audit events. Shows `Not measured` when denominators are zero.
8. **100% Offline Capable**: Zero runtime Google Fonts or CDN dependencies.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node.js v24.21.0)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed SQLite Database
```bash
npm run seed
```

### 3. Start Backend Server
```bash
npm run server
# Starts HTTP API at http://localhost:3001
```

### 4. Start Frontend Development Server
```bash
npm run dev
# Starts Vite dev server at http://localhost:5173 with /api proxy to port 3001
```

### 5. Run Verification Suite
```bash
# Run Vitest test suite (23+ unit tests)
npm test

# Run full TypeScript check and tests
npm run check

# Build production bundle
npm run build
```

---

## 🔬 Judge Demo Walkthrough (End-to-End Slice)

1. **Real Source Discovery (`/`)**: Explore the cartographically accurate 2D Polar Observatory showing Bharati (-69.4068, 76.1953) and Maitri (-70.766, 11.7308) anchored on Antarctic rock/land.
2. **Unified Search (`/library`)**: Search across reports, datasets, publications, photographs, and institutional activities with source-class filters.
3. **Evidence Reader (`/evidence/find-f1`)**: Inspect mid-summer temperature observation (-14.2°C) linked to verbatim report passages and calculated AWS time-series.
4. **OCR Studio (`/studio/ocr/ocr-doc-demo-01`)**: Inspect illustrative scanned document `DEMO-BHR-001`, edit OCR text, and promote to an accepted Evidence Candidate.
5. **Outreach Studio (`/studio/compose`)**: Inject intentional errors (wrong number, dropped scope, inflated certainty) and watch Claim Guard block them.
6. **Safety Gate & Review Queue (`/studio/review`)**: Switch persona to Reviewer, verify governance separation, approve the draft, and publish.
7. **Cryptographic Receipt (`/r/PL-RCPT-2026-0930-BHR01`)**: Click **"Verify Cryptographic Signature"** to execute real-time Ed25519 signature and deterministic SHA-256 verification.
8. **Living Lineage Cascade**: Click **"Simulate Source Correction"** on the receipt. Watch the receipt and living lineage graph automatically flip to **`UNDER REVIEW`** with an audit event recorded in SQLite.
9. **Trust Dashboard (`/studio/coverage`)**: Inspect real event-driven metrics (evidence coverage, planted error catch rate, review turnaround, and cascade impact) with dynamic denominators.

---

## 🛡️ Provenance & Data Policy

- **Verified Sources**: National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES), Press Information Bureau (PIB), National Polar Data Center (NPDC).
- **Synthetic Test Records**: Clearly flagged with `DEMO-` prefix and marked `ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE`.
- **Cryptographic Keys**: Real Ed25519 demo keypair generated and maintained in `server/keys/demo_ed25519.json`.
