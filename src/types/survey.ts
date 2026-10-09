export interface BreakerAssignment {
  id: string;
  posicionBrk: string;
  capacidadBreaker: string;
  recorridoCableMts: string;
  calibreCableAwg: string;
}

export interface SitePhotoItem {
  id: string;
  titulo: string;
  descripcion?: string;
  imageUrl?: string;
}

export interface SiteSurvey {
  id: string;
  codigoSitio: string;
  estado: 'Aprobado' | 'En Revisión' | 'Borrador' | 'Rechazado';
  porcentajeCompletado: number;
  creadoPor: string;
  ultimaActualizacion: string;

  // PAGINA 1: DATOS GENERALES
  nombreSitio: string;
  nombreProyecto: string;
  fechaReporte: string;
  tiposEquipos: string;
  tipoReporte: string; // Ej: "Site Survey Inicial", "Modernización 5G", "Ampliación de Capacidad"
  contratista: string;

  // ACCESO AL SITIO
  requiereLlave: string; // "SI" | "NO" | detalle
  dondeSeRetiraLlave: string;
  propietarioSitio: string;
  coordenadasSitio: string; // Lat / Long
  region?: string;

  // FOTOS PAGINA 1
  fotoSitioUrl?: string;
  fotoAccesoUrl?: string;
  observacionesPag1: string;

  // PAGINA 2: DATOS GENERALES DEL RACK/GABINETE
  ubicacionRack: string;
  ubicacionGabinete: string;
  tipoRack: '19"' | '21"' | '23"' | '19" y 21"';
  fotoUbicacionRackUrl?: string;
  fotoUbicacionEquipoUrl?: string;

  // ODF
  nombreOdf1: string;
  nombreOdf2: string;
  conectorOdf1Upc: string; // ej: "12 puertos" o check
  conectorOdf1Apc: string;
  conectorOdf2Upc: string;
  conectorOdf2Apc: string;
  fotoOdf1Url?: string;
  fotoOdf2Url?: string;

  // PAGINA 3: PLANTA DE FUERZA Y ATERRIZAJE
  rectificadorA: string;
  rectificadorB: string;
  terminalesEnergiaDobleAgujero: string;
  terminalesEnergiaUnAgujero: string;
  terminalesEnergiaPunta: string;

  // BREAKERS
  breakers: BreakerAssignment[];

  // FOTOS FUERZA
  fotoRectificadorAUrl?: string;
  fotoRectificadorBUrl?: string;

  // ATERRIZAJE
  terminalesTierraDobleAgujero: string;
  terminalesTierraUnAgujero: string;
  calibreCableAterrizajeAwg: string;
  recorridoCableAterrizajeMts: string;
  fotoBarraTierraUrl?: string;
  observacionesFuerza: string;

  // PAGINA 4: PLANO DEL SITIO
  planoSitioUrl?: string;
  planoSitioNotas?: string;

  // PAGINA 5 & 6: FOTOS DEL SITIO (12 fotos en total o dinámico)
  fotosSitioPagina5: SitePhotoItem[];
  fotosSitioPagina6: SitePhotoItem[];
}
