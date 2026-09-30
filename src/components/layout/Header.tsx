import React, { useState } from 'react';
import { usePolarStore } from '../../store/polarStore';
import { UserRole } from '../../types';
import { Compass, Shield, Search, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { AskArchiveModal } from '../search/AskArchiveModal';
import { DemoWalkthroughModal } from '../common/DemoWalkthroughModal';

export const Header: React.FC = () => {
  const { currentRole, setRole, lowBandwidth, setLowBandwidth } = usePolarStore();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const roles: UserRole[] = ['Public', 'Scientist', 'Reviewer', 'Admin'];

  return (
    <>
      <header className="border-b border-polarBorder bg-surface1 text-polarText sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded bg-surface2 border border-accent/40 flex items-center justify-center text-accent group-hover:border-accent transition-colors shadow-sm">
                <Compass className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-editorial text-xl font-bold tracking-tight text-polarText">
                    POLAR<span className="text-accent">-LINK</span>
                  </span>
                  <span className="font-mono-data text-[10px] px-1.5 py-0.5 rounded bg-surface2 border border-polarBorder text-accent/80">
                    v3.0
                  </span>
                </div>
                <p className="text-[11px] text-polarMuted tracking-wider hidden sm:block">
                  Explore. Verify. Publish. Trace.
                </p>
              </div>
            </a>
          </div>

          {/* Center: Search trigger & Demo Walkthrough */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded bg-surface2 border border-polarBorder hover:border-accent/50 text-polarMuted hover:text-polarText text-xs font-sans transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-accent" />
              <span>Ask the Archive...</span>
              <kbd className="font-mono-data text-[10px] px-1 bg-surface1 rounded border border-polarBorder text-polarMuted">
                /
              </kbd>
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Judge Demo Story</span>
            </button>
          </div>

          {/* Right: Low bandwidth & Role Switcher */}
          <div className="flex items-center space-x-4">
            {/* Low Bandwidth Toggle */}
            <button
              onClick={() => setLowBandwidth(lowBandwidth === 'Full' ? 'Essential' : 'Full')}
              title={`Network Mode: ${lowBandwidth} (Click to toggle essential mode)`}
              className={`p-1.5 rounded border transition-colors flex items-center space-x-1 text-xs font-mono-data ${
                lowBandwidth === 'Essential'
                  ? 'bg-warning/20 border-warning text-warning'
                  : 'bg-surface2 border-polarBorder text-polarMuted hover:text-polarText'
              }`}
            >
              {lowBandwidth === 'Essential' ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Essential Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Full Bandwidth</span>
                </>
              )}
            </button>

            {/* Role Switcher */}
            <div className="flex items-center space-x-1 bg-background p-0.5 rounded border border-polarBorder">
              <span className="text-[10px] font-mono-data text-polarMuted px-2 flex items-center space-x-1">
                <Shield className="w-3 h-3 text-accent" />
                <span className="hidden lg:inline">ROLE:</span>
              </span>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setRole(role)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    currentRole === role
                      ? 'bg-accent text-background font-semibold shadow-sm'
                      : 'text-polarMuted hover:text-polarText hover:bg-surface2'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Role Explanatory Banner */}
      <div className="bg-surface2/60 border-b border-polarBorder/60 px-4 py-1.5 text-xs text-polarMuted flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
            <span className="font-mono-data text-accent font-semibold">Active Persona: [{currentRole}]</span>
            <span className="hidden sm:inline text-polarMuted">
              {currentRole === 'Public' && '— Read public research findings, explore stations, and inspect verifiable receipts.'}
              {currentRole === 'Scientist' && '— Ingest scanned reports, run OCR, compose atomic claims, and trigger Claim Guard.'}
              {currentRole === 'Reviewer' && '— Inspect claim verification queue, evaluate Safety Gate, and approve releases.'}
              {currentRole === 'Admin' && '— Inspect governance audit trail, embargo classification, and system metrics.'}
            </span>
          </div>
          <span className="font-mono-data text-[10px] text-accent/80 hidden md:block">
            SIH26063 Prototype
          </span>
        </div>
      </div>

      {showSearchModal && <AskArchiveModal onClose={() => setShowSearchModal(false)} />}
      {showDemoModal && <DemoWalkthroughModal onClose={() => setShowDemoModal(false)} />}
    </>
  );
};
