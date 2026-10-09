import React, { useState } from 'react';
import { SiteSurvey } from '../types/survey';
import { PdfReportDocument } from './PdfReportDocument';
import { exportSurveyToPdf, printSurveyDocument } from '../utils/pdfExporter';
import {
  X,
  FileDown,
  Printer,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface PdfPreviewModalProps {
  survey: SiteSurvey;
  onClose: () => void;
  onEdit: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  survey,
  onClose,
  onEdit,
}) => {
  const [selectedPage, setSelectedPage] = useState<number | 'all'>('all');
  const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 640;
  const [zoomLevel, setZoomLevel] = useState<number>(isMobileInitial ? 0.44 : 0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressVal, setProgressVal] = useState<number>(0);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      setProgressMsg('Preparando páginas...');
      setProgressVal(10);

      await exportSurveyToPdf(survey.codigoSitio || 'REPORTE', {
        onProgress: (p, msg) => {
          setProgressVal(p);
          setProgressMsg(msg);
        },
      });

      setTimeout(() => {
        setIsExporting(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printSurveyDocument();
  };

  return (
    <div className="print:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs truncate max-w-[140px] sm:max-w-none">
              REPORTE SITE SURVEY
            </span>
            <span className="font-mono text-cyan-400 text-[10px]">{survey.codigoSitio}</span>
          </div>

          {/* Desktop Page Selector Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                selectedPage === 'all'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas (1-6)
            </button>
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPage(p)}
                className={`px-2 py-1 rounded text-xs transition ${
                  selectedPage === p
                    ? 'bg-sky-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pág {p}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Page Pager Controls */}
        <div className="flex md:hidden items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              if (selectedPage === 'all') setSelectedPage(1);
              else if (typeof selectedPage === 'number' && selectedPage > 1)
                setSelectedPage(selectedPage - 1);
            }}
            className="px-1.5 py-0.5 text-slate-300 font-bold"
          >
            ‹
          </button>
          <span className="text-[11px] font-mono text-cyan-400">
            {selectedPage === 'all' ? '1-6' : `Pág ${selectedPage}`}
          </span>
          <button
            onClick={() => {
              if (selectedPage === 'all') setSelectedPage(1);
              else if (typeof selectedPage === 'number' && selectedPage < 6)
                setSelectedPage(selectedPage + 1);
            }}
            className="px-1.5 py-0.5 text-slate-300 font-bold"
          >
            ›
          </button>
          <button
            onClick={() => setSelectedPage(selectedPage === 'all' ? 1 : 'all')}
            className="text-[9px] text-slate-400 ml-1 border-l border-slate-800 pl-1.5"
          >
            {selectedPage === 'all' ? '1x1' : 'Todas'}
          </button>
        </div>

        {/* Zoom & Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.35, z - 0.08))}
              className="p-1 text-slate-400 hover:text-white"
              title="Reducir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.08))}
              className="p-1 text-slate-400 hover:text-white"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onEdit}
            className="hidden sm:flex px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Editar</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition items-center gap-1"
            title="Imprimir / Guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="hidden sm:flex px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg transition shadow-md shadow-emerald-600/30 items-center gap-1.5"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Export progress modal banner if exporting */}
      {isExporting && (
        <div className="bg-sky-950/90 border-b border-sky-800 px-6 py-2 flex items-center justify-between text-xs text-sky-200 animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>{progressMsg}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48 bg-sky-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${progressVal}%` }}
              />
            </div>
            <span className="font-mono text-cyan-300 font-bold">{progressVal}%</span>
          </div>
        </div>
      )}

      {/* Scrollable Viewport with A4 Sheets */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-950 pb-24 sm:pb-8">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="pb-16"
        >
          <PdfReportDocument
            survey={survey}
            pageNumber={selectedPage === 'all' ? undefined : selectedPage}
            idPrefix="modal-page-"
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Thumb Zone) */}
      <div className="sm:hidden p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center gap-2 z-50">
        <button
          onClick={handlePrint}
          className="min-h-[46px] px-3.5 py-2 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 text-xs font-semibold"
        >
          <Printer className="w-4 h-4 text-indigo-400" />
          <span>Imprimir</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={isExporting}
          className="flex-1 min-h-[46px] py-2 px-4 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          <span>Descargar PDF</span>
        </button>
      </div>
    </div>
  );
};
