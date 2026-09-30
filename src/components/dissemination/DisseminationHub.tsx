import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import { Badge } from '../common/Badge';
import {
  Send,
  Globe,
  Share2,
  FileText,
  Code,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const DisseminationHub: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { stories, receipts } = usePolarStore();

  const story = stories.find(s => s.id === id) || stories[0];
  const receipt = receipts.find(r => r.storyId === story.id) || receipts[0];

  const [activeTab, setActiveTab] = useState<'website' | 'social' | 'press' | 'embed' | 'export'>('website');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Channel formats
  const websiteContent = {
    headline: story.title,
    subtitle: story.subtitle,
    body: story.claims.map(c => c.text).join('\n\n'),
    receiptUrl: `https://polarlink.gov.in/r/${receipt.receiptId}`
  };

  const socialPost = `🔬 Indian Polar Science Update: Automated weather recordings at Bharati Station documented a mid-summer mean temperature of -14.2°C during Jan-Feb 2023.\n\nEvery claim backed by peer-reviewed research. Verified scientific receipt & lineage:\nhttps://polarlink.gov.in/r/${receipt.receiptId}\n\n#Antarctica #PolarResearch #Bharati #NCPOR`;

  const pressNote = `FOR IMMEDIATE RELEASE • SCIENTIFIC DESK\nDateline: GOA / LARSMANN HILLS (ANTARCTICA)\n\n${story.title.toUpperCase()}\n\n${story.claims[0].text} According to the 41st Indian Scientific Expedition to Antarctica technical reports published by NCPOR, thermal buffering constrained diurnal fluctuations within 6.4°C.\n\nAll observations are cryptographically anchored under receipt ${receipt.receiptId}.\n\nMedia Liaison: NCPOR Scientific Outreach Cell (outreach@ncpor.res.in)`;

  const embedCode = `<iframe src="https://polarlink.gov.in/embed/story/${story.id}" width="100%" height="240" frameborder="0" title="${story.title}"></iframe>`;

  const exportJson = JSON.stringify(
    {
      storyId: story.id,
      receiptId: receipt.receiptId,
      cryptographicHash: receipt.cryptographicHash,
      publicationTimestamp: receipt.publicationTimestamp,
      claims: story.claims.map(c => ({
        id: c.claimId,
        text: c.text,
        numbers: c.numbers,
        units: c.units,
        scope: c.scope,
        evidenceCount: c.sourceEvidenceIds.length
      })),
      lineage: receipt.lineageNodes
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">Dissemination Engine</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Multi-Format Public Science Dissemination Hub
          </h1>
          <p className="text-xs text-polarMuted">
            Deliver verified science communication across websites, social media, press releases and embedded cards with attached provenance receipts.
          </p>
        </div>

        <Link
          to={`/r/${receipt.receiptId}`}
          className="px-3.5 py-1.5 rounded bg-surface2 border border-accent/40 hover:border-accent text-accent text-xs font-mono-data transition-colors flex items-center space-x-1.5"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Inspect Public Receipt ({receipt.receiptId})</span>
        </Link>
      </div>

      {/* Channel Tabs */}
      <div className="flex space-x-2 border-b border-polarBorder pb-2 overflow-x-auto">
        {[
          { key: 'website', label: 'Website Article', icon: Globe },
          { key: 'social', label: 'Social Post', icon: Share2 },
          { key: 'press', label: 'Press Note', icon: FileText },
          { key: 'embed', label: 'Embeddable Card', icon: Code },
          { key: 'export', label: 'JSON Export Pack', icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-accent text-background font-semibold shadow-sm'
                  : 'bg-surface2 text-polarMuted hover:text-polarText'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="polar-card p-6 space-y-4">
        {/* WEBSITE ARTICLE VIEW */}
        {activeTab === 'website' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <span className="text-xs font-mono-data uppercase text-polarMuted">
                Published Web Article Representation
              </span>
              <button
                onClick={() => copyToClipboard(websiteContent.body)}
                className="flex items-center space-x-1 text-xs text-accent hover:underline font-mono-data"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Article'}</span>
              </button>
            </div>

            <article className="max-w-3xl space-y-3 font-serif">
              <h2 className="text-2xl font-editorial font-bold text-polarText leading-tight">
                {websiteContent.headline}
              </h2>
              <p className="text-sm text-accent font-sans italic">{websiteContent.subtitle}</p>

              {/* Verified Receipt Chip */}
              <div className="p-2.5 rounded bg-surface2 border border-polarBorder font-sans text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span className="text-polarText">
                    Scientific Receipt: <code className="text-accent font-mono-data">{receipt.receiptId}</code>
                  </span>
                </div>
                <Badge variant={receipt.status} size="sm" />
              </div>

              <div className="pt-2 text-xs text-polarText/90 leading-relaxed space-y-3 font-sans">
                {story.claims.map(c => (
                  <p key={c.claimId} className="p-2 rounded bg-surface2/30 border border-polarBorder/40">
                    {c.text}
                  </p>
                ))}
              </div>
            </article>
          </div>
        )}

        {/* SOCIAL POST VIEW */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <span className="text-xs font-mono-data uppercase text-polarMuted">
                Social Platform Preview (Twitter / X / Mastodon / LinkedIn)
              </span>
              <button
                onClick={() => copyToClipboard(socialPost)}
                className="flex items-center space-x-1 text-xs text-accent hover:underline font-mono-data"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Post'}</span>
              </button>
            </div>

            <div className="max-w-xl p-4 rounded bg-surface2 border border-polarBorder space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                  PL
                </div>
                <div>
                  <div className="text-xs font-semibold text-polarText">Polar Science Trust Desk</div>
                  <div className="text-[10px] text-polarMuted">@PolarLink_IN • Official Science Feed</div>
                </div>
              </div>

              <p className="text-xs text-polarText leading-relaxed whitespace-pre-line font-sans">
                {socialPost}
              </p>

              <div className="pt-2 border-t border-polarBorder text-[10px] font-mono-data text-polarMuted flex justify-between">
                <span>Character Count: {socialPost.length} / 280</span>
                <span className="text-success">Evidence Bound: YES</span>
              </div>
            </div>
          </div>
        )}

        {/* PRESS NOTE VIEW */}
        {activeTab === 'press' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <span className="text-xs font-mono-data uppercase text-polarMuted">
                Official Institutional Press Note
              </span>
              <button
                onClick={() => copyToClipboard(pressNote)}
                className="flex items-center space-x-1 text-xs text-accent hover:underline font-mono-data"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Press Note'}</span>
              </button>
            </div>

            <pre className="paper-surface p-6 rounded text-xs font-mono leading-relaxed whitespace-pre-wrap select-all">
              {pressNote}
            </pre>
          </div>
        )}

        {/* EMBEDDABLE CARD VIEW */}
        {activeTab === 'embed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <span className="text-xs font-mono-data uppercase text-polarMuted">
                Embed Snippet & Live Widget Preview
              </span>
              <button
                onClick={() => copyToClipboard(embedCode)}
                className="flex items-center space-x-1 text-xs text-accent hover:underline font-mono-data"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>

            <div className="p-3 bg-surface2 rounded border border-polarBorder">
              <code className="text-xs font-mono-data text-accent">{embedCode}</code>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-mono-data uppercase text-polarMuted block mb-2">
                Live Widget Preview:
              </span>
              <div className="p-4 rounded border border-accent/40 bg-surface2 max-w-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-editorial font-bold text-polarText">{story.title}</span>
                  <Badge variant={receipt.status} size="sm" />
                </div>
                <p className="text-xs text-polarMuted line-clamp-2">{story.claims[0].text}</p>
                <div className="flex justify-between items-center text-[10px] font-mono-data pt-2 border-t border-polarBorder">
                  <span className="text-accent">Receipt: {receipt.receiptId}</span>
                  <span className="text-polarMuted">NCPOR Polar-Link</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSON EXPORT VIEW */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polarBorder pb-3">
              <span className="text-xs font-mono-data uppercase text-polarMuted">
                Machine-Readable Scientific Lineage JSON Pack
              </span>
              <button
                onClick={() => copyToClipboard(exportJson)}
                className="flex items-center space-x-1 text-xs text-accent hover:underline font-mono-data"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-4 rounded bg-surface2 border border-polarBorder text-xs font-mono-data text-polarText overflow-x-auto max-h-96">
              {exportJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
