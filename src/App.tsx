import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Observatory } from './components/observatory/Observatory';
import { StationView } from './components/observatory/StationView';
import { ExpeditionView } from './components/expeditions/ExpeditionView';
import { ResearchLibrary } from './components/library/ResearchLibrary';
import { DatasetLab } from './components/datasets/DatasetLab';
import { KnowledgeExplorer } from './components/knowledge/KnowledgeExplorer';
import { EvidenceReader } from './components/evidence/EvidenceReader';
import { DocumentIngest } from './components/ocr/DocumentIngest';
import { OCRReview } from './components/ocr/OCRReview';
import { OutreachStudio } from './components/studio/OutreachStudio';
import { ReviewQueue } from './components/studio/ReviewQueue';
import { DisseminationHub } from './components/dissemination/DisseminationHub';
import { ReceiptView } from './components/receipt/ReceiptView';
import { TrustDashboard } from './components/dashboard/TrustDashboard';
import { MediaGallery } from './components/media/MediaGallery';
import { InstitutionalActivities } from './components/activities/InstitutionalActivities';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-polarText flex flex-col font-sans">
        {/* Fixed Header */}
        <Header />

        {/* Global Sub-navigation Bar */}
        <Navigation />

        {/* Main Routed Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Observatory />} />
            <Route path="/stations/:id" element={<StationView />} />
            <Route path="/expeditions" element={<ExpeditionView />} />
            <Route path="/expeditions/:id" element={<ExpeditionView />} />
            <Route path="/library" element={<ResearchLibrary />} />
            <Route path="/datasets/:id" element={<DatasetLab />} />
            <Route path="/media" element={<MediaGallery />} />
            <Route path="/activities" element={<InstitutionalActivities />} />
            <Route path="/knowledge" element={<KnowledgeExplorer />} />
            <Route path="/evidence/:findingId" element={<EvidenceReader />} />
            <Route path="/evidence" element={<EvidenceReader />} />
            <Route path="/studio/ingest" element={<DocumentIngest />} />
            <Route path="/studio/ocr/:documentId" element={<OCRReview />} />
            <Route path="/studio/compose" element={<OutreachStudio />} />
            <Route path="/studio/review" element={<ReviewQueue />} />
            <Route path="/studio/disseminate/:id" element={<DisseminationHub />} />
            <Route path="/studio/coverage" element={<TrustDashboard />} />
            <Route path="/r/:receiptId" element={<ReceiptView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-polarBorder bg-surface1 py-6 text-xs text-polarMuted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 font-mono-data">
            <div className="flex items-center space-x-2">
              <span className="text-accent font-semibold">POLAR-LINK</span>
              <span>• Indian Polar Research Trust Layer</span>
            </div>
            <div className="text-[11px] text-polarMuted/80">
              Deterministic Evidence Pipeline • SIH26063 Benchmark Prototype
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
