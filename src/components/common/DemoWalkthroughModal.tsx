import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { X, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DemoWalkthroughModalProps {
  onClose: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { setRole } = usePolarStore();

  const steps = [
    {
      step: '01',
      title: 'Polar Discovery',
      desc: 'Explore Antarctic stations (Bharati, Maitri), Arctic (Himadri), and Third Pole (Himansh) on polar projection.',
      route: '/',
      role: 'Public' as const,
      tag: 'Observatory'
    },
    {
      step: '02',
      title: 'Station & Expedition Finding',
      desc: 'Inspect DEMO-A expedition and Finding F1 (-14.2°C mean temperature).',
      route: '/evidence/find-f1',
      role: 'Public' as const,
      tag: 'Evidence Reader'
    },
    {
      step: '03',
      title: 'Dataset Lab & CSV Export',
      desc: 'Inspect Bharati AWS hourly series, verify mean -14.2°C derivation, and export filtered dataset.',
      route: '/datasets/ds-bharati-temp',
      role: 'Scientist' as const,
      tag: 'Dataset Lab'
    },
    {
      step: '04',
      title: 'Scanned Document Ingest & OCR',
      desc: 'Load 3-page expedition logbook, run client-side OCR pipeline, view status stages.',
      route: '/studio/ingest',
      role: 'Scientist' as const,
      tag: 'Document Ingest'
    },
    {
      step: '05',
      title: 'OCR Review & Evidence Binding',
      desc: 'Side-by-side scan & bounding boxes. Edit text, verify extraction, promote to accepted Evidence Candidate.',
      route: '/studio/ocr/ocr-doc-demo-01',
      role: 'Scientist' as const,
      tag: 'OCR Review'
    },
    {
      step: '06',
      title: 'Outreach Studio & Claim Guard',
      desc: 'Compose atomic claims. Plant error (-4.2°C or drop Bharati), watch Claim Guard catch it with red badge!',
      route: '/studio/compose',
      role: 'Scientist' as const,
      tag: 'Claim Guard'
    },
    {
      step: '07',
      title: 'Safety Gate & Review Queue',
      desc: 'Pre-flight check blocks PII, embargoes & mismatches. Switch to Reviewer and approve publication.',
      route: '/studio/review',
      role: 'Reviewer' as const,
      tag: 'Review Queue'
    },
    {
      step: '08',
      title: 'Multi-Channel Dissemination',
      desc: 'Generate website article, social post preview, press note, embeddable card, and JSON export pack.',
      route: '/studio/disseminate/story-01',
      role: 'Scientist' as const,
      tag: 'Dissemination'
    },
    {
      step: '09',
      title: 'Cryptographic Scientific Receipt',
      desc: 'Inspect QR payload, SHA-256 hash, atomic claims ledger, and honest lineage graph.',
      route: '/r/PL-RCPT-2026-0930-BHR01',
      role: 'Public' as const,
      tag: 'Public Receipt'
    },
    {
      step: '10',
      title: 'Cascade Source Correction',
      desc: 'Simulate upstream source correction. Receipt status automatically cascades to UNDER REVIEW with public alert!',
      route: '/r/PL-RCPT-2026-0930-BHR01',
      role: 'Admin' as const,
      tag: 'Living Lineage'
    }
  ];

  const handleJump = (route: string, role: 'Public' | 'Scientist' | 'Reviewer' | 'Admin') => {
    setRole(role);
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface1 border border-polarBorder rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-polarBorder flex items-center justify-between bg-surface2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Play className="w-4 h-4 fill-accent" />
            </div>
            <div>
              <h2 className="text-lg font-editorial font-bold text-polarText">
                SIH26063 Primary Evaluation Storyboard
              </h2>
              <p className="text-xs text-polarMuted">
                Step-by-step verification of the complete evidence-to-publication trust loop.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-polarMuted hover:text-polarText hover:bg-surface1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-polarBorder/40">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="pt-3 first:pt-0 flex items-start justify-between gap-4 group hover:bg-surface2/30 p-2 rounded transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="font-mono-data text-xs px-1.5 py-0.5 rounded bg-surface2 border border-polarBorder text-accent font-semibold">
                  {s.step}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-polarText group-hover:text-accent transition-colors">
                      {s.title}
                    </h3>
                    <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-surface2 text-polarMuted border border-polarBorder">
                      {s.tag}
                    </span>
                    <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                      Role: {s.role}
                    </span>
                  </div>
                  <p className="text-xs text-polarMuted mt-0.5">{s.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleJump(s.route, s.role)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded bg-surface2 hover:bg-accent hover:text-background border border-polarBorder hover:border-accent text-xs font-medium text-polarText transition-all whitespace-nowrap"
              >
                <span>Jump</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-polarBorder bg-surface2/50 flex items-center justify-between text-xs text-polarMuted">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Deterministic, Keyless & 100% Offline-Capable</span>
          </div>
          <button
            onClick={() => handleJump('/', 'Public')}
            className="px-4 py-1.5 rounded bg-accent text-background font-semibold hover:bg-accent/90 transition-colors"
          >
            Start from Step 1
          </button>
        </div>
      </div>
    </div>
  );
};
