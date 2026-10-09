import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Map,
  FileText,
  Sparkles,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'dashboard' | 'editor' | 'preview' | 'assistant';
  onNavigate: (view: 'dashboard' | 'editor' | 'preview' | 'assistant') => void;
  surveyCode?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'editor' as const,
      label: 'Inspección',
      icon: FileEdit,
    },
    {
      id: 'preview' as const,
      label: 'Reporte PDF',
      icon: FileText,
    },
    {
      id: 'assistant' as const,
      label: 'Consultor IA',
      icon: Sparkles,
      badge: 'Search',
    },
  ];

  return (
    <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition active:scale-95 ${
                isActive
                  ? 'text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[8px] bg-sky-500 text-white font-mono px-1 rounded-full leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[70px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
