import React from 'react';
import { SiteSurvey } from '../types/survey';
import { NokiaLogo } from './NokiaLogo';
import { TigoLogo } from './TigoLogo';

interface PdfReportDocumentProps {
  survey: SiteSurvey;
  pageNumber?: number; // if specified, render only that page; otherwise render all 6 pages
  idPrefix?: string; // prefix for DOM IDs, defaults to 'pdf-'
}

export const PdfReportDocument: React.FC<PdfReportDocumentProps> = ({
  survey,
  pageNumber,
  idPrefix = 'pdf-',
}) => {
  const pagesToRender = pageNumber ? [pageNumber] : [1, 2, 3, 4, 5, 6];

  const renderHeader = () => (
    <div className="w-full border-b-2 border-black pb-1 mb-2">
      <div className="flex items-center justify-between px-2">
        <div className="w-36 flex items-center">
          <NokiaLogo className="h-6" />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-[20px] font-black tracking-wide text-[#124191] uppercase">
            REPORTE SITE SURVEY
          </h1>
        </div>
        <div className="w-28 flex items-center justify-end">
          <TigoLogo className="h-7" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="pdf-document-container flex flex-col items-center gap-8 print:gap-0 bg-transparent">
      {/* ============================================================== */}
      {/* PAGINA 1: DATOS GENERALES Y ACCESO                             */}
      {/* ============================================================== */}
      {pagesToRender.includes(1) && (
        <div
          id={`${idPrefix}page-1`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div>
            {renderHeader()}

            {/* SECCION: DATOS GENERALES */}
            <div className="mb-3">
              <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center">
                <span className="font-extrabold text-[13px] tracking-wider text-black">
                  DATOS GENERALES
                </span>
              </div>
              <table className="w-full border-2 border-t-0 border-black border-collapse text-[10px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/4 font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      NOMBRE DEL SITIO
                    </td>
                    <td className="w-1/4 p-1.5 font-semibold text-slate-800 border-r border-black">
                      {survey.nombreSitio || '—'}
                    </td>
                    <td className="w-1/4 font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      NOMBRE DEL PROYECTO
                    </td>
                    <td className="w-1/4 p-1.5 font-semibold text-slate-800">
                      {survey.nombreProyecto || '—'}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      FECHA DEL REPORTE
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800 border-r border-black">
                      {survey.fechaReporte || '—'}
                    </td>
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      TIPOS DE EQUIPOS
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800">
                      {survey.tiposEquipos || '—'}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      TIPO DE REPORTE
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800 border-r border-black">
                      {survey.tipoReporte || '—'}
                    </td>
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      CONTRATISTA
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800">
                      {survey.contratista || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCION: ACCESO AL SITIO */}
            <div className="mb-3">
              <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center">
                <span className="font-extrabold text-[13px] tracking-wider text-black">
                  ACCESO AL SITIO
                </span>
              </div>
              <table className="w-full border-2 border-t-0 border-black border-collapse text-[10px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/4 font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      REQUIERE LLAVE
                    </td>
                    <td className="w-1/4 p-1.5 font-semibold text-slate-800 border-r border-black">
                      {survey.requiereLlave || '—'}
                    </td>
                    <td className="w-1/4 font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      DONDE SE RETIRA LA LLAVE
                    </td>
                    <td className="w-1/4 p-1.5 font-semibold text-slate-800">
                      {survey.dondeSeRetiraLlave || '—'}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      PROPIETARIO DEL SITIO
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800 border-r border-black">
                      {survey.propietarioSitio || '—'}
                    </td>
                    <td className="font-bold p-1.5 bg-slate-50 border-r border-black uppercase">
                      COORDENADAS DEL SITIO
                    </td>
                    <td className="p-1.5 font-semibold text-slate-800">
                      {survey.coordenadasSitio || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCION: FOTO DEL SITIO */}
            <div className="mb-3">
              <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center">
                <span className="font-extrabold text-[13px] tracking-wider text-black">
                  FOTO DEL SITIO
                </span>
              </div>
              <div className="grid grid-cols-2 border-2 border-t-0 border-black divide-x-2 divide-black">
                {/* Foto Sitio */}
                <div className="flex flex-col">
                  <div className="h-[95mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoSitioUrl ? (
                      <img
                        src={survey.fotoSitioUrl}
                        alt="Foto del Sitio"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">ESPACIO FOTO DEL SITIO</div>
                    )}
                  </div>
                  <div className="border-t-2 border-black py-1 text-center font-bold text-[10px] bg-slate-50">
                    FOTO DEL SITIO
                  </div>
                </div>

                {/* Foto Acceso */}
                <div className="flex flex-col">
                  <div className="h-[95mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoAccesoUrl ? (
                      <img
                        src={survey.fotoAccesoUrl}
                        alt="Foto del Acceso"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">ESPACIO FOTO DEL ACCESO</div>
                    )}
                  </div>
                  <div className="border-t-2 border-black py-1 text-center font-bold text-[10px] bg-slate-50">
                    FOTO DEL ACCESO
                  </div>
                </div>
              </div>
            </div>

            {/* SECCION: OBSERVACIONES */}
            <div>
              <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center">
                <span className="font-extrabold text-[13px] tracking-wider text-black">
                  OBSERVACIONES
                </span>
              </div>
              <div className="border-2 border-t-0 border-black p-2 min-h-[35mm] bg-white flex flex-col justify-start">
                <p className="text-[10px] text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {survey.observacionesPag1 || 'Sin observaciones registradas para este sitio.'}
                </p>
                {/* Ruled decorative lines matching original template */}
                <div className="mt-2 space-y-3.5 opacity-30">
                  <div className="border-b border-black"></div>
                  <div className="border-b border-black"></div>
                  <div className="border-b border-black"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page Number */}
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 1 de 6</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINA 2: DATOS GENERALES DEL RACK/GABINETE                   */}
      {/* ============================================================== */}
      {pagesToRender.includes(2) && (
        <div
          id={`${idPrefix}page-2`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div>
            {renderHeader()}

            {/* SECCION: DATOS GENERALES DEL RACK/GABINETE */}
            <div className="mb-2">
              <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center">
                <span className="font-extrabold text-[13px] tracking-wider text-black">
                  DATOS GENERALES DEL RACK/GABINETE
                </span>
              </div>
              <table className="w-full border-2 border-t-0 border-black border-collapse text-[10px]">
                <tbody>
                  <tr>
                    <td className="w-1/4 font-bold p-1.5 bg-slate-50 border-r border-black uppercase text-center">
                      UBICACIÓN DONDE SE INSTALARA EL EQUIPO
                    </td>
                    <td className="w-1/4 p-1.5 border-r border-black">
                      <div className="text-[10px] space-y-1">
                        <div>
                          <span className="font-semibold">RACK: </span>
                          <span className="font-bold text-slate-800">{survey.ubicacionRack}</span>
                        </div>
                        <div>
                          <span className="font-semibold">GABINETE: </span>
                          <span className="font-bold text-slate-800">{survey.ubicacionGabinete}</span>
                        </div>
                      </div>
                    </td>
                    <td className="w-1/6 font-bold p-1.5 bg-slate-50 border-r border-black uppercase text-center">
                      TIPO DE RACK
                    </td>
                    <td className="w-1/3 p-1.5">
                      <div className="flex items-center justify-around font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] ${
                              survey.tipoRack.includes('19') ? 'bg-black text-white' : 'bg-white'
                            }`}
                          >
                            {survey.tipoRack.includes('19') ? 'X' : ''}
                          </span>{' '}
                          19"
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] ${
                              survey.tipoRack.includes('21') ? 'bg-black text-white' : 'bg-white'
                            }`}
                          >
                            {survey.tipoRack.includes('21') ? 'X' : ''}
                          </span>{' '}
                          21"
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] ${
                              survey.tipoRack.includes('23') ? 'bg-black text-white' : 'bg-white'
                            }`}
                          >
                            {survey.tipoRack.includes('23') ? 'X' : ''}
                          </span>{' '}
                          23"
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FOTOS RACK / EQUIPO */}
            <div className="mb-2">
              <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black">
                {/* Ubicacion Rack */}
                <div className="flex flex-col">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                    UBICACIÓN DEL RACK/GABINETE
                  </div>
                  <div className="h-[75mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoUbicacionRackUrl ? (
                      <img
                        src={survey.fotoUbicacionRackUrl}
                        alt="Ubicación del Rack"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">FOTO DEL RACK</div>
                    )}
                  </div>
                </div>

                {/* Ubicacion Instalar Equipo */}
                <div className="flex flex-col">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                    UBICACIÓN A INSTALAR EL EQUIPO
                  </div>
                  <div className="h-[75mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoUbicacionEquipoUrl ? (
                      <img
                        src={survey.fotoUbicacionEquipoUrl}
                        alt="Ubicación Equipo"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">FOTO ESPACIO EQUIPO</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ODF SECTIONS */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* ODF Nombres */}
              <div className="border-2 border-black">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                  NOMBRE DE LOS ODF DEL SITIO A UTILIZAR
                </div>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/3 p-1 font-bold bg-slate-50 border-r border-black uppercase">
                        ODF 1
                      </td>
                      <td className="p-1 font-semibold text-slate-800">{survey.nombreOdf1 || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-slate-50 border-r border-black uppercase">
                        ODF 2
                      </td>
                      <td className="p-1 font-semibold text-slate-800">{survey.nombreOdf2 || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Conector ODF */}
              <div className="border-2 border-black">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                  TIPO DE CONECTOR DE LOS ODF
                </div>
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/4 p-1 font-bold bg-slate-50 border-r border-black uppercase">
                        ODF 1
                      </td>
                      <td className="p-1 border-r border-black text-[9px]">
                        <span className="font-semibold">UPC: </span>
                        <span>{survey.conectorOdf1Upc || '_______'}</span>
                      </td>
                      <td className="p-1 text-[9px]">
                        <span className="font-semibold">APC: </span>
                        <span>{survey.conectorOdf1Apc || '_______'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-slate-50 border-r border-black uppercase">
                        ODF 2
                      </td>
                      <td className="p-1 border-r border-black text-[9px]">
                        <span className="font-semibold">UPC: </span>
                        <span>{survey.conectorOdf2Upc || '_______'}</span>
                      </td>
                      <td className="p-1 text-[9px]">
                        <span className="font-semibold">APC: </span>
                        <span>{survey.conectorOdf2Apc || '_______'}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOTOS ODF */}
            <div>
              <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black">
                <div className="flex flex-col">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                    FOTO DEL ODF
                  </div>
                  <div className="h-[75mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoOdf1Url ? (
                      <img
                        src={survey.fotoOdf1Url}
                        alt="Foto ODF 1"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">FOTO ODF 1</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[10px] border-b-2 border-black uppercase">
                    FOTO DEL ODF
                  </div>
                  <div className="h-[75mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {survey.fotoOdf2Url ? (
                      <img
                        src={survey.fotoOdf2Url}
                        alt="Foto ODF 2"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-xs">FOTO ODF 2</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 2 de 6</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINA 3: PLANTA DE FUERZA Y ATERRIZAJE                        */}
      {/* ============================================================== */}
      {pagesToRender.includes(3) && (
        <div
          id={`${idPrefix}page-3`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div>
            {renderHeader()}

            <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center mb-2">
              <span className="font-extrabold text-[13px] tracking-wider text-black">
                PLANTA DE FUERZA Y ATERRIZAJE
              </span>
            </div>

            {/* TOP ROW: RECTIFICADORES + TERMINALES & ASIGNACION BREAKERS */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Left Column */}
              <div className="space-y-2">
                {/* Nombre Rectificadores */}
                <div className="border-2 border-black">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9px] border-b-2 border-black uppercase">
                    NOMBRE DE LOS RECTIFICADORES
                  </div>
                  <table className="w-full text-[9px]">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-2/5 p-1 font-bold bg-slate-50 border-r border-black uppercase">
                          RECTIFICADOR A
                        </td>
                        <td className="p-1 font-semibold text-slate-800">{survey.rectificadorA || '—'}</td>
                      </tr>
                      <tr>
                        <td className="p-1 font-bold bg-slate-50 border-r border-black uppercase">
                          RECTIFICADOR B
                        </td>
                        <td className="p-1 font-semibold text-slate-800">{survey.rectificadorB || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Terminales Energia */}
                <div className="border-2 border-black">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9px] border-b-2 border-black uppercase">
                    TERMINALES DE ENERGIA
                  </div>
                  <table className="w-full text-[8.5px]">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-4/5 p-1 font-semibold border-r border-black uppercase leading-tight">
                          CANTIDAD DE TERMINAL DE DOBLE AGUJERO DEL CALIBRE DEL CABLE DE ENERGIA
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.terminalesEnergiaDobleAgujero || '—'}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 font-semibold border-r border-black uppercase leading-tight">
                          CANTIDAD DE TERMINAL DE UN AGUJERO DEL CALIBRE DEL CABLE DE ENERGIA
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.terminalesEnergiaUnAgujero || '—'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1 font-semibold border-r border-black uppercase leading-tight">
                          CANTIDAD DE TERMINAL DE PUNTA DEL CALIBRE DEL CABLE DE ENERGIA
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.terminalesEnergiaPunta || '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: ASIGNACION BREAKERS */}
              <div className="border-2 border-black flex flex-col">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9px] border-b-2 border-black uppercase">
                  ASIGNACION DE LOS BREAKERS
                </div>
                <table className="w-full text-[8.5px] border-collapse flex-1">
                  <thead>
                    <tr className="border-b border-black bg-slate-100 font-bold text-center">
                      <th className="p-1 border-r border-black">POSICION DEL BRK</th>
                      <th className="p-1 border-r border-black">CAPACIDAD DEL BREAKER</th>
                      <th className="p-1 border-r border-black">RECORRIDO DE CABLE DE ENERGIA (MTS)</th>
                      <th className="p-1">CALIBRE DEL CABLE (AWG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((Array.isArray(survey?.breakers) && survey.breakers.length > 0)
                      ? survey.breakers
                      : [1, 2, 3, 4]
                    ).map((brk, idx) => {
                      const item = typeof brk === 'object' ? brk : null;
                      return (
                        <tr key={idx} className="border-b border-black text-center last:border-b-0 h-6">
                          <td className="p-1 border-r border-black font-semibold">
                            {item?.posicionBrk || ''}
                          </td>
                          <td className="p-1 border-r border-black font-semibold">
                            {item?.capacidadBreaker || ''}
                          </td>
                          <td className="p-1 border-r border-black font-semibold">
                            {item?.recorridoCableMts || ''}
                          </td>
                          <td className="p-1 font-semibold">{item?.calibreCableAwg || ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MIDDLE ROW: FOTOS RECTIFICADORES */}
            <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black mb-2">
              <div className="flex flex-col">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9.5px] border-b-2 border-black uppercase">
                  FOTO DEL RECTIFICADOR PF-A
                </div>
                <div className="h-[62mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                  {survey.fotoRectificadorAUrl ? (
                    <img
                      src={survey.fotoRectificadorAUrl}
                      alt="Rectificador A"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-xs">FOTO RECTIFICADOR PF-A</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9.5px] border-b-2 border-black uppercase">
                  FOTO DEL RECTIFICADOR PF-B
                </div>
                <div className="h-[62mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                  {survey.fotoRectificadorBUrl ? (
                    <img
                      src={survey.fotoRectificadorBUrl}
                      alt="Rectificador B"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-xs">FOTO RECTIFICADOR PF-B</div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: ATERRIZAJE & FOTO BARRA DE TIERRA */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left: Terminales Aterrizaje + Observaciones */}
              <div className="space-y-2">
                <div className="border-2 border-black">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9px] border-b-2 border-black uppercase">
                    TERMINALES DE ENERGIA / ATERRIZAJE
                  </div>
                  <table className="w-full text-[8.5px]">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-4/5 p-1 font-semibold border-r border-black uppercase leading-tight">
                          CANTIDAD DE TERMINAL DE DOBLE AGUJERO DEL CALIBRE DEL CABLE DE ATERRIZAJE
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.terminalesTierraDobleAgujero || '—'}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 font-semibold border-r border-black uppercase leading-tight">
                          CANTIDAD DE TERMINAL DE UN AGUJERO DEL CALIBRE DEL CABLE DE ATERRIZAJE
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.terminalesTierraUnAgujero || '—'}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 font-semibold border-r border-black uppercase">
                          CALIBRE DE CABLE DE ATERRIZAJE (AWG)
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.calibreCableAterrizajeAwg || '—'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1 font-semibold border-r border-black uppercase">
                          RECORRIDO DE CABLE DE ATERRIZAJE (MTS)
                        </td>
                        <td className="p-1 text-center font-bold text-slate-800">
                          {survey.recorridoCableAterrizajeMts || '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-2 border-black">
                  <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9px] border-b-2 border-black uppercase">
                    OBSERVACIONES GENERALES
                  </div>
                  <div className="p-1.5 min-h-[22mm] text-[9px] text-slate-800 leading-tight">
                    {survey.observacionesFuerza || 'Sin observaciones de planta de fuerza.'}
                    <div className="mt-2 space-y-2 opacity-30">
                      <div className="border-b border-black"></div>
                      <div className="border-b border-black"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Foto Barra de Tierra */}
              <div className="border-2 border-black flex flex-col">
                <div className="bg-[#00A3E0] py-0.5 text-center font-bold text-[9.5px] border-b-2 border-black uppercase">
                  FOTO DE LA BARRA DE TIERRA
                </div>
                <div className="h-[60mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1 flex-1">
                  {survey.fotoBarraTierraUrl ? (
                    <img
                      src={survey.fotoBarraTierraUrl}
                      alt="Barra de Tierra"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-xs">FOTO BARRA DE TIERRA</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 3 de 6</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINA 4: PLANO DEL SITIO                                      */}
      {/* ============================================================== */}
      {pagesToRender.includes(4) && (
        <div
          id={`${idPrefix}page-4`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div className="flex flex-col h-full">
            {renderHeader()}

            <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center mb-2">
              <span className="font-extrabold text-[13px] tracking-wider text-black">
                PLANO DEL SITIO
              </span>
            </div>

            {/* FULL SHEET PLANO CONTAINER */}
            <div className="flex-1 border-2 border-black relative overflow-hidden bg-[#fafafa] flex flex-col p-4">
              {survey.planoSitioUrl ? (
                <img
                  src={survey.planoSitioUrl}
                  alt="Plano del Sitio"
                  className="w-full h-full object-contain"
                />
              ) : (
                /* Crisp Technical Floorplan Render */
                <div className="w-full h-full border border-dashed border-slate-300 relative bg-white p-6 flex flex-col justify-between">
                  {/* Grid background */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #00A3E0 1px, transparent 1px), linear-gradient(to bottom, #00A3E0 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Top technical banner */}
                  <div className="relative z-10 flex justify-between items-start border-b border-black pb-2 text-[10px] font-mono">
                    <div>
                      <div className="font-bold text-slate-900 uppercase">
                        LAYOUT DE SALA DE TRANSMISION & ENERGIA
                      </div>
                      <div className="text-slate-600">SITIO: {survey.nombreSitio}</div>
                    </div>
                    <div className="text-right text-slate-700">
                      <div>ESCALA: 1:50</div>
                      <div>NORMA: TIA-942 / NOKIA SPEC</div>
                    </div>
                  </div>

                  {/* Floorplan Box Schematic */}
                  <div className="relative z-10 my-auto w-[85%] mx-auto h-[160mm] border-4 border-slate-900 bg-slate-50 relative p-4 flex flex-col justify-between">
                    {/* Door access */}
                    <div className="absolute -bottom-4 left-10 w-24 h-4 bg-amber-500 border border-black flex items-center justify-center text-[9px] font-bold text-white">
                      ACCESO 0.90m
                    </div>

                    {/* Left wall: Ground busbar */}
                    <div className="absolute left-2 top-8 w-6 h-28 bg-emerald-600 border border-black flex items-center justify-center">
                      <span className="text-[8px] text-white font-mono font-bold -rotate-90">
                        BARRA MGB
                      </span>
                    </div>

                    {/* Racks Row */}
                    <div className="absolute top-16 left-28 flex gap-8">
                      <div className="w-20 h-32 border-2 border-sky-600 bg-sky-100 flex flex-col justify-between p-1">
                        <span className="text-[8px] font-bold text-sky-900 uppercase">
                          RACK 01
                        </span>
                        <div className="text-[7.5px] text-sky-800 text-center font-mono">
                          NOKIA AIRSCALE
                        </div>
                        <span className="text-[7px] text-slate-500">19" / 42U</span>
                      </div>

                      <div className="w-20 h-32 border-2 border-sky-800 bg-sky-200/60 flex flex-col justify-between p-1">
                        <span className="text-[8px] font-bold text-sky-950 uppercase">
                          RACK 02
                        </span>
                        <div className="text-[7.5px] text-sky-900 text-center font-mono">
                          ODF FIBRA
                        </div>
                        <span className="text-[7px] text-slate-500">19" / 42U</span>
                      </div>
                    </div>

                    {/* Rectifiers & Power Row */}
                    <div className="absolute top-16 right-16 flex flex-col gap-6">
                      <div className="w-28 h-20 border-2 border-rose-600 bg-rose-100 flex flex-col justify-between p-1">
                        <span className="text-[8px] font-bold text-rose-900">
                          RECTIFICADOR A/B
                        </span>
                        <div className="text-[7.5px] text-rose-800 font-mono">
                          -48V DC / 600A
                        </div>
                        <span className="text-[7px] text-slate-500">VERTIV / ELTEK</span>
                      </div>

                      <div className="w-28 h-20 border-2 border-lime-600 bg-lime-100 flex flex-col justify-between p-1">
                        <span className="text-[8px] font-bold text-lime-900">
                          BANCO BATERIAS
                        </span>
                        <div className="text-[7.5px] text-lime-800 font-mono">
                          48V / 200Ah
                        </div>
                        <span className="text-[7px] text-slate-500">4 STRINGS</span>
                      </div>
                    </div>

                    {/* Overhead cable ladder dashed line */}
                    <div className="absolute top-8 left-16 right-12 border-t-2 border-dashed border-slate-600 flex items-center justify-center">
                      <span className="bg-white px-2 text-[8px] text-slate-600 font-mono">
                        ESCALERILLA AEREA PORTACABLES 400mm
                      </span>
                    </div>

                    {/* North Indicator */}
                    <div className="absolute top-3 right-4 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[10px] font-bold">
                        N
                      </div>
                      <span className="text-[8px]">NORTE</span>
                    </div>
                  </div>

                  {/* Notes at bottom of blueprint */}
                  <div className="relative z-10 border-t border-black pt-2 text-[9px] text-slate-800">
                    <span className="font-bold">NOTAS TECNICAS: </span>
                    <span>
                      {survey.planoSitioNotas ||
                        'Distribución acorde a norma de espacio para pasillos de mantenimiento frontal y posterior (mínimo 0.80m). Escalerillas con bajantes normalizados y radios de curvatura para fibra óptica.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 4 de 6</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINA 5: FOTOS DEL SITIO (GALERIA 1)                           */}
      {/* ============================================================== */}
      {pagesToRender.includes(5) && (
        <div
          id={`${idPrefix}page-5`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div>
            {renderHeader()}

            <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center mb-2">
              <span className="font-extrabold text-[13px] tracking-wider text-black">
                FOTOS DEL SITIO
              </span>
            </div>

            {/* 6 Photo Slots (2 columns x 3 rows) */}
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(survey?.fotosSitioPagina5) ? survey.fotosSitioPagina5 : [])
                .slice(0, 6)
                .map((photo, index) => (
                <div key={photo.id || index} className="border-2 border-black flex flex-col">
                  {/* Photo Title Bar */}
                  <div className="bg-[#00A3E0] py-0.5 px-1.5 font-bold text-[9px] border-b-2 border-black uppercase truncate">
                    FOTO DE: <span className="underline">{photo.titulo || '__________________'}</span>
                  </div>
                  {/* Photo Viewport */}
                  <div className="h-[62mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.titulo}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-[10px]">ESPACIO FOTOGRAFICO</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 5 de 6</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINA 6: FOTOS DEL SITIO (GALERIA 2 CONTINUACION)             */}
      {/* ============================================================== */}
      {pagesToRender.includes(6) && (
        <div
          id={`${idPrefix}page-6`}
          className="pdf-page w-[210mm] min-h-[297mm] h-[297mm] p-[10mm] bg-white text-black font-sans box-border relative flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:p-[10mm] page-break-after-always"
        >
          <div>
            {renderHeader()}

            <div className="bg-[#00A3E0] border-2 border-black py-1 px-2 text-center mb-2">
              <span className="font-extrabold text-[13px] tracking-wider text-black">
                FOTOS DEL SITIO (CONTINUACIÓN)
              </span>
            </div>

            {/* 6 Photo Slots (2 columns x 3 rows) */}
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(survey?.fotosSitioPagina6) ? survey.fotosSitioPagina6 : [])
                .slice(0, 6)
                .map((photo, index) => (
                <div key={photo.id || index} className="border-2 border-black flex flex-col">
                  {/* Photo Title Bar */}
                  <div className="bg-[#00A3E0] py-0.5 px-1.5 font-bold text-[9px] border-b-2 border-black uppercase truncate">
                    FOTO DE: <span className="underline">{photo.titulo || '__________________'}</span>
                  </div>
                  {/* Photo Viewport */}
                  <div className="h-[62mm] bg-slate-100 flex items-center justify-center overflow-hidden p-1">
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.titulo}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      <div className="text-slate-400 font-mono text-[10px]">ESPACIO FOTOGRAFICO</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-t border-slate-300 pt-1 mt-2">
            <span>NOKIA / TIGO SITE SURVEY</span>
            <span>{survey.codigoSitio}</span>
            <span>Página 6 de 6</span>
          </div>
        </div>
      )}
    </div>
  );
};
