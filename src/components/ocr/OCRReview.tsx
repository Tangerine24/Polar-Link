import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { ocrService } from '../../services/ocrService';
import { Badge } from '../common/Badge';
import {
  FileCheck,
  Check,
  Edit3,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const OCRReview: React.FC = () => {
  const { documentId } = useParams<{ documentId?: string }>();
  const navigate = useNavigate();
  const { currentRole, addEvidenceFromOCR } = usePolarStore();

  const doc = ocrService.getDocument(documentId || 'ocr-doc-demo-01');
  const [activePageNum, setActivePageNum] = useState<number>(1);
  const activePage = doc?.pages.find(p => p.pageNumber === activePageNum) || doc?.pages[0];

  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    activePage?.blocks[0]?.id || ''
  );
  const activeBlock = activePage?.blocks.find(b => b.id === selectedBlockId) || activePage?.blocks[0];

  const [editingText, setEditingText] = useState<string>(
    activeBlock?.correctedText || activeBlock?.extractedText || ''
  );
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!doc || !activePage) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center text-polarMuted">
        Document not found in local OCR repository.
      </div>
    );
  }

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    const b = activePage.blocks.find(blk => blk.id === blockId);
    if (b) {
      setEditingText(b.correctedText || b.extractedText);
    }
  };

  const handleSaveCorrection = () => {
    if (!activeBlock) return;
    ocrService.updateBlockText(doc.id, activePageNum, activeBlock.id, editingText, 'Scientific Reviewer (Demo)');
    setSuccessBanner('Text correction saved. Ready to accept as Evidence Candidate.');
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  const handlePromoteToEvidence = () => {
    if (!activeBlock) return;
    const result = ocrService.promoteToEvidenceCandidate(
      doc.id,
      activePageNum,
      activeBlock.id,
      doc.sourceDocId || 'src-ocr-demo-2023',
      'Scientific Reviewer (Demo)'
    );

    if (result) {
      addEvidenceFromOCR(result.evidence, result.passage);
      setSuccessBanner(
        `Passage accepted! Evidence ID "${result.evidence.id}" generated and indexed into Evidence Reader.`
      );
      setTimeout(() => {
        navigate('/evidence/find-f1');
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-data text-polarMuted">
            <span>Document Intelligence</span>
            <span>/</span>
            <span className="text-accent">{doc.fileName}</span>
          </div>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            OCR Inspection & Passage Review Studio
          </h1>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono-data text-polarMuted">Page:</span>
          {doc.pages.map(p => (
            <button
              key={p.pageNumber}
              onClick={() => {
                setActivePageNum(p.pageNumber);
                setSelectedBlockId(p.blocks[0]?.id || '');
                setEditingText(p.blocks[0]?.extractedText || '');
              }}
              className={`px-3 py-1 rounded text-xs font-mono-data border transition-colors ${
                activePageNum === p.pageNumber
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-surface2 text-polarMuted border-polarBorder hover:text-polarText'
              }`}
            >
              {p.pageNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Epistemic Rule Reminder */}
      <div className="p-3 bg-surface2/60 border border-polarBorder rounded text-xs text-polarMuted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            Truth Principle: OCR corrections never overwrite the raw source scan. Bounding boxes link every character back to page coordinates.
          </span>
        </div>
        <span className="font-mono-data text-[10px] text-accent">Confidence: {(activeBlock ? activeBlock.confidence * 100 : 96).toFixed(0)}%</span>
      </div>

      {successBanner && (
        <div className="p-3 bg-success/15 border border-success/40 text-success rounded text-xs flex items-center justify-between animate-fade-in">
          <span>{successBanner}</span>
        </div>
      )}

      {/* Main Side-by-Side Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Scanned Document Page with Bounding Boxes (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              Original Scanned Document (Page {activePageNum} of {doc.pages.length})
            </span>
            <span className="text-[10px] font-mono-data text-accent">Interactive Bounding Boxes</span>
          </div>

          {/* Paper View Container */}
          <div className="paper-surface rounded p-8 min-h-[500px] relative border border-polarBorder shadow-lg font-serif select-none overflow-hidden">
            {/* Scanned Header styling */}
            <div className="border-b-2 border-paperText/20 pb-3 mb-6 text-center">
              <p className="text-[10px] tracking-widest uppercase font-mono-data text-paperText/70">
                Ministry of Earth Sciences — Government of India
              </p>
              <h3 className="text-sm font-bold uppercase tracking-wider text-paperText">
                National Centre for Polar and Ocean Research
              </h3>
              <p className="text-[10px] italic text-paperText/80">
                Expedition Observation Logbook • Bharati Station (Vol. 41)
              </p>
            </div>

            {/* Blocks rendered with absolute or structured bounding overlay */}
            <div className="space-y-4 text-xs text-paperText leading-relaxed">
              {activePage.blocks.map(block => {
                const isSelected = block.id === selectedBlockId;
                return (
                  <div
                    key={block.id}
                    onClick={() => handleSelectBlock(block.id)}
                    className={`p-2.5 rounded transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-accent/25 border-accent shadow-sm ring-2 ring-accent/50'
                        : 'bg-paper hover:bg-black/5 border-dashed border-paperText/30'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono-data text-paperText/60 mb-1">
                      <span>Passage Block ID: {block.id}</span>
                      <span>Confidence: {(block.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="font-editorial text-paperText text-xs font-medium">
                      {block.correctedText || block.extractedText}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Stamp on scanned paper */}
            <div className="absolute bottom-4 right-4 border-2 border-danger/60 text-danger/80 px-2 py-1 rounded text-[9px] font-mono-data tracking-wider transform -rotate-6">
              NCPOR FIELD ARCHIVE — POLAR-LINK VALIDATED
            </div>
          </div>
        </div>

        {/* Right Column: OCR Text Correction & Evidence Promotion (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-data uppercase tracking-wider text-polarMuted">
              OCR Block Inspector & Verification
            </span>
            {activeBlock?.isReviewed && (
              <Badge variant="VERIFIED" label="Human Reviewed" size="sm" />
            )}
          </div>

          {activeBlock ? (
            <div className="polar-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-polarBorder pb-3">
                <div>
                  <h4 className="text-xs font-semibold text-polarText font-mono-data">
                    Block: {activeBlock.id} (Page {activeBlock.pageNumber})
                  </h4>
                  <p className="text-[11px] text-polarMuted">
                    Bounding Box: [{activeBlock.box.x}, {activeBlock.box.y}, {activeBlock.box.width}, {activeBlock.box.height}]
                  </p>
                </div>
                <span className="font-mono-data text-xs text-accent">
                  {(activeBlock.confidence * 100).toFixed(1)}% Match
                </span>
              </div>

              {/* Editable Transcription */}
              <div className="space-y-2">
                <label className="text-xs font-mono-data text-polarMuted flex items-center justify-between">
                  <span>Editable Transcription (Verify Against Scan)</span>
                  <Edit3 className="w-3.5 h-3.5 text-accent" />
                </label>
                <textarea
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  rows={5}
                  className="w-full bg-surface2 border border-polarBorder rounded p-3 text-xs text-polarText font-editorial leading-relaxed focus:border-accent focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-polarBorder">
                <button
                  onClick={handleSaveCorrection}
                  className="px-3 py-1.5 rounded bg-surface2 hover:bg-surface1 border border-polarBorder text-xs text-polarText transition-colors flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span>Save Review Edit</span>
                </button>

                <button
                  onClick={handlePromoteToEvidence}
                  className="px-4 py-1.5 rounded bg-success hover:bg-success/90 text-background font-semibold text-xs transition-colors flex items-center space-x-1.5 ml-auto"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Verify & Create Evidence Candidate</span>
                </button>
              </div>

              {/* Provenance Trail */}
              <div className="p-3 rounded bg-surface2/40 border border-polarBorder text-[11px] text-polarMuted space-y-1">
                <span className="font-mono-data text-accent block">Metadata Trail:</span>
                <p>
                  Promoting this block creates an accepted DIRECT evidence record tied to the 41st ISEA Report. It immediately becomes indexable in Claim Guard and the Evidence Reader.
                </p>
              </div>
            </div>
          ) : (
            <div className="polar-card p-6 text-center text-polarMuted">
              Select a block from the scan to inspect and review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
