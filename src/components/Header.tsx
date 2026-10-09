import React from 'react';
import { Plus, FileDown, Radio } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'editor' | 'preview' | 'assistant';
  onNavigate: (view: 'dashboard' | 'editor' | 'preview' | 'assistant') => void;
  onNewSurvey: () => void;
  onDownloadCurrentPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onNewSurvey,
  onDownloadCurrentPdf,
}) => {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
          <Radio className="w-4 h-4" />
        </div>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard');
          }}
          className="text-sm md:text-base font-bold tracking-tight text-slate-100 hover:text-white transition whitespace-nowrap"
        >
          Site Survey Telecom Pro
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`transition hover:text-slate-100 whitespace-nowrap ${
            currentView === 'dashboard' ? 'text-sky-400 underline underline-offset-8' : ''
          }`}
        >
          Dashboard Central
        </button>
        <button
          onClick={() => onNavigate('editor')}
          className={`transition hover:text-slate-100 whitespace-nowrap ${
            currentView === 'editor' ? 'text-sky-400 underline underline-offset-8' : ''
          }`}
        >
          Editor de Inspección
        </button>
        <button
          onClick={() => onNavigate('preview')}
          className={`transition hover:text-slate-100 whitespace-nowrap ${
            currentView === 'preview' ? 'text-sky-400 underline underline-offset-8' : ''
          }`}
        >
          Reporte Oficial (6 Págs)
        </button>
        <button
          onClick={() => onNavigate('assistant')}
          className={`transition hover:text-slate-100 whitespace-nowrap flex items-center gap-1 ${
            currentView === 'assistant' ? 'text-sky-400 underline underline-offset-8' : ''
          }`}
        >
          Consultor IA
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDownloadCurrentPdf}
          className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition whitespace-nowrap items-center gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 text-emerald-400" /> Exportar PDF
        </button>

        <button
          onClick={onNewSurvey}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition shadow-md shadow-sky-600/20 whitespace-nowrap flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Nuevo</span> Survey
        </button>
      </div>
    </header>
  );
};
