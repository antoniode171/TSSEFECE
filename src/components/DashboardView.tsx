import React, { useState } from 'react';
import { SiteSurvey } from '../types/survey';
import {
  Search,
  Plus,
  FileDown,
  Printer,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Server,
  Zap,
  MapPin,
  Layers,
  Copy,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';

interface DashboardViewProps {
  surveys: SiteSurvey[];
  onSelectSurvey: (survey: SiteSurvey) => void;
  onEditSurvey: (survey: SiteSurvey) => void;
  onPreviewPdf: (survey: SiteSurvey) => void;
  onDownloadPdf: (survey: SiteSurvey) => void;
  onPrintPdf: (survey: SiteSurvey) => void;
  onNewSurvey: () => void;
  onDuplicateSurvey: (survey: SiteSurvey) => void;
  onDeleteSurvey: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  surveys,
  onEditSurvey,
  onPreviewPdf,
  onDownloadPdf,
  onPrintPdf,
  onNewSurvey,
  onDuplicateSurvey,
  onDeleteSurvey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aprobado' | 'En Revisión' | 'Borrador'>('Todos');
  const [selectedSiteForMap, setSelectedSiteForMap] = useState<SiteSurvey | null>(surveys[0] || null);

  // Filtered surveys
  const filteredSurveys = surveys.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (s.nombreSitio || '').toLowerCase().includes(q) ||
      (s.codigoSitio || '').toLowerCase().includes(q) ||
      (s.nombreProyecto || '').toLowerCase().includes(q) ||
      (s.contratista || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'Todos' || s.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics metrics
  const totalCount = surveys.length;
  const approvedCount = surveys.filter((s) => s.estado === 'Aprobado').length;
  const inReviewCount = surveys.filter((s) => s.estado === 'En Revisión').length;
  const draftCount = surveys.filter((s) => s.estado === 'Borrador').length;

  const rack19Count = surveys.filter((s) => (s.tipoRack || '').includes('19')).length;
  const rack21Count = surveys.filter((s) => (s.tipoRack || '').includes('21')).length;
  const rack23Count = surveys.filter((s) => (s.tipoRack || '').includes('23')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
            <span>Total Sitios Auditados</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Inspecciones telecom</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
            <span>Aprobados / Conformes</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {approvedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}% del despliegue
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
            <span>En Revisión Técnica</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {inReviewCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pendiente validación NOC</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
            <span>Borradores / En Campo</span>
            <AlertCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums">
            {draftCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Levantamiento en progreso</div>
        </div>
      </div>

      {/* Main Interactive Controls & Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (TGO-...), nombre, proyecto..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            {(['Todos', 'Aprobado', 'En Revisión', 'Borrador'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  statusFilter === status
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* New Survey CTA */}
          <button
            onClick={onNewSurvey}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-sky-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Nuevo Site Survey
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Sitio & Código</th>
                <th className="p-3">Proyecto / Tecnología</th>
                <th className="p-3">Rack & Gabinete</th>
                <th className="p-3">Planta de Fuerza</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones de Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No se encontraron reportes de Site Survey con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredSurveys.map((survey) => (
                  <tr
                    key={survey.id}
                    onClick={() => setSelectedSiteForMap(survey)}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{survey.nombreSitio}</span>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                        {survey.codigoSitio} · {survey.fechaReporte}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-200 font-medium">{survey.nombreProyecto}</div>
                      <div className="text-[11px] text-slate-400">{survey.tiposEquipos}</div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-200">
                        {survey.ubicacionRack} ({survey.tipoRack})
                      </div>
                      <div className="text-[11px] text-slate-400">{survey.ubicacionGabinete}</div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-200 truncate max-w-[200px]">
                        {survey.rectificadorA}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {survey.breakers.length} Breakers asignados
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          survey.estado === 'Aprobado'
                            ? 'text-emerald-400'
                            : survey.estado === 'En Revisión'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {survey.estado}
                      </span>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            survey.porcentajeCompletado === 100
                              ? 'bg-emerald-500'
                              : 'bg-sky-500'
                          }`}
                          style={{ width: `${survey.porcentajeCompletado}%` }}
                        />
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onPreviewPdf(survey)}
                          title="Previsualizar Reporte Oficial (6 Páginas)"
                          className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditSurvey(survey)}
                          title="Editar Datos de Inspección"
                          className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDownloadPdf(survey)}
                          title="Descargar PDF Idéntico (.pdf)"
                          className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded transition"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintPdf(survey)}
                          title="Imprimir / Guardar PDF Navegador"
                          className="p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-slate-800 rounded transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDuplicateSurvey(survey)}
                          title="Duplicar Plantilla de Sitio"
                          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteSurvey(survey.id)}
                          title="Eliminar Reporte"
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Touch Card List View (Ergonomic for Phones) */}
        <div className="block md:hidden space-y-3">
          {filteredSurveys.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
              No se encontraron sitios con los criterios de búsqueda.
            </div>
          ) : (
            filteredSurveys.map((survey) => (
              <div
                key={survey.id}
                onClick={() => setSelectedSiteForMap(survey)}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl active:bg-slate-900 transition flex flex-col gap-3"
              >
                {/* Top card bar: Code + Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {survey.codigoSitio}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400">{survey.fechaReporte}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      survey.estado === 'Aprobado'
                        ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800'
                        : survey.estado === 'En Revisión'
                        ? 'text-amber-400 bg-amber-950/80 border border-amber-800'
                        : 'text-sky-400 bg-sky-950/80 border border-sky-800'
                    }`}
                  >
                    {survey.estado}
                  </span>
                </div>

                {/* Main title & project */}
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{survey.nombreSitio}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{survey.nombreProyecto}</p>
                </div>

                {/* Telecom Equipment Info */}
                <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">Rack / Tipo:</span>
                    <span className="text-slate-200 font-medium">
                      {survey.ubicacionRack} ({survey.tipoRack})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Planta Fuerza:</span>
                    <span className="text-slate-200 font-medium truncate block">
                      {survey.rectificadorA || '—'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Completado</span>
                    <span className="font-mono">{survey.porcentajeCompletado}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        survey.porcentajeCompletado === 100
                          ? 'bg-emerald-500'
                          : 'bg-sky-500'
                      }`}
                      style={{ width: `${survey.porcentajeCompletado}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Action Buttons (Min 44px Touch Targets) */}
                <div
                  className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditSurvey(survey)}
                    className="min-h-[44px] py-2 px-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4 text-sky-400" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => onPreviewPdf(survey)}
                    className="min-h-[44px] py-2 px-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Ver PDF</span>
                  </button>

                  <button
                    onClick={() => onDownloadPdf(survey)}
                    className="min-h-[44px] py-2 px-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Infrastructure Analytics & Selected Site Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rack Distribution Chart */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <Server className="w-4 h-4 text-cyan-400" /> Distribución de Racks
          </div>
          <div className="space-y-2.5 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Rack Estándar 19"</span>
                <span className="font-mono text-slate-200 font-bold">{rack19Count} sitios</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full"
                  style={{
                    width: `${totalCount > 0 ? (rack19Count / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Rack ETSI 21"</span>
                <span className="font-mono text-slate-200 font-bold">{rack21Count} sitios</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full"
                  style={{
                    width: `${totalCount > 0 ? (rack21Count / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Gabinete 23" / Outdoor</span>
                <span className="font-mono text-slate-200 font-bold">{rack23Count} sitios</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full"
                  style={{
                    width: `${totalCount > 0 ? (rack23Count / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Site Details */}
        <div className="md:col-span-2 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Detalle de Ubicación & Acceso Seleccionado
            </div>
            {selectedSiteForMap && (
              <span className="text-[11px] font-mono text-cyan-400">
                {selectedSiteForMap.codigoSitio}
              </span>
            )}
          </div>

          {selectedSiteForMap ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Sitio:</span>
                  <span className="font-bold text-slate-100">{selectedSiteForMap.nombreSitio}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Coordenadas GPS:</span>
                  <span className="font-mono text-emerald-400">
                    {selectedSiteForMap.coordenadasSitio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Propietario del Sitio:</span>
                  <span className="text-slate-200">{selectedSiteForMap.propietarioSitio}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Retiro de Llave:</span>
                  <span className="text-slate-300">{selectedSiteForMap.dondeSeRetiraLlave}</span>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Rectificador Principal:</span>
                  <span className="font-medium text-rose-300">
                    {selectedSiteForMap.rectificadorA}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Cable Aterrizaje:</span>
                  <span className="font-mono text-slate-200">
                    {selectedSiteForMap.calibreCableAterrizajeAwg} · {selectedSiteForMap.recorridoCableAterrizajeMts}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Fibra Óptica (ODFs):</span>
                  <span className="text-slate-300">{selectedSiteForMap.nombreOdf1}</span>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onPreviewPdf(selectedSiteForMap)}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold transition"
                  >
                    Ver Reporte PDF Completo
                  </button>
                  <button
                    onClick={() => onEditSurvey(selectedSiteForMap)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                  >
                    Editar Inspección
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-4 text-center">
              Selecciona un sitio de la tabla para ver sus detalles técnicos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
