import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { ocrService } from '../../services/ocrService';
import { OCRProcessStatus } from '../../types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const DocumentIngest: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = usePolarStore();
  const [status, setStatus] = useState<OCRProcessStatus>('READY');
  const [progress, setProgress] = useState(0);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartOCR = async (docName: string, docSize: number) => {
    setIsProcessing(true);
    setProgress(5);
    setStatus('QUEUED');

    try {
      const doc = await ocrService.ingestScannedDocument(
        { name: docName, size: docSize },
        (st, pr) => {
          setStatus(st);
          setProgress(pr);
        }
      );
      setActiveDocId(doc.id);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus('FAILED');
      setIsProcessing(false);
    }
  };

  const loadDemoReport = () => {
    handleStartOCR('Bharati_41st_ISEA_MetObservation_Scanned_Vol41.pdf', 2.4 * 1024 * 1024);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-polarText">
            Document Ingestion & Scanned Report Extraction
          </h1>
          <p className="text-xs text-polarMuted mt-1">
            Turn historical polar expedition reports, scanned logbooks and images into page-aware, traceable evidence.
          </p>
        </div>
        <Badge variant="READY_FOR_REVIEW" label="Document Intelligence" />
      </div>

      {/* Epistemic Rule Banner */}
      <div className="p-4 rounded bg-surface2 border-l-4 border-accent text-xs space-y-1">
        <div className="flex items-center space-x-2 text-accent font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Scientific Governance Rule: OCR is Extraction, Not Verification</span>
        </div>
        <p className="text-polarMuted">
          OCR output represents machine extraction. It never silently enters the public knowledge base as scientific truth without human inspection and explicit acceptance as an Evidence Candidate.
        </p>
      </div>

      {/* Ingestion Action Zone */}
      <div className="polar-card p-8 text-center space-y-6">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface2 border border-polarBorder flex items-center justify-center text-accent">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h2 className="text-base font-semibold text-polarText">
            Upload Scanned Polar Document (PDF / Image)
          </h2>
          <p className="text-xs text-polarMuted">
            Client-side Web Worker extraction. Zero third-party cloud leakage. Fully deterministic and offline-capable.
          </p>
        </div>

        {/* Demo One-Click Trigger Button */}
        <div className="pt-2">
          <button
            onClick={loadDemoReport}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded bg-accent hover:bg-accent/90 text-background font-semibold text-xs transition-all shadow-md flex items-center space-x-2 mx-auto disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Scanned Expedition Report (3 Pages)</span>
          </button>
        </div>

        {/* Status Tracker with aria-live */}
        {isProcessing && (
          <div
            aria-live="polite"
            className="max-w-md mx-auto p-4 rounded bg-surface2 border border-polarBorder space-y-3 text-left"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono-data text-accent flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pipeline Stage: {status.replace(/_/g, ' ')}</span>
              </span>
              <span className="font-mono-data font-bold text-polarText">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface1 rounded-full h-2 overflow-hidden border border-polarBorder">
              <div
                className="bg-accent h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[11px] text-polarMuted font-mono-data">
              {status === 'QUEUED' && '1/5 Validating file header & checksum...'}
              {status === 'RENDERING' && '2/5 Rendering scanned PDF canvas pages...'}
              {status === 'OCR_RUNNING' && '3/5 Executing client OCR worker on page bitmaps...'}
              {status === 'TEXT_EXTRACTED' && '4/5 Calculating bounding boxes and tokenizing passages...'}
              {status === 'OCR_REVIEW_REQUIRED' && '5/5 Extraction ready. Forwarding to OCR Review Studio...'}
            </p>
          </div>
        )}

        {/* Completion Action */}
        {!isProcessing && activeDocId && (
          <div className="max-w-md mx-auto p-4 rounded bg-success/10 border border-success/30 space-y-3">
            <div className="flex items-center space-x-2 text-success font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Extraction Complete: 3 Pages Tokenized</span>
            </div>
            <p className="text-xs text-polarText/80">
              Passages extracted with bounding boxes. Proceed to side-by-side verification.
            </p>
            <button
              onClick={() => navigate(`/studio/ocr/${activeDocId}`)}
              className="w-full py-2 rounded bg-success text-background font-semibold text-xs hover:bg-success/90 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Open OCR Review Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Pre-indexed Documents List */}
      <div className="polar-card p-5 space-y-3">
        <h3 className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
          Indexed Demonstration Documents
        </h3>
        <div className="p-3 rounded bg-surface2 border border-polarBorder flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-accent" />
            <div>
              <h4 className="text-xs font-semibold text-polarText">
                Illustrative Polar Observation Report — DEMO-BHR-001
              </h4>
              <p className="text-[10px] font-mono-data text-warning">
                ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE | 3 Pages | OCR_REVIEW_REQUIRED
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/studio/ocr/ocr-doc-demo-01')}
            className="px-3 py-1.5 rounded bg-surface1 hover:bg-surface2 border border-polarBorder text-xs text-accent font-medium transition-colors"
          >
            Review Extraction
          </button>
        </div>
      </div>
    </div>
  );
};
