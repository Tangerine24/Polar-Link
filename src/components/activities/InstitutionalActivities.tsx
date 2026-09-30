import React, { useState } from 'react';
import { SEED_ACTIVITIES } from '../../data/seedData';
import { Badge } from '../common/Badge';
import { Calendar, MapPin, Users, Award, Shield, Filter, Radio } from 'lucide-react';

export const InstitutionalActivities: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const activities = SEED_ACTIVITIES.filter(a => {
    if (selectedType !== 'ALL' && a.activityType !== selectedType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-polarBorder pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-data text-accent">SIH26063 Asset Class 6</span>
          <h1 className="text-2xl font-editorial font-bold text-polarText mt-1">
            Institutional Outreach & Polar Science Activities
          </h1>
          <p className="text-xs text-polarMuted">
            Public science exhibitions, student interactive satellite conferences, science festivals, and MoES polar governance workshops.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="VERIFIED" label="NCPOR Public Wing" />
        </div>
      </div>

      {/* Epistemic Rule */}
      <div className="p-3 bg-surface2/60 border border-polarBorder rounded text-xs text-polarMuted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            Outreach Integration: Every public activity connects directly to underlying research stations, media recordings, and expedition teams.
          </span>
        </div>
        <span className="font-mono-data text-[10px] text-accent">Public Engagement Record</span>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-surface1 border border-polarBorder rounded">
        <span className="text-xs font-mono-data text-polarMuted mr-2">Activity Type:</span>
        {['ALL', 'Outreach Event', 'Science Festival', 'Institutional Programme'].map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 rounded text-xs font-mono-data border transition-colors ${
              selectedType === t
                ? 'bg-accent/15 border-accent text-accent font-semibold'
                : 'bg-surface2 border-polarBorder text-polarMuted hover:text-polarText'
            }`}
          >
            {t === 'ALL' ? 'All Activities' : t}
          </button>
        ))}
      </div>

      {/* Activities Timeline / Cards */}
      <div className="space-y-4">
        {activities.map(act => (
          <div key={act.id} className="polar-card p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-accent/15 text-accent border border-accent/40 font-semibold uppercase">
                    {act.activityType}
                  </span>
                  <Badge variant={act.verificationStatus === 'VERIFIED_REAL' ? 'VERIFIED' : 'CURRENT'} size="sm" />
                </div>
                <h3 className="text-lg font-editorial font-bold text-polarText">
                  {act.title}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-mono-data text-accent bg-surface2 px-3 py-1 rounded border border-polarBorder">
                <Calendar className="w-3.5 h-3.5" />
                <span>{act.dateOrRange}</span>
              </div>
            </div>

            <p className="text-xs text-polarMuted leading-relaxed">
              {act.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-polarBorder/60 text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-warning" />
                <div>
                  <span className="text-polarMuted block text-[10px] font-mono-data">Location:</span>
                  <span className="text-polarText font-medium">{act.location || 'NCPOR Headquarters / Teleconference'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-success" />
                <div>
                  <span className="text-polarMuted block text-[10px] font-mono-data">Audience:</span>
                  <span className="text-polarText font-medium">{act.audience}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-accent" />
                <div>
                  <span className="text-polarMuted block text-[10px] font-mono-data">Connected Station:</span>
                  <span className="text-accent font-mono-data">{act.relatedStationId || 'Bharati / Maitri Link'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
