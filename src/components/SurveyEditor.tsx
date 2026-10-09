import React, { useState } from 'react';
import {
  SiteSurvey,
  BreakerAssignment,
  SitePhotoItem,
} from '../types/survey';
import {
  FileText,
  Server,
  Zap,
  MapPin,
  Camera,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Save,
  ArrowRight,
  ArrowLeft,
  Eye,
  ImageIcon,
} from 'lucide-react';
import { SitePlanCanvas } from './SitePlanCanvas';

interface SurveyEditorProps {
  survey: SiteSurvey;
  onSave: (updated: SiteSurvey) => void;
  onPreviewPdf: () => void;
}

// Mobile-friendly image slot with both Camera and Gallery options
const MobileImageSlot: React.FC<{
  label: string;
  imageUrl?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}> = ({ label, imageUrl, onUpload, onRemove }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        onUpload(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-slate-800 rounded-xl p-3 bg-slate-950 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-200">{label}</span>
        {imageUrl && (
          <button
            onClick={onRemove}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition"
          >
            Quitar
          </button>
        )}
      </div>

      <div className="h-40 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-500 text-xs">
            <ImageIcon className="w-6 h-6 stroke-1 text-slate-600" />
            <span>Sin fotografía técnica</span>
          </div>
        )}
      </div>

      {/* Dual Buttons for Mobile Ergonomics: Camera & File Picker */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <label className="cursor-pointer min-h-[42px] py-2 px-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-sky-300 hover:text-white rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 text-xs font-medium transition active:scale-95">
          <Camera className="w-4 h-4 text-sky-400" />
          <span>Cámara</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <label className="cursor-pointer min-h-[42px] py-2 px-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 text-xs font-medium transition active:scale-95">
          <Upload className="w-4 h-4 text-slate-400" />
          <span>Galería</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export const SurveyEditor: React.FC<SurveyEditorProps> = ({
  survey,
  onSave,
  onPreviewPdf,
}) => {
  const [formData, setFormData] = useState<SiteSurvey>({ ...survey });
  const [activeTab, setActiveTab] = useState<
    'general' | 'rack' | 'fuerza' | 'plano' | 'fotos'
  >('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateField = <K extends keyof SiteSurvey>(key: K, value: SiteSurvey[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      // recalculate percentage
      return updated;
    });
  };

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Image uploader helper
  const handleImageUpload = (
    field: keyof SiteSurvey,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        updateField(field, result as any);
      };
      reader.readAsDataURL(file);
    }
  };

  // Breakers management
  const handleBreakerChange = (
    id: string,
    field: keyof BreakerAssignment,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      breakers: prev.breakers.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const addBreaker = () => {
    const newBrk: BreakerAssignment = {
      id: `brk-${Date.now()}`,
      posicionBrk: `BRK-${formData.breakers.length + 1}`,
      capacidadBreaker: '50 Amp',
      recorridoCableMts: '10.0 mts',
      calibreCableAwg: '4 AWG',
    };
    setFormData((prev) => ({
      ...prev,
      breakers: [...prev.breakers, newBrk],
    }));
  };

  const removeBreaker = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      breakers: prev.breakers.filter((b) => b.id !== id),
    }));
  };

  // Photo gallery items
  const handleGalleryPhotoUpload = (
    listName: 'fotosSitioPagina5' | 'fotosSitioPagina6',
    index: number,
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setFormData((prev) => {
        const list = [...prev[listName]];
        list[index] = { ...list[index], imageUrl: result };
        return { ...prev, [listName]: list };
      });
    };
    reader.readAsDataURL(file);
  };

  const updateGalleryTitle = (
    listName: 'fotosSitioPagina5' | 'fotosSitioPagina6',
    index: number,
    title: string
  ) => {
    setFormData((prev) => {
      const list = [...prev[listName]];
      list[index] = { ...list[index], titulo: title };
      return { ...prev, [listName]: list };
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-cyan-400">{formData.codigoSitio}</span>
            <span>·</span>
            <span>Edición de Inspección Técnica</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">{formData.nombreSitio}</h2>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Guardado correctamente
            </span>
          )}

          <button
            onClick={onPreviewPdf}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-cyan-400" /> Ver Reporte PDF
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-sky-600/30 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Pág 1: Datos & Acceso
        </button>

        <button
          onClick={() => setActiveTab('rack')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'rack'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Server className="w-4 h-4" /> Pág 2: Rack & ODF
        </button>

        <button
          onClick={() => setActiveTab('fuerza')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'fuerza'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" /> Pág 3: Fuerza & Aterrizaje
        </button>

        <button
          onClick={() => setActiveTab('plano')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'plano'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" /> Pág 4: Plano del Sitio
        </button>

        <button
          onClick={() => setActiveTab('fotos')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'fotos'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" /> Pág 5 & 6: Galería Fotográfica
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DATOS GENERALES & ACCESO                                 */}
      {/* ============================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Datos Generales Section */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Sección 1: Datos Generales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre del Sitio
                </label>
                <input
                  type="text"
                  value={formData.nombreSitio}
                  onChange={(e) => updateField('nombreSitio', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  value={formData.nombreProyecto}
                  onChange={(e) => updateField('nombreProyecto', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fecha del Reporte
                </label>
                <input
                  type="date"
                  value={formData.fechaReporte}
                  onChange={(e) => updateField('fechaReporte', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tipos de Equipos
                </label>
                <input
                  type="text"
                  value={formData.tiposEquipos}
                  onChange={(e) => updateField('tiposEquipos', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tipo de Reporte
                </label>
                <input
                  type="text"
                  value={formData.tipoReporte}
                  onChange={(e) => updateField('tipoReporte', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contratista
                </label>
                <input
                  type="text"
                  value={formData.contratista}
                  onChange={(e) => updateField('contratista', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Acceso al Sitio Section */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Sección 2: Acceso al Sitio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ¿Requiere Llave?
                </label>
                <input
                  type="text"
                  value={formData.requiereLlave}
                  onChange={(e) => updateField('requiereLlave', e.target.value)}
                  placeholder="SI (Candado #4) / NO"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ¿Dónde se retira la llave?
                </label>
                <input
                  type="text"
                  value={formData.dondeSeRetiraLlave}
                  onChange={(e) => updateField('dondeSeRetiraLlave', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Propietario del Sitio
                </label>
                <input
                  type="text"
                  value={formData.propietarioSitio}
                  onChange={(e) => updateField('propietarioSitio', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Coordenadas del Sitio (Lat / Long)
                </label>
                <input
                  type="text"
                  value={formData.coordenadasSitio}
                  onChange={(e) => updateField('coordenadasSitio', e.target.value)}
                  placeholder="6.2367° N, -75.5804° W"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Fotos de Página 1 */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Fotos de Portada (Sitio & Acceso)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MobileImageSlot
                label="FOTO DEL SITIO"
                imageUrl={formData.fotoSitioUrl}
                onUpload={(url) => updateField('fotoSitioUrl', url)}
                onRemove={() => updateField('fotoSitioUrl', '')}
              />
              <MobileImageSlot
                label="FOTO DEL ACCESO"
                imageUrl={formData.fotoAccesoUrl}
                onUpload={(url) => updateField('fotoAccesoUrl', url)}
                onRemove={() => updateField('fotoAccesoUrl', '')}
              />
            </div>

            {/* Observaciones Página 1 */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observaciones Generales de Acceso y Logística
              </label>
              <textarea
                value={formData.observacionesPag1}
                onChange={(e) => updateField('observacionesPag1', e.target.value)}
                rows={3}
                className="w-full text-base md:text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RACK & ODF                                              */}
      {/* ============================================================== */}
      {activeTab === 'rack' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Datos Generales del Rack / Gabinete
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ubicación del Rack
                </label>
                <input
                  type="text"
                  value={formData.ubicacionRack}
                  onChange={(e) => updateField('ubicacionRack', e.target.value)}
                  placeholder="RACK 02"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ubicación del Gabinete
                </label>
                <input
                  type="text"
                  value={formData.ubicacionGabinete}
                  onChange={(e) => updateField('ubicacionGabinete', e.target.value)}
                  placeholder="GAB-INDOOR"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tipo de Rack
                </label>
                <div className="flex items-center gap-3 pt-2">
                  {(['19"', '21"', '23"'] as const).map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="tipoRack"
                        checked={formData.tipoRack === r}
                        onChange={() => updateField('tipoRack', r)}
                        className="text-sky-500 focus:ring-0"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Fotos Rack y Ubicacion Equipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <MobileImageSlot
                label="FOTO UBICACIÓN RACK/GABINETE"
                imageUrl={formData.fotoUbicacionRackUrl}
                onUpload={(url) => updateField('fotoUbicacionRackUrl', url)}
                onRemove={() => updateField('fotoUbicacionRackUrl', '')}
              />
              <MobileImageSlot
                label="FOTO A INSTALAR EL EQUIPO"
                imageUrl={formData.fotoUbicacionEquipoUrl}
                onUpload={(url) => updateField('fotoUbicacionEquipoUrl', url)}
                onRemove={() => updateField('fotoUbicacionEquipoUrl', '')}
              />
            </div>
          </div>

          {/* ODF Section */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Distribución de Fibra Óptica (ODF 1 & ODF 2)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ODF 1 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase">ODF 1</h4>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Nombre del ODF 1 en Sitio
                  </label>
                  <input
                    type="text"
                    value={formData.nombreOdf1}
                    onChange={(e) => updateField('nombreOdf1', e.target.value)}
                    className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Conector UPC</label>
                    <input
                      type="text"
                      value={formData.conectorOdf1Upc}
                      onChange={(e) => updateField('conectorOdf1Upc', e.target.value)}
                      placeholder="Ej: 24 LC/UPC"
                      className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Conector APC</label>
                    <input
                      type="text"
                      value={formData.conectorOdf1Apc}
                      onChange={(e) => updateField('conectorOdf1Apc', e.target.value)}
                      placeholder="Ej: 24 SC/APC"
                      className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                    />
                  </div>
                </div>
                <MobileImageSlot
                  label="FOTO ODF 1"
                  imageUrl={formData.fotoOdf1Url}
                  onUpload={(url) => updateField('fotoOdf1Url', url)}
                  onRemove={() => updateField('fotoOdf1Url', '')}
                />
              </div>

              {/* ODF 2 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase">ODF 2</h4>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Nombre del ODF 2 en Sitio
                  </label>
                  <input
                    type="text"
                    value={formData.nombreOdf2}
                    onChange={(e) => updateField('nombreOdf2', e.target.value)}
                    className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Conector UPC</label>
                    <input
                      type="text"
                      value={formData.conectorOdf2Upc}
                      onChange={(e) => updateField('conectorOdf2Upc', e.target.value)}
                      placeholder="Ej: 12 LC/UPC"
                      className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Conector APC</label>
                    <input
                      type="text"
                      value={formData.conectorOdf2Apc}
                      onChange={(e) => updateField('conectorOdf2Apc', e.target.value)}
                      placeholder="Ej: 12 SC/APC"
                      className="w-full text-base md:text-xs p-2 bg-slate-900 border border-slate-800 rounded text-slate-100"
                    />
                  </div>
                </div>
                <MobileImageSlot
                  label="FOTO ODF 2"
                  imageUrl={formData.fotoOdf2Url}
                  onUpload={(url) => updateField('fotoOdf2Url', url)}
                  onRemove={() => updateField('fotoOdf2Url', '')}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: PLANTA DE FUERZA Y ATERRIZAJE                           */}
      {/* ============================================================== */}
      {activeTab === 'fuerza' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Rectificadores & Terminales de Energía
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre Rectificador A
                </label>
                <input
                  type="text"
                  value={formData.rectificadorA}
                  onChange={(e) => updateField('rectificadorA', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre Rectificador B
                </label>
                <input
                  type="text"
                  value={formData.rectificadorB}
                  onChange={(e) => updateField('rectificadorB', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Cant. Terminal Doble Agujero (Energía)
                </label>
                <input
                  type="text"
                  value={formData.terminalesEnergiaDobleAgujero}
                  onChange={(e) =>
                    updateField('terminalesEnergiaDobleAgujero', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Cant. Terminal Un Agujero (Energía)
                </label>
                <input
                  type="text"
                  value={formData.terminalesEnergiaUnAgujero}
                  onChange={(e) =>
                    updateField('terminalesEnergiaUnAgujero', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Cant. Terminal de Punta (Energía)
                </label>
                <input
                  type="text"
                  value={formData.terminalesEnergiaPunta}
                  onChange={(e) => updateField('terminalesEnergiaPunta', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>
            </div>

            {/* Asignacion Breakers - Responsive Desktop Table & Mobile Cards */}
            <div className="pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase">
                  Asignación de los Breakers
                </span>
                <button
                  onClick={addBreaker}
                  className="min-h-[36px] px-3 py-1.5 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg text-xs hover:bg-sky-900 transition flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> + Breaker
                </button>
              </div>

              {/* Desktop Breakers Table */}
              <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Posición del BRK</th>
                      <th className="p-2">Capacidad Breaker</th>
                      <th className="p-2">Recorrido Cable (Mts)</th>
                      <th className="p-2">Calibre Cable (AWG)</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {formData.breakers.map((brk) => (
                      <tr key={brk.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={brk.posicionBrk}
                            onChange={(e) =>
                              handleBreakerChange(brk.id, 'posicionBrk', e.target.value)
                            }
                            className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={brk.capacidadBreaker}
                            onChange={(e) =>
                              handleBreakerChange(brk.id, 'capacidadBreaker', e.target.value)
                            }
                            className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={brk.recorridoCableMts}
                            onChange={(e) =>
                              handleBreakerChange(brk.id, 'recorridoCableMts', e.target.value)
                            }
                            className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={brk.calibreCableAwg}
                            onChange={(e) =>
                              handleBreakerChange(brk.id, 'calibreCableAwg', e.target.value)
                            }
                            className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeBreaker(brk.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Breakers Card List */}
              <div className="block md:hidden space-y-2.5">
                {formData.breakers.map((brk, bIdx) => (
                  <div
                    key={brk.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-xs font-bold text-sky-400 font-mono">
                        Disyuntor #{bIdx + 1}
                      </span>
                      <button
                        onClick={() => removeBreaker(brk.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                        title="Eliminar breaker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Posición BRK
                        </label>
                        <input
                          type="text"
                          value={brk.posicionBrk}
                          onChange={(e) =>
                            handleBreakerChange(brk.id, 'posicionBrk', e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-base md:text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Capacidad (A)
                        </label>
                        <input
                          type="text"
                          value={brk.capacidadBreaker}
                          onChange={(e) =>
                            handleBreakerChange(brk.id, 'capacidadBreaker', e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-base md:text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Recorrido (Mts)
                        </label>
                        <input
                          type="text"
                          value={brk.recorridoCableMts}
                          onChange={(e) =>
                            handleBreakerChange(brk.id, 'recorridoCableMts', e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-base md:text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Calibre (AWG)
                        </label>
                        <input
                          type="text"
                          value={brk.calibreCableAwg}
                          onChange={(e) =>
                            handleBreakerChange(brk.id, 'calibreCableAwg', e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-base md:text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fotos Rectificadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <MobileImageSlot
                label="FOTO RECTIFICADOR PF-A"
                imageUrl={formData.fotoRectificadorAUrl}
                onUpload={(url) => updateField('fotoRectificadorAUrl', url)}
                onRemove={() => updateField('fotoRectificadorAUrl', '')}
              />
              <MobileImageSlot
                label="FOTO RECTIFICADOR PF-B"
                imageUrl={formData.fotoRectificadorBUrl}
                onUpload={(url) => updateField('fotoRectificadorBUrl', url)}
                onRemove={() => updateField('fotoRectificadorBUrl', '')}
              />
            </div>
          </div>

          {/* Aterrizaje Section */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Sistema de Aterrizaje & Puesta a Tierra
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Terminales Doble Agujero Aterrizaje
                </label>
                <input
                  type="text"
                  value={formData.terminalesTierraDobleAgujero}
                  onChange={(e) =>
                    updateField('terminalesTierraDobleAgujero', e.target.value)
                  }
                  className="w-full text-base md:text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Terminales Un Agujero Aterrizaje
                </label>
                <input
                  type="text"
                  value={formData.terminalesTierraUnAgujero}
                  onChange={(e) =>
                    updateField('terminalesTierraUnAgujero', e.target.value)
                  }
                  className="w-full text-base md:text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Calibre Cable Aterrizaje (AWG)
                </label>
                <input
                  type="text"
                  value={formData.calibreCableAterrizajeAwg}
                  onChange={(e) =>
                    updateField('calibreCableAterrizajeAwg', e.target.value)
                  }
                  className="w-full text-base md:text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Recorrido Cable Aterrizaje (Mts)
                </label>
                <input
                  type="text"
                  value={formData.recorridoCableAterrizajeMts}
                  onChange={(e) =>
                    updateField('recorridoCableAterrizajeMts', e.target.value)
                  }
                  className="w-full text-base md:text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <MobileImageSlot
                label="FOTO DE LA BARRA DE TIERRA (MGB)"
                imageUrl={formData.fotoBarraTierraUrl}
                onUpload={(url) => updateField('fotoBarraTierraUrl', url)}
                onRemove={() => updateField('fotoBarraTierraUrl', '')}
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Observaciones Generales de Fuerza y Aterrizaje
                </label>
                <textarea
                  value={formData.observacionesFuerza}
                  onChange={(e) => updateField('observacionesFuerza', e.target.value)}
                  rows={5}
                  className="w-full text-base md:text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: PLANO DEL SITIO                                         */}
      {/* ============================================================== */}
      {activeTab === 'plano' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Página 4: Plano Técnico y Distribución de Elementos
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Usa el diseñador interactivo para ubicar los racks, rectificadores, baterías y
              recorridos de escalerillas, o sube directamente el plano técnico en formato imagen.
            </p>

            <SitePlanCanvas
              initialPlanUrl={formData.planoSitioUrl}
              notes={formData.planoSitioNotas}
              onUpdatePlanUrl={(url) => updateField('planoSitioUrl', url)}
              onUpdateNotes={(notes) => updateField('planoSitioNotas', notes)}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: GALERIA FOTOGRAFICA (PAGINAS 5 & 6)                     */}
      {/* ============================================================== */}
      {activeTab === 'fotos' && (
        <div className="space-y-6">
          {/* Pagina 5 photos */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Página 5: Fotos del Sitio (Lote 1)
              </h3>
              <span className="text-xs text-slate-400">6 cuadrantes técnicos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.fotosSitioPagina5.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400">
                      Foto #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <label className="cursor-pointer text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <Camera className="w-3 h-3" /> Cámara
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleGalleryPhotoUpload('fotosSitioPagina5', idx, f);
                          }}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <Upload className="w-3 h-3" /> Archivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleGalleryPhotoUpload('fotosSitioPagina5', idx, f);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={photo.titulo}
                      onChange={(e) =>
                        updateGalleryTitle('fotosSitioPagina5', idx, e.target.value)
                      }
                      placeholder="Título / FOTO DE:..."
                      className="w-full text-base md:text-xs p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 font-semibold"
                    />
                  </div>
                  <div className="h-32 bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-slate-800">
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-500">Sin foto</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagina 6 photos */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Página 6: Fotos del Sitio (Lote 2 Continuación)
              </h3>
              <span className="text-xs text-slate-400">6 cuadrantes técnicos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.fotosSitioPagina6.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400">
                      Foto #{idx + 7}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <label className="cursor-pointer text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <Camera className="w-3 h-3" /> Cámara
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleGalleryPhotoUpload('fotosSitioPagina6', idx, f);
                          }}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <Upload className="w-3 h-3" /> Archivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleGalleryPhotoUpload('fotosSitioPagina6', idx, f);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={photo.titulo}
                      onChange={(e) =>
                        updateGalleryTitle('fotosSitioPagina6', idx, e.target.value)
                      }
                      placeholder="Título / FOTO DE:..."
                      className="w-full text-base md:text-xs p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 font-semibold"
                    />
                  </div>
                  <div className="h-32 bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-slate-800">
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-500">Sin foto</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Thumb-Zone Quick Action Bar */}
      <div className="no-print md:hidden fixed bottom-18 left-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex-1 min-h-[48px] py-2.5 px-4 bg-sky-600 active:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xl shadow-sky-950 flex items-center justify-center gap-2 active:scale-98"
        >
          <Save className="w-4 h-4" /> Guardar Cambios
        </button>
        <button
          onClick={onPreviewPdf}
          className="min-h-[48px] py-2.5 px-4 bg-slate-900 border border-slate-700 active:bg-slate-800 text-slate-100 font-semibold text-xs rounded-xl shadow-xl flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Eye className="w-4 h-4 text-cyan-400" /> Ver PDF
        </button>
      </div>

      {/* Bottom Save bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl mt-4 pb-20 md:pb-4">
        <button
          onClick={() => {
            const tabs: ('general' | 'rack' | 'fuerza' | 'plano' | 'fotos')[] = [
              'general',
              'rack',
              'fuerza',
              'plano',
              'fotos',
            ];
            const currIdx = tabs.indexOf(activeTab);
            if (currIdx > 0) setActiveTab(tabs[currIdx - 1]);
          }}
          disabled={activeTab === 'general'}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Anterior
        </button>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>

        <button
          onClick={() => {
            const tabs: ('general' | 'rack' | 'fuerza' | 'plano' | 'fotos')[] = [
              'general',
              'rack',
              'fuerza',
              'plano',
              'fotos',
            ];
            const currIdx = tabs.indexOf(activeTab);
            if (currIdx < tabs.length - 1) setActiveTab(tabs[currIdx + 1]);
          }}
          disabled={activeTab === 'fotos'}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
        >
          Siguiente <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
