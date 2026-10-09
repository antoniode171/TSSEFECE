import { SiteSurvey } from '../types/survey';

import towerPhoto from '../assets/images/telecom_cell_tower_site_1791151102710.jpg';
import rackPhoto from '../assets/images/telecom_equipment_rack_1791151113070.jpg';
import rectifierPhoto from '../assets/images/telecom_power_rectifier_1791151121959.jpg';
import groundPhoto from '../assets/images/telecom_ground_busbar_1791151130854.jpg';

export const initialSurveys: SiteSurvey[] = [
  {
    id: 'survey-tgo-001',
    codigoSitio: 'TGO-ANT-1044',
    estado: 'Aprobado',
    porcentajeCompletado: 100,
    creadoPor: 'Ing. Carlos Mendoza (Nokia Services)',
    ultimaActualizacion: '2026-03-28 16:45',
    region: 'Antioquia - Medellín',

    // PAGINA 1: DATOS GENERALES
    nombreSitio: 'MED-1044 CERRO NUTIBARA HUB',
    nombreProyecto: 'MODERNIZACION RAN 5G NOKIA AIRSCALE',
    fechaReporte: '2026-03-28',
    tiposEquipos: 'NOKIA AIRSCALE BBU ASIA + ABIL 5G M-MIMO',
    tipoReporte: 'SITE SURVEY DEFINITIVO (TSS)',
    contratista: 'NOKIA NETWORKS COLOMBIA S.A.S.',

    // ACCESO AL SITIO
    requiereLlave: 'SI (Candado Maestro Chapa Seguridad #4)',
    dondeSeRetiraLlave: 'Oficina NOC Central Tigo Guayabal (Vigilancia Piso 2)',
    propietarioSitio: 'Alcaldía de Medellín / Administración Parque Cerro',
    coordenadasSitio: '6.2367° N, -75.5804° W (Elev: 1,560 msnm)',

    fotoSitioUrl: towerPhoto,
    fotoAccesoUrl: towerPhoto,
    observacionesPag1:
      'Acceso vehicular hasta la base de la caseta técnica por vía pavimentada. Se requiere carnet ARL y coordinación previa con el NOC 24 horas antes para el ingreso de personal de cuadrilla e izaje de materiales.',

    // PAGINA 2: RACK/GABINETE
    ubicacionRack: 'RACK 02 - SALA TX',
    ubicacionGabinete: 'GAB-INDOOR-B',
    tipoRack: '19"',
    fotoUbicacionRackUrl: rackPhoto,
    fotoUbicacionEquipoUrl: rackPhoto,

    nombreOdf1: 'ODF-01-TIGO-PRINCIPAL (48 FO)',
    nombreOdf2: 'ODF-02-NOKIA-BACKBONE (24 FO)',
    conectorOdf1Upc: '24 conectores azules LC/UPC',
    conectorOdf1Apc: '24 conectores verdes SC/APC',
    conectorOdf2Upc: '12 conectores LC/UPC',
    conectorOdf2Apc: '12 conectores SC/APC',
    fotoOdf1Url: rackPhoto,
    fotoOdf2Url: rackPhoto,

    // PAGINA 3: PLANTA DE FUERZA Y ATERRIZAJE
    rectificadorA: 'VERTIV NETSURE 721 (48V DC / 600A)',
    rectificadorB: 'ELTEK FLATPACK2 48V (RESPALDO)',
    terminalesEnergiaDobleAgujero: '4 Unidades (Calibre 2 AWG / Ojillo 1/4")',
    terminalesEnergiaUnAgujero: '2 Unidades (Calibre 4 AWG)',
    terminalesEnergiaPunta: '6 Unidades aisladas',

    breakers: [
      {
        id: 'brk-1',
        posicionBrk: 'PF-A Pos. 07-08',
        capacidadBreaker: '63 Amp',
        recorridoCableMts: '14.5 mts',
        calibreCableAwg: '2 AWG (Cu Flex)',
      },
      {
        id: 'brk-2',
        posicionBrk: 'PF-B Pos. 11-12',
        capacidadBreaker: '63 Amp',
        recorridoCableMts: '16.0 mts',
        calibreCableAwg: '2 AWG (Cu Flex)',
      },
      {
        id: 'brk-3',
        posicionBrk: 'PF-A Pos. 15',
        capacidadBreaker: '32 Amp',
        recorridoCableMts: '12.0 mts',
        calibreCableAwg: '6 AWG',
      },
      {
        id: 'brk-4',
        posicionBrk: 'PF-B Pos. 16',
        capacidadBreaker: '32 Amp',
        recorridoCableMts: '12.0 mts',
        calibreCableAwg: '6 AWG',
      },
    ],

    fotoRectificadorAUrl: rectifierPhoto,
    fotoRectificadorBUrl: rectifierPhoto,

    terminalesTierraDobleAgujero: '6 Unidades ponchadas con dados hexagonales',
    terminalesTierraUnAgujero: '2 Unidades',
    calibreCableAterrizajeAwg: '2/0 AWG Verde / Amarillo',
    recorridoCableAterrizajeMts: '8.5 mts hasta MGB principal',
    fotoBarraTierraUrl: groundPhoto,
    observacionesFuerza:
      'Planta de fuerza cuenta con suficiente holgura en los peines DC. El banco de baterías Narada 48V presenta voltaje de flotación de 53.8V DC en estado óptimo. Resistencia de puesta a tierra medida: 2.1 Ohms.',

    // PAGINA 4: PLANO DEL SITIO
    planoSitioUrl: '',
    planoSitioNotas:
      'Distribución de sala técnica de 4.5m x 6.2m. Ubicación de rack Nokia a 1.2m del rectificador principal. Escalerilla portacables de 400mm instalada a 2.40m de altura libre.',

    // PAGINAS 5 & 6: FOTOS DEL SITIO
    fotosSitioPagina5: [
      { id: 'f5-1', titulo: 'PANORAMICA GENERAL DEL SITIO', imageUrl: towerPhoto },
      { id: 'f5-2', titulo: 'ACCESO PRINCIPAL Y REJA PERIMETRAL', imageUrl: towerPhoto },
      { id: 'f5-3', titulo: 'RACK FRONTAL CON ESPACIO 4U LIBRE', imageUrl: rackPhoto },
      { id: 'f5-4', titulo: 'ODF FRONTAL Y PUERTOS DISPONIBLES', imageUrl: rackPhoto },
      { id: 'f5-5', titulo: 'TABLERO RECTIFICADOR PRINCIPAL', imageUrl: rectifierPhoto },
      { id: 'f5-6', titulo: 'BARRA DE TIERRA MGB PRINCIPAL', imageUrl: groundPhoto },
    ],
    fotosSitioPagina6: [
      { id: 'f6-1', titulo: 'ESCALERILLA DE CABLES Y PASAMUROS', imageUrl: rackPhoto },
      { id: 'f6-2', titulo: 'BANCO DE BATERIAS DE RESPALDO', imageUrl: rectifierPhoto },
      { id: 'f6-3', titulo: 'TORRE AUTOSOPORTADA Y FEEDERS', imageUrl: towerPhoto },
      { id: 'f6-4', titulo: 'SISTEMA DE AIRE ACONDICIONADO', imageUrl: towerPhoto },
      { id: 'f6-5', titulo: 'TABLERO DE TRANSFERENCIA AUTOMATICA', imageUrl: rectifierPhoto },
      { id: 'f6-6', titulo: 'ROTULACION GENERAL DE SEGURIDAD', imageUrl: groundPhoto },
    ],
  },
  {
    id: 'survey-tgo-002',
    codigoSitio: 'TGO-BOG-2089',
    estado: 'En Revisión',
    porcentajeCompletado: 85,
    creadoPor: 'Ing. Laura Valenzuela (Telecom Audit)',
    ultimaActualizacion: '2026-03-30 11:20',
    region: 'Cundinamarca - Bogotá Norte',

    nombreSitio: 'BOG-2089 CHICO RESERVADO',
    nombreProyecto: 'EXPANSION 5G COBERTURA URBANA',
    fechaReporte: '2026-03-30',
    tiposEquipos: 'NOKIA AIRSCALE SUB-6GHZ + TX DWDM',
    tipoReporte: 'SITE SURVEY PREVIO A INSTALACION',
    contratista: 'ANDINA DE TELECOMUNICACIONES LTDA',

    requiereLlave: 'SI (Permiso portería edificio corporativo)',
    dondeSeRetiraLlave: 'Recepción Central Carrera 11 # 94-02',
    propietarioSitio: 'Edificio Panamerican Tower / Tigo Colombia',
    coordenadasSitio: '4.6789° N, -74.0482° W (Elev: 2,610 msnm)',

    fotoSitioUrl: towerPhoto,
    fotoAccesoUrl: towerPhoto,
    observacionesPag1:
      'Sitio ubicado en azotea piso 15. Acceso mediante ascensor de servicio hasta piso 14 y escaleras técnicas a caseta. Horario de trabajo sin restricciones previa radicación de planilla de riesgos.',

    ubicacionRack: 'RACK 01 - ZONA TELECOM',
    ubicacionGabinete: 'GAB-OUTDOOR-ROOFTOP',
    tipoRack: '21"',
    fotoUbicacionRackUrl: rackPhoto,
    fotoUbicacionEquipoUrl: rackPhoto,

    nombreOdf1: 'ODF-TX-BOG-01 (72 FO)',
    nombreOdf2: 'ODF-DIST-02 (24 FO)',
    conectorOdf1Upc: '36 puertos LC/UPC',
    conectorOdf1Apc: '36 puertos LC/APC',
    conectorOdf2Upc: '12 puertos LC/UPC',
    conectorOdf2Apc: '12 puertos LC/APC',
    fotoOdf1Url: rackPhoto,
    fotoOdf2Url: rackPhoto,

    rectificadorA: 'DELTA CABIN POWER 48V / 400A',
    rectificadorB: 'SISTEMA DUAL REDUNDANTE DELTA',
    terminalesEnergiaDobleAgujero: '2 Unidades (Calibre 2 AWG)',
    terminalesEnergiaUnAgujero: '4 Unidades',
    terminalesEnergiaPunta: '4 Unidades',

    breakers: [
      {
        id: 'brk-21',
        posicionBrk: 'BRK DC-04',
        capacidadBreaker: '50 Amp',
        recorridoCableMts: '9.0 mts',
        calibreCableAwg: '4 AWG',
      },
      {
        id: 'brk-22',
        posicionBrk: 'BRK DC-05',
        capacidadBreaker: '50 Amp',
        recorridoCableMts: '9.0 mts',
        calibreCableAwg: '4 AWG',
      },
    ],

    fotoRectificadorAUrl: rectifierPhoto,
    fotoRectificadorBUrl: rectifierPhoto,

    terminalesTierraDobleAgujero: '4 Unidades ojillo estándar',
    terminalesTierraUnAgujero: '2 Unidades',
    calibreCableAterrizajeAwg: '1/0 AWG',
    recorridoCableAterrizajeMts: '6.0 mts',
    fotoBarraTierraUrl: groundPhoto,
    observacionesFuerza:
      'Capacidad del rectificador actual al 62%. Se puede adicionar la nueva carga de 5G sin requerir cambio de módulos de potencia.',

    planoSitioUrl: '',
    planoSitioNotas: 'Azotea con membrana impermeabilizante. No perforar losa; utilizar bases de concreto autoportantes para escalerillas.',

    fotosSitioPagina5: [
      { id: 'f5b-1', titulo: 'VISTA AZOTEA Y SOPORTES DE MASTIL', imageUrl: towerPhoto },
      { id: 'f5b-2', titulo: 'CASETA TECNICA EXTERIOR', imageUrl: towerPhoto },
      { id: 'f5b-3', titulo: 'RACK DE EQUIPOS DISTRIBUCION', imageUrl: rackPhoto },
      { id: 'f5b-4', titulo: 'BANDEJA ODF DE FIBRA', imageUrl: rackPhoto },
      { id: 'f5b-5', titulo: 'PANEL RECTIFICADOR DELTA', imageUrl: rectifierPhoto },
      { id: 'f5b-6', titulo: 'BARRAJE EQUIPOTENCIAL DE TIERRA', imageUrl: groundPhoto },
    ],
    fotosSitioPagina6: [
      { id: 'f6b-1', titulo: 'TUBERIA CONDUIT Y CABLEADO AC', imageUrl: rackPhoto },
      { id: 'f6b-2', titulo: 'GRUPO ELECTROGENO DE EMERGENCIA', imageUrl: towerPhoto },
      { id: 'f6b-3', titulo: 'VISTA HACIA EL SECTOR SUR', imageUrl: towerPhoto },
      { id: 'f6b-4', titulo: 'SELLO CORTAFUEGO EN PASAMUROS', imageUrl: groundPhoto },
      { id: 'f6b-5', titulo: 'BANCO DE ACUMULADORES AGM', imageUrl: rectifierPhoto },
      { id: 'f6b-6', titulo: 'PLACA DE IDENTIFICACION DEL SITIO', imageUrl: groundPhoto },
    ],
  },
  {
    id: 'survey-tgo-003',
    codigoSitio: 'TGO-CLO-5118',
    estado: 'Borrador',
    porcentajeCompletado: 50,
    creadoPor: 'Ing. Andres Quintero (Nokia)',
    ultimaActualizacion: '2026-04-01 09:15',
    region: 'Valle del Cauca - Cali Sur',

    nombreSitio: 'CLO-5118 CIUDAD JARDIN MONOPOLO',
    nombreProyecto: 'DESPLIEGUE REFUERZO COBERTURA',
    fechaReporte: '2026-04-01',
    tiposEquipos: 'NOKIA AIRSCALE OUTDOOR + MINI-LINK',
    tipoReporte: 'SITE SURVEY PREVIO',
    contratista: 'INGENIERIA & REDES DE OCCIDENTE',

    requiereLlave: 'NO (Vigilancia 24/7 en garita)',
    dondeSeRetiraLlave: 'No aplica (Acceso libre con cédula y ARL)',
    propietarioSitio: 'Club Campestre Cali / Servidumbre de Paso',
    coordenadasSitio: '3.3641° N, -76.5389° W (Elev: 995 msnm)',

    fotoSitioUrl: towerPhoto,
    fotoAccesoUrl: towerPhoto,
    observacionesPag1:
      'Monopolo de 36 metros con gabinete exterior en base de concreto cercada con concertina.',

    ubicacionRack: 'GABINETE 01 EXTERIOR',
    ubicacionGabinete: 'GABINETE NEMA 4X CLIMATIZADO',
    tipoRack: '19"',
    fotoUbicacionRackUrl: rackPhoto,
    fotoUbicacionEquipoUrl: rackPhoto,

    nombreOdf1: 'ODF MINI-OUTDOOR 12 FO',
    nombreOdf2: 'N/A',
    conectorOdf1Upc: '6 conectores LC/UPC',
    conectorOdf1Apc: '6 conectores SC/APC',
    conectorOdf2Upc: '',
    conectorOdf2Apc: '',
    fotoOdf1Url: rackPhoto,
    fotoOdf2Url: rackPhoto,

    rectificadorA: 'ELTEK MICROPACK 48V DC',
    rectificadorB: 'N/A',
    terminalesEnergiaDobleAgujero: '2 Unidades',
    terminalesEnergiaUnAgujero: '2 Unidades',
    terminalesEnergiaPunta: '2 Unidades',

    breakers: [
      {
        id: 'brk-31',
        posicionBrk: 'BRK-01',
        capacidadBreaker: '40 Amp',
        recorridoCableMts: '3.5 mts',
        calibreCableAwg: '6 AWG',
      },
    ],

    fotoRectificadorAUrl: rectifierPhoto,
    fotoRectificadorBUrl: rectifierPhoto,

    terminalesTierraDobleAgujero: '2 Unidades',
    terminalesTierraUnAgujero: '2 Unidades',
    calibreCableAterrizajeAwg: '2 AWG',
    recorridoCableAterrizajeMts: '2.5 mts',
    fotoBarraTierraUrl: groundPhoto,
    observacionesFuerza: 'Gabinete cuenta con su propio aire acondicionado DC y sensor de temperatura.',

    planoSitioUrl: '',
    planoSitioNotas: 'Perímetro 6x6 metros con cerramiento de malla eslabonada.',

    fotosSitioPagina5: [
      { id: 'f5c-1', titulo: 'BASE DEL MONOPOLO Y GABINETES', imageUrl: towerPhoto },
      { id: 'f5c-2', titulo: 'PORTON DE ACCESO AL CERRAMIENTO', imageUrl: towerPhoto },
      { id: 'f5c-3', titulo: 'DISTRIBUCION INTERIOR GABINETE', imageUrl: rackPhoto },
      { id: 'f5c-4', titulo: 'PASO DE FIBRA OPTICA', imageUrl: rackPhoto },
      { id: 'f5c-5', titulo: 'RECTIFICADOR ELTEK', imageUrl: rectifierPhoto },
      { id: 'f5c-6', titulo: 'BARRA COLECTORA DE TIERRA', imageUrl: groundPhoto },
    ],
    fotosSitioPagina6: [
      { id: 'f6c-1', titulo: 'MONOPOLO COMPLETO 36M', imageUrl: towerPhoto },
      { id: 'f6c-2', titulo: 'MEDIDOR DE ENERGIA COMERCIAL', imageUrl: rectifierPhoto },
      { id: 'f6c-3', titulo: 'PARARRAYOS Y BAJANTE', imageUrl: groundPhoto },
      { id: 'f6c-4', titulo: 'POZO DE PUESTA A TIERRA', imageUrl: groundPhoto },
      { id: 'f6c-5', titulo: 'GABINETE DE BATERIAS', imageUrl: rectifierPhoto },
      { id: 'f6c-6', titulo: 'PANORAMICA HACIA LA VIA PRINCIPAL', imageUrl: towerPhoto },
    ],
  },
];
