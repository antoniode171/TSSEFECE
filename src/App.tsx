import React, { useState, useEffect } from 'react';
import { SiteSurvey } from './types/survey';
import { initialSurveys } from './data/initialSurveys';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { SurveyEditor } from './components/SurveyEditor';
import { TelecomAssistant } from './components/TelecomAssistant';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { PdfReportDocument } from './components/PdfReportDocument';
import { exportSurveyToPdf, printSurveyDocument } from './utils/pdfExporter';
import {
  FileText,
  Eye,
  Edit3,
  FileDown,
  Printer,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

const STORAGE_KEY = 'site_survey_telecom_data_v1';

function sanitizeSurvey(raw: any, fallbackIndex = 0): SiteSurvey {
  const base = initialSurveys[fallbackIndex % initialSurveys.length] || initialSurveys[0];
  if (!raw || typeof raw !== 'object') return base;

  return {
    ...base,
    ...raw,
    id: raw.id || base.id,
    codigoSitio: raw.codigoSitio || base.codigoSitio,
    nombreSitio: raw.nombreSitio || base.nombreSitio,
    nombreProyecto: raw.nombreProyecto || base.nombreProyecto,
    estado: raw.estado || 'Borrador',
    porcentajeCompletado:
      typeof raw.porcentajeCompletado === 'number' ? raw.porcentajeCompletado : 50,
    creadoPor: raw.creadoPor || 'Ingeniero de Campo',
    ultimaActualizacion:
      raw.ultimaActualizacion || new Date().toISOString().slice(0, 16).replace('T', ' '),
    region: raw.region || base.region,
    fechaReporte: raw.fechaReporte || base.fechaReporte,
    tiposEquipos: raw.tiposEquipos || base.tiposEquipos,
    tipoReporte: raw.tipoReporte || base.tipoReporte,
    contratista: raw.contratista || base.contratista,
    requiereLlave: raw.requiereLlave || 'SI',
    dondeSeRetiraLlave: raw.dondeSeRetiraLlave || '',
    propietarioSitio: raw.propietarioSitio || '',
    coordenadasSitio: raw.coordenadasSitio || '',
    observacionesPag1: raw.observacionesPag1 || '',
    ubicacionRack: raw.ubicacionRack || '',
    ubicacionGabinete: raw.ubicacionGabinete || '',
    tipoRack: raw.tipoRack || '19"',
    nombreOdf1: raw.nombreOdf1 || '',
    nombreOdf2: raw.nombreOdf2 || '',
    conectorOdf1Upc: raw.conectorOdf1Upc || '',
    conectorOdf1Apc: raw.conectorOdf1Apc || '',
    conectorOdf2Upc: raw.conectorOdf2Upc || '',
    conectorOdf2Apc: raw.conectorOdf2Apc || '',
    rectificadorA: raw.rectificadorA || '',
    rectificadorB: raw.rectificadorB || '',
    terminalesEnergiaDobleAgujero: raw.terminalesEnergiaDobleAgujero || '0',
    terminalesEnergiaUnAgujero: raw.terminalesEnergiaUnAgujero || '0',
    terminalesEnergiaPunta: raw.terminalesEnergiaPunta || '0',
    breakers:
      Array.isArray(raw.breakers) && raw.breakers.length > 0 ? raw.breakers : base.breakers,
    terminalesTierraDobleAgujero: raw.terminalesTierraDobleAgujero || '0',
    terminalesTierraUnAgujero: raw.terminalesTierraUnAgujero || '0',
    calibreCableAterrizajeAwg: raw.calibreCableAterrizajeAwg || '',
    recorridoCableAterrizajeMts: raw.recorridoCableAterrizajeMts || '',
    observacionesFuerza: raw.observacionesFuerza || '',
    planoSitioNotas: raw.planoSitioNotas || '',
    fotosSitioPagina5:
      Array.isArray(raw.fotosSitioPagina5) && raw.fotosSitioPagina5.length > 0
        ? raw.fotosSitioPagina5
        : base.fotosSitioPagina5,
    fotosSitioPagina6:
      Array.isArray(raw.fotosSitioPagina6) && raw.fotosSitioPagina6.length > 0
        ? raw.fotosSitioPagina6
        : base.fotosSitioPagina6,
  };
}

export default function App() {
  const [surveys, setSurveys] = useState<SiteSurvey[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => sanitizeSurvey(item, idx));
        }
      }
    } catch (e) {
      console.error('Error loading saved surveys:', e);
    }
    return initialSurveys;
  });

  const [currentSurveyId, setCurrentSurveyId] = useState<string>(
    surveys[0]?.id || initialSurveys[0].id
  );
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'preview' | 'assistant'>('dashboard');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Responsive PDF view state
  const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 640;
  const [previewPage, setPreviewPage] = useState<number | 'all'>(isMobileInitial ? 1 : 'all');
  const [previewZoom, setPreviewZoom] = useState<number>(isMobileInitial ? 0.44 : 0.9);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
    } catch (e) {
      console.error('Error saving surveys:', e);
    }
  }, [surveys]);

  const currentSurvey =
    surveys.find((s) => s.id === currentSurveyId) || surveys[0] || initialSurveys[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSaveSurvey = (updated: SiteSurvey) => {
    setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Sitio ${updated.codigoSitio} actualizado.`);
  };

  const handleApplyAssistantNote = (noteText: string) => {
    const updated = {
      ...currentSurvey,
      observacionesPag1: `${currentSurvey.observacionesPag1}\n\n[Nota Técnica Asistente]: ${noteText}`,
    };
    handleSaveSurvey(updated);
    showToast('Nota técnica agregada a Observaciones.');
  };

  const handleNewSurvey = () => {
    const timestamp = Date.now();
    const newSurvey: SiteSurvey = {
      id: `survey-${timestamp}`,
      codigoSitio: `TGO-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      estado: 'Borrador',
      porcentajeCompletado: 20,
      creadoPor: 'Ingeniero de Campo',
      ultimaActualizacion: new Date().toISOString().slice(0, 16).replace('T', ' '),
      region: 'Colombia - Regional Central',

      nombreSitio: 'NUEVO NODO TELECOM',
      nombreProyecto: 'MODERNIZACION RAN & EXPANSION 5G',
      fechaReporte: new Date().toISOString().slice(0, 10),
      tiposEquipos: 'NOKIA AIRSCALE BBU + RRU 5G',
      tipoReporte: 'SITE SURVEY DEFINITIVO (TSS)',
      contratista: 'NOKIA NETWORKS COLOMBIA S.A.S.',

      requiereLlave: 'SI',
      dondeSeRetiraLlave: 'NOC / Central Operativa',
      propietarioSitio: 'Tigo Colombia / Operador de Torre',
      coordenadasSitio: '4.7110° N, -74.0721° W',

      observacionesPag1: 'Levantamiento inicial de viabilidad técnica y espacio en sala.',

      ubicacionRack: 'RACK 01',
      ubicacionGabinete: 'GABINETE 01',
      tipoRack: '19"',

      nombreOdf1: 'ODF-01-PRINCIPAL (24 FO)',
      nombreOdf2: 'ODF-02-EXPANSION (12 FO)',
      conectorOdf1Upc: '12 LC/UPC',
      conectorOdf1Apc: '12 SC/APC',
      conectorOdf2Upc: '',
      conectorOdf2Apc: '',

      rectificadorA: 'VERTIV / DELTA 48V DC',
      rectificadorB: '',
      terminalesEnergiaDobleAgujero: '2 Unidades',
      terminalesEnergiaUnAgujero: '2 Unidades',
      terminalesEnergiaPunta: '2 Unidades',

      breakers: [
        {
          id: `brk-${timestamp}-1`,
          posicionBrk: 'BRK-01',
          capacidadBreaker: '63 Amp',
          recorridoCableMts: '12.0 mts',
          calibreCableAwg: '2 AWG',
        },
      ],

      terminalesTierraDobleAgujero: '2 Unidades',
      terminalesTierraUnAgujero: '2 Unidades',
      calibreCableAterrizajeAwg: '2/0 AWG',
      recorridoCableAterrizajeMts: '5.0 mts',
      observacionesFuerza: 'Espacio disponible en barraje para breaker adicional de 63A.',

      fotosSitioPagina5: [
        { id: `f5-${timestamp}-1`, titulo: 'PANORAMICA GENERAL DEL SITIO' },
        { id: `f5-${timestamp}-2`, titulo: 'ACCESO PRINCIPAL Y REJA' },
        { id: `f5-${timestamp}-3`, titulo: 'RACK FRONTAL Y ESPACIO' },
        { id: `f5-${timestamp}-4`, titulo: 'ODF Y PUERTOS' },
        { id: `f5-${timestamp}-5`, titulo: 'TABLERO RECTIFICADOR' },
        { id: `f5-${timestamp}-6`, titulo: 'BARRA DE TIERRA MGB' },
      ],
      fotosSitioPagina6: [
        { id: `f6-${timestamp}-1`, titulo: 'ESCALERILLA DE CABLES' },
        { id: `f6-${timestamp}-2`, titulo: 'BANCO DE BATERIAS' },
        { id: `f6-${timestamp}-3`, titulo: 'TORRE O MONOPOLO' },
        { id: `f6-${timestamp}-4`, titulo: 'EQUIPO DE CLIMATIZACION' },
        { id: `f6-${timestamp}-5`, titulo: 'TABLERO AC' },
        { id: `f6-${timestamp}-6`, titulo: 'DETALLE ATERRIZAJE' },
      ],
    };

    setSurveys((prev) => [newSurvey, ...prev]);
    setCurrentSurveyId(newSurvey.id);
    setCurrentView('editor');
    showToast(`Nuevo reporte ${newSurvey.codigoSitio} creado.`);
  };

  const handleDuplicateSurvey = (source: SiteSurvey) => {
    const timestamp = Date.now();
    const cloned: SiteSurvey = {
      ...source,
      id: `survey-copy-${timestamp}`,
      codigoSitio: `${source.codigoSitio}-CLON`,
      nombreSitio: `${source.nombreSitio} (COPIA)`,
      estado: 'Borrador',
      fechaReporte: new Date().toISOString().slice(0, 10),
      ultimaActualizacion: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setSurveys((prev) => [cloned, ...prev]);
    setCurrentSurveyId(cloned.id);
    showToast(`Sitio duplicado como ${cloned.codigoSitio}.`);
  };

  const handleDeleteSurvey = (id: string) => {
    if (surveys.length <= 1) {
      showToast('No se puede eliminar el único reporte existente.');
      return;
    }
    setSurveys((prev) => prev.filter((s) => s.id !== id));
    if (currentSurveyId === id) {
      const remaining = surveys.filter((s) => s.id !== id);
      setCurrentSurveyId(remaining[0].id);
    }
    showToast('Reporte eliminado.');
  };

  const handleExportPdf = async (targetSurvey?: SiteSurvey) => {
    const surveyToExport = targetSurvey || currentSurvey;
    try {
      setIsExporting(true);
      showToast('Generando documento PDF de 6 páginas...');
      if (surveyToExport.id !== currentSurveyId) {
        setCurrentSurveyId(surveyToExport.id);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      await exportSurveyToPdf(surveyToExport.codigoSitio);
      showToast(`¡Reporte ${surveyToExport.codigoSitio} descargado con éxito!`);
    } catch (err) {
      console.error(err);
      showToast('Abriendo previsualizador de reporte...');
      setShowPdfModal(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = (targetSurvey?: SiteSurvey) => {
    const surveyToPrint = targetSurvey || currentSurvey;
    if (surveyToPrint.id !== currentSurveyId) {
      setCurrentSurveyId(surveyToPrint.id);
    }
    setTimeout(() => {
      printSurveyDocument();
    }, 250);
  };

  return (
    <>
      {/* SCREEN INTERACTIVE UI (COMPLETELY HIDDEN DURING PRINT) */}
      <div className="print:hidden min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
        {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewSurvey={handleNewSurvey}
        onDownloadCurrentPdf={() => handleExportPdf(currentSurvey)}
      />

      {/* Subheader Context Strip */}
      <div className="no-print bg-slate-900/60 border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 max-w-full">
          <span className="text-slate-400 hidden sm:inline">Sitio Activo:</span>
          <div className="relative">
            <select
              value={currentSurveyId}
              onChange={(e) => setCurrentSurveyId(e.target.value)}
              className="appearance-none pl-2.5 pr-7 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs truncate max-w-[200px] sm:max-w-none"
            >
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.codigoSitio} — {s.nombreSitio}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded ${
              currentSurvey.estado === 'Aprobado'
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                : currentSurvey.estado === 'En Revisión'
                ? 'text-amber-400 bg-amber-950/60 border border-amber-800'
                : 'text-sky-400 bg-sky-950/60 border border-sky-800'
            }`}
          >
            {currentSurvey.estado}
          </span>
        </div>

        {/* View Switcher Quick Actions for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1 rounded-md transition ${
              currentView === 'dashboard'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('editor')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1 ${
              currentView === 'editor'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar Formulario
          </button>
          <button
            onClick={() => setCurrentView('preview')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1 ${
              currentView === 'preview'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Ver Reporte PDF
          </button>
          <button
            onClick={() => setCurrentView('assistant')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1 ${
              currentView === 'assistant'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Consultor IA
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-3 md:p-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-5 right-4 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <DashboardView
            surveys={surveys}
            onSelectSurvey={(s) => setCurrentSurveyId(s.id)}
            onEditSurvey={(s) => {
              setCurrentSurveyId(s.id);
              setCurrentView('editor');
            }}
            onPreviewPdf={(s) => {
              setCurrentSurveyId(s.id);
              setShowPdfModal(true);
            }}
            onDownloadPdf={(s) => handleExportPdf(s)}
            onPrintPdf={(s) => handlePrint(s)}
            onNewSurvey={handleNewSurvey}
            onDuplicateSurvey={handleDuplicateSurvey}
            onDeleteSurvey={handleDeleteSurvey}
          />
        )}

        {/* EDITOR VIEW */}
        {currentView === 'editor' && (
          <SurveyEditor
            survey={currentSurvey}
            onSave={handleSaveSurvey}
            onPreviewPdf={() => setShowPdfModal(true)}
          />
        )}

        {/* CONSULTOR IA (SEARCH GROUNDING) VIEW */}
        {currentView === 'assistant' && (
          <TelecomAssistant
            currentSurvey={currentSurvey}
            onApplyToNotes={handleApplyAssistantNote}
          />
        )}

        {/* FULL PAGE REPORT PREVIEW VIEW */}
        {currentView === 'preview' && (
          <div className="flex flex-col gap-4">
            <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Reporte Oficial Site Survey</span>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    {currentSurvey.codigoSitio}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formato de 6 páginas estándar Nokia & Tigo con calidad de impresión profesional.
                </p>
              </div>

              {/* Desktop Page Selector Tabs */}
              <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewPage('all')}
                  className={`px-2.5 py-1 rounded transition ${
                    previewPage === 'all'
                      ? 'bg-sky-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas (1-6)
                </button>
                {[1, 2, 3, 4, 5, 6].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPage(p)}
                    className={`px-2 py-1 rounded transition ${
                      previewPage === p
                        ? 'bg-sky-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pág {p}
                  </button>
                ))}
              </div>

              {/* Mobile Pager (< Pág X >) */}
              <div className="flex lg:hidden items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    if (previewPage === 'all') setPreviewPage(1);
                    else if (typeof previewPage === 'number' && previewPage > 1)
                      setPreviewPage(previewPage - 1);
                  }}
                  className="px-2 py-0.5 text-slate-300 font-bold active:scale-95"
                >
                  ‹
                </button>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {previewPage === 'all' ? 'Todas (1-6)' : `Pág ${previewPage} de 6`}
                </span>
                <button
                  onClick={() => {
                    if (previewPage === 'all') setPreviewPage(1);
                    else if (typeof previewPage === 'number' && previewPage < 6)
                      setPreviewPage(previewPage + 1);
                  }}
                  className="px-2 py-0.5 text-slate-300 font-bold active:scale-95"
                >
                  ›
                </button>
                <button
                  onClick={() => setPreviewPage(previewPage === 'all' ? 1 : 'all')}
                  className="text-[10px] text-slate-400 border-l border-slate-800 pl-2 ml-1"
                >
                  {previewPage === 'all' ? '1x1' : 'Ver Todas'}
                </button>
              </div>

              {/* Zoom and Actions Ribbon */}
              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setPreviewZoom((z) => Math.max(0.32, z - 0.08))}
                    className="p-1 text-slate-400 hover:text-white active:scale-95"
                    title="Reducir zoom"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-300 w-10 text-center">
                    {Math.round(previewZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setPreviewZoom((z) => Math.min(1.4, z + 0.08))}
                    className="p-1 text-slate-400 hover:text-white active:scale-95"
                    title="Aumentar zoom"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const screenW = window.innerWidth;
                      const targetScale = screenW < 640 ? (screenW - 32) / 800 : 0.85;
                      setPreviewZoom(targetScale);
                    }}
                    className="p-1 text-slate-400 hover:text-cyan-400 border-l border-slate-800 pl-1.5 ml-0.5 active:scale-95"
                    title="Ajustar al ancho de pantalla"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentView('editor')}
                  className="hidden sm:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Editar
                </button>

                <button
                  onClick={() => handlePrint(currentSurvey)}
                  className="hidden sm:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" /> Imprimir
                </button>

                <button
                  onClick={() => handleExportPdf(currentSurvey)}
                  disabled={isExporting}
                  className="hidden sm:flex px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-emerald-600/30 items-center gap-1.5"
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  Descargar PDF
                </button>
              </div>
            </div>

            {/* Document sheet view with smooth responsive scale transform */}
            <div className="flex justify-center p-1 sm:p-4 bg-slate-950 overflow-x-auto min-h-[600px] relative">
              <div
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="pb-24"
              >
                <PdfReportDocument
                  survey={currentSurvey}
                  pageNumber={previewPage === 'all' ? undefined : previewPage}
                />
              </div>
            </div>

            {/* Floating Mobile Action Buttons for Preview View */}
            <div className="no-print sm:hidden fixed bottom-20 left-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={() => handlePrint(currentSurvey)}
                className="min-h-[46px] px-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={() => handleExportPdf(currentSurvey)}
                disabled={isExporting}
                className="flex-1 min-h-[46px] bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                <span>Descargar PDF Oficial</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb Ergonomics) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        surveyCode={currentSurvey.codigoSitio}
      />

      {/* MODAL PREVIEW IF OPENED FROM DASHBOARD OR BUTTON */}
      {showPdfModal && (
        <PdfPreviewModal
          survey={currentSurvey}
          onClose={() => setShowPdfModal(false)}
          onEdit={() => {
            setShowPdfModal(false);
            setCurrentView('editor');
          }}
        />
      )}
      </div>

      {/* DEDICATED OFF-SCREEN SOURCE FOR HIGH-FIDELITY HTML2CANVAS PDF EXPORT */}
      {isExporting && (
        <div
          id="pdf-export-source"
          className="fixed top-0 left-0 -z-50 pointer-events-none opacity-100"
          style={{
            width: '210mm',
            transform: 'none',
          }}
          aria-hidden="true"
        >
          <PdfReportDocument survey={currentSurvey} idPrefix="export-" />
        </div>
      )}

      {/* DEDICATED PRINT CONTAINER: ACTIVE ONLY DURING @media print */}
      <div id="print-document-container" className="hidden print:block w-full">
        <PdfReportDocument survey={currentSurvey} idPrefix="print-" />
      </div>
    </>
  );
}

