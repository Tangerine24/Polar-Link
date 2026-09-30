import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePolarStore } from '../../store/polarStore';
import {
  Globe,
  Navigation as CompassNav,
  BookOpen,
  Database,
  Share2,
  FileScan,
  PenTool,
  CheckSquare,
  Send,
  BarChart3,
  Image,
  Radio
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentRole } = usePolarStore();

  const navItems = [
    { label: 'Observatory', to: '/', icon: Globe, public: true },
    { label: 'Expeditions', to: '/expeditions', icon: CompassNav, public: true },
    { label: 'Library', to: '/library', icon: BookOpen, public: true },
    { label: 'Dataset Lab', to: '/datasets/ds-bharati-temp', icon: Database, public: true },
    { label: 'Media', to: '/media', icon: Image, public: true },
    { label: 'Activities', to: '/activities', icon: Radio, public: true },
    { label: 'Knowledge', to: '/knowledge', icon: Share2, public: true },
    { label: 'Ingest & OCR', to: '/studio/ingest', icon: FileScan, roles: ['Scientist', 'Admin'] },
    { label: 'Outreach Studio', to: '/studio/compose', icon: PenTool, roles: ['Scientist', 'Reviewer', 'Admin'] },
    { label: 'Review Queue', to: '/studio/review', icon: CheckSquare, roles: ['Scientist', 'Reviewer', 'Admin'] },
    { label: 'Dissemination Hub', to: '/studio/disseminate/story-01', icon: Send, roles: ['Scientist', 'Reviewer', 'Admin'] },
    { label: 'Trust Dashboard', to: '/studio/coverage', icon: BarChart3, public: true }
  ];

  const visibleItems = navItems.filter(item => {
    if (item.public) return true;
    if (item.roles && item.roles.includes(currentRole)) return true;
    return false;
  });

  return (
    <nav className="border-b border-polarBorder bg-surface1/80 backdrop-blur-sm sticky top-24 z-30 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-2">
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-accent/15 border-accent text-accent font-semibold'
                    : 'border-transparent text-polarMuted hover:text-polarText hover:bg-surface2'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
