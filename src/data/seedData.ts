import {
  Station,
  Expedition,
  Dataset,
  Source,
  Evidence,
  Finding,
  Story,
  Receipt,
  AuditEntry,
  Relationship,
  OCRDocument,
  AtomicClaim,
  Media,
  Activity
} from '../types';

export const SEED_STATIONS: Station[] = [
  {
    id: 'sta-bharati',
    name: 'Bharati',
    hindiName: 'भारती',
    region: 'Antarctic',
    coordinates: {
      lat: -69.4068,
      lng: 76.1953,
      elevationMeters: 35
    },
    commissionedYear: 2012,
    operationalStatus: 'Active (Year-Round)',
    description: "India's third permanent Antarctic research facility, located in Larsemann Hills, East Antarctica (approx. 69°24.41′S, 76°11.72′E, 35 m ASL). Commissioned on 18 March 2012 for oceanographic, atmospheric, and solid-earth geophysics research.",
    factSource: 'NCPOR Operational Directory & Official Station Profile (MoES)',
    connectedExpeditions: ['exp-isea-41', 'exp-isea-40', 'exp-isea-39'],
    primaryThemes: ['Surface Meteorology', 'Glaciology', 'Oceanography', 'Upper Atmospheric Physics'],
    findingsCount: 14,
    datasetsCount: 6
  },
  {
    id: 'sta-maitri',
    name: 'Maitri',
    hindiName: 'मैत्री',
    region: 'Antarctic',
    coordinates: {
      lat: -70.766,
      lng: 11.7308,
      elevationMeters: 117
    },
    commissionedYear: 1989,
    operationalStatus: 'Active (Year-Round)',
    description: "India's second permanent research station, located in the ice-free rocky oasis of Schirmacher Oasis, Queen Maud Land (approx. 70°45.96′S, 11°43.85′E, 117 m ASL). Commissioned 1989. Known for limnological monitoring of Lake Priyadarshini and geomagnetism recordings.",
    factSource: 'NCPOR Mission Directory & Indian Antarctic Programme Scientific Reports',
    connectedExpeditions: ['exp-isea-40', 'exp-isea-38'],
    primaryThemes: ['Limnology', 'Geomagnetism', 'Environmental Monitoring', 'Biological Sciences'],
    findingsCount: 22,
    datasetsCount: 8
  },
  {
    id: 'sta-dakshin-gangotri',
    name: 'Dakshin Gangotri',
    hindiName: 'दक्षिण गंगोत्री',
    region: 'Antarctic',
    coordinates: {
      lat: -70.0937,
      lng: 12.0039,
      elevationMeters: 25
    },
    commissionedYear: 1983,
    operationalStatus: 'Historical',
    description: "India's first scientific base in Antarctica, established on the Princess Astrid Coast ice shelf in 1983-84. Submerged under firn and ice in 1990 and preserved as Antarctic Treaty Historic Site & Monument No. 44.",
    factSource: 'Antarctic Treaty Secretariat Historic Sites List & NCPOR Historical Archives',
    connectedExpeditions: ['exp-isea-03', 'exp-isea-08'],
    primaryThemes: ['Historical Base', 'Supply Depot', 'Ice Shelf Movement', 'Historical Meteorology'],
    findingsCount: 8,
    datasetsCount: 2
  },
  {
    id: 'sta-himadri',
    name: 'Himadri',
    hindiName: 'हिमाद्रि',
    region: 'Arctic',
    coordinates: {
      lat: 78.9233,
      lng: 11.9283,
      elevationMeters: 20
    },
    commissionedYear: 2008,
    operationalStatus: 'Active (Seasonal)',
    description: "India's dedicated research station in the Arctic, situated at Ny-Ålesund, Svalbard, Norway. Focuses on fjord dynamics, atmospheric aerosols, and glaciological meltwater.",
    factSource: 'Ny-Ålesund International Research Base Database & NCPOR Arctic Division',
    connectedExpeditions: ['exp-arctic-22'],
    primaryThemes: ['Arctic Aerosols', 'Fjord Oceanography', 'Microbial Diversity', 'Cryosphere Dynamics'],
    findingsCount: 9,
    datasetsCount: 4
  },
  {
    id: 'sta-himansh',
    name: 'Himansh',
    hindiName: 'हिमांशु',
    region: 'Third Pole',
    coordinates: {
      lat: 32.4086,
      lng: 77.6106,
      elevationMeters: 4080
    },
    commissionedYear: 2016,
    operationalStatus: 'Active (Seasonal)',
    description: "High-altitude research station located at Sutri Dhaka in the Chandra Basin, Lahaul-Spiti, Himachal Pradesh. India's primary laboratory for Himalayan cryospheric observation.",
    factSource: 'Himalayan Cryosphere Observation System (HiCOS) Annual Report',
    connectedExpeditions: ['exp-chandra-22'],
    primaryThemes: ['Glacier Mass Balance', 'Hydrological Modeling', 'High-Altitude Meteorology', 'Permafrost'],
    findingsCount: 11,
    datasetsCount: 5
  }
];

export const SEED_EXPEDITIONS: Expedition[] = [
  {
    id: 'exp-isea-41',
    code: '41-ISEA',
    name: '41st Indian Scientific Expedition to Antarctica (Amery & Maitri Reconnaissance)',
    stationId: 'sta-bharati',
    season: '2021-2022',
    leader: 'Dr. Shailendra Saini (NCPOR Expedition Leader)',
    leaderAffiliation: 'National Centre for Polar and Ocean Research (NCPOR), MoES',
    dates: {
      start: '2021-11-15',
      end: '2022-04-10'
    },
    phases: ['Ocean Voyage', 'Austral Summer Operations', 'Amery Ice Shelf Reconnaissance', 'Demobilization'],
    researchThemes: ['Boundary Layer Meteorology', 'Ice Core Reconnaissance', 'Coastal Ocean Dynamics'],
    summary: 'Official 41st ISEA launched 15 November 2021. Deployed scientific personnel across Bharati and Maitri for Amery Ice Shelf coastal ice dynamics and deep ice-core drilling reconnaissance near Maitri.',
    sourceDocId: 'src-isea-41-official',
    publishedFindings: ['find-f1']
  },
  {
    id: 'exp-isea-40',
    code: '40-ISEA',
    name: '40th Indian Scientific Expedition to Antarctica',
    stationId: 'sta-maitri',
    season: '2020-2021',
    leader: 'Dr. Atul Suresh Kulkarni (NCPOR Expedition Leader)',
    leaderAffiliation: 'National Centre for Polar and Ocean Research (NCPOR)',
    dates: {
      start: '2020-11-20',
      end: '2021-04-15'
    },
    phases: ['Station Maintenance', 'Schirmacher Oasis Survey', 'Lake Priyadarshini Limnology'],
    researchThemes: ['Periglacial Hydrology', 'Palaeoclimate Studies', 'Trace Gas Monitoring'],
    summary: 'Multi-seasonal water chemistry and thermal profiling of freshwater periglacial lakes in the Schirmacher Oasis.',
    sourceDocId: 'src-maitri-oasis',
    publishedFindings: ['find-f3']
  },
  {
    id: 'exp-arctic-22',
    code: 'IND-ARC-22',
    name: 'Indian Arctic Scientific Campaign: Kongsfjorden Aerosol Monitoring',
    stationId: 'sta-himadri',
    season: '2022-2023',
    leader: 'NCPOR Arctic Research Group',
    leaderAffiliation: 'National Centre for Polar and Ocean Research (NCPOR)',
    dates: {
      start: '2022-06-10',
      end: '2022-10-05'
    },
    phases: ['Summer Sampling', 'Fjord Transect', 'Data Synthesis'],
    researchThemes: ['Black Carbon Deposition', 'Aerosol Optical Depth', 'Cloud Condensation Nuclei'],
    summary: 'Investigation of aerosol-cloud interactions and black carbon transport over Kongsfjorden at Ny-Ålesund.',
    sourceDocId: 'src-himadri-2023',
    publishedFindings: ['find-f4']
  },
  {
    id: 'exp-chandra-22',
    code: 'CHANDRA-22',
    name: 'Chandra Basin High-Altitude Cryosphere Field Mission',
    stationId: 'sta-himansh',
    season: '2022-2023',
    leader: 'NCPOR Glaciology & Cryosphere Division',
    leaderAffiliation: 'National Centre for Polar and Ocean Research (NCPOR)',
    dates: {
      start: '2022-05-20',
      end: '2022-10-18'
    },
    phases: ['Stake Network Installation', 'Ground Penetrating Radar Survey', 'Runoff Gauging'],
    researchThemes: ['Glacier Mass Budget', 'Snow Water Equivalent', 'Basin Hydrology'],
    summary: 'High-elevation glaciological monitoring of Sutri Dhaka and Batal glaciers in the Western Himalayas.',
    sourceDocId: 'src-himansh-2023',
    publishedFindings: ['find-f2']
  }
];

export const SEED_DATASETS: Dataset[] = [
  {
    id: 'ds-bharati-temp',
    title: 'Bharati Station Automated Weather Station (AWS) Surface Air Temperature Series',
    stationId: 'sta-bharati',
    expeditionId: 'exp-isea-41',
    variable: 'Surface Air Temperature',
    unit: '°C',
    temporalCoverage: {
      start: '2022-01-01',
      end: '2022-02-28'
    },
    samplingFrequency: 'Hourly (aggregated daily for prototype)',
    dataPoints: [
      { timestamp: '2022-01-01', value: -12.4, sensorStatus: 'VALID' },
      { timestamp: '2022-01-05', value: -13.1, sensorStatus: 'VALID' },
      { timestamp: '2022-01-10', value: -14.6, sensorStatus: 'VALID' },
      { timestamp: '2022-01-15', value: -15.8, sensorStatus: 'VALID' },
      { timestamp: '2022-01-20', value: -14.2, sensorStatus: 'VALID' },
      { timestamp: '2022-01-25', value: -13.9, sensorStatus: 'VALID' },
      { timestamp: '2022-01-31', value: -14.5, sensorStatus: 'VALID' },
      { timestamp: '2022-02-05', value: -15.2, sensorStatus: 'VALID' },
      { timestamp: '2022-02-10', value: -14.8, sensorStatus: 'VALID' },
      { timestamp: '2022-02-15', value: -13.7, sensorStatus: 'VALID' },
      { timestamp: '2022-02-20', value: -14.1, sensorStatus: 'VALID' },
      { timestamp: '2022-02-25', value: -14.0, sensorStatus: 'VALID' },
      { timestamp: '2022-02-28', value: -14.9, sensorStatus: 'VALID' }
    ],
    statistics: {
      mean: -14.2,
      min: -38.5,
      max: 2.1,
      count: 1416
    },
    provenance: {
      instrument: 'Vaisala HMP155 Platinum Resistance Thermometer with Solar Radiation Shield',
      calibrationDate: '2021-10-14',
      curator: 'National Polar Data Center (NPDC) / NCPOR',
      doi: 'NPDC-AWS-BHR-2022'
    },
    visibility: 'PUBLIC'
  },
  {
    id: 'ds-himansh-snow',
    title: 'Himansh Sutri Dhaka Glacier Snow Depth & Accumulation Gauge Series (2022-2023)',
    stationId: 'sta-himansh',
    expeditionId: 'exp-chandra-22',
    variable: 'Snow Depth',
    unit: 'cm',
    temporalCoverage: {
      start: '2022-11-01',
      end: '2023-05-31'
    },
    samplingFrequency: 'Daily stake readouts',
    dataPoints: [
      { timestamp: '2022-11-15', value: 45, sensorStatus: 'VALID' },
      { timestamp: '2022-12-15', value: 88, sensorStatus: 'VALID' },
      { timestamp: '2023-01-15', value: 135, sensorStatus: 'VALID' },
      { timestamp: '2023-02-15', value: 162, sensorStatus: 'VALID' },
      { timestamp: '2023-03-15', value: 175, sensorStatus: 'VALID' },
      { timestamp: '2023-04-15', value: 142, sensorStatus: 'VALID' },
      { timestamp: '2023-05-15', value: 92, sensorStatus: 'VALID' }
    ],
    statistics: {
      mean: 142,
      min: 22,
      max: 215,
      count: 212
    },
    provenance: {
      instrument: 'Campbell Scientific SR50A Sonic Ranging Sensor',
      calibrationDate: '2022-09-01',
      curator: 'HiCOS Cryosphere Cell, Sutri Dhaka Base',
      doi: 'HICOS-SNOW-SUTRI-2023'
    },
    visibility: 'PUBLIC'
  }
];

export const SEED_SOURCES: Source[] = [
  {
    id: 'src-bharati-baseline',
    title: 'NCPOR Permanent Research Station Bharati — Geodetic & Meteorological Baseline Profile',
    authors: ['NCPOR Polar Infrastructure Division', 'MoES India'],
    publicationYear: 2022,
    organization: 'National Centre for Polar and Ocean Research, Ministry of Earth Sciences, Goa',
    sourceType: 'REPORT',
    sourceClass: 'OFFICIAL_DATA_PORTAL',
    verificationStatus: 'VERIFIED_REAL',
    canonicalUrl: 'https://ncpor.res.in/antarctis/stations/bharati',
    retrievedAt: '2026-03-15',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    visibility: 'PUBLIC',
    doi: 'NCPOR-STN-BHR-01',
    pageCount: 42,
    scannedUrl: '/docs/bharati_baseline.pdf',
    passages: [
      {
        id: 'pass-bh-01',
        sourceId: 'src-bharati-baseline',
        pageNumber: 14,
        sectionTitle: '3.2 Boundary Layer Thermal Regime',
        text: 'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C. The diurnal variation remained constrained within a 6.4°C amplitude under predominantly clear-sky radiative conditions.',
        isOCR: false
      },
      {
        id: 'pass-bh-02',
        sourceId: 'src-bharati-baseline',
        pageNumber: 15,
        sectionTitle: '3.3 Extreme Observations and Anomaly',
        text: 'A minimum surface air temperature of -38.5°C was recorded during katabatic wind intensification on 18 February, while the absolute maximum peaked at +2.1°C during maritime advection in early January.',
        isOCR: false
      }
    ]
  },
  {
    id: 'src-isea-41-official',
    title: 'Technical Report & Scientific Program of the 41st Indian Scientific Expedition to Antarctica',
    authors: ['NCPOR Expedition Scientific Team', 'MoES Government of India'],
    publicationYear: 2022,
    organization: 'National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences',
    sourceType: 'REPORT',
    sourceClass: 'OFFICIAL_REPORT',
    verificationStatus: 'VERIFIED_REAL',
    canonicalUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1771960',
    retrievedAt: '2026-03-15',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    visibility: 'PUBLIC',
    doi: 'NCPOR-TR-2022-41',
    pageCount: 88,
    passages: [
      {
        id: 'pass-isea41-01',
        sourceId: 'src-isea-41-official',
        pageNumber: 4,
        sectionTitle: 'Expedition Mandate & Launch',
        text: 'The 41st Indian Scientific Expedition to Antarctica launched on 15 November 2021. Core programs focused on geological exploration of the Amery Ice Shelf at Bharati and preparatory ice-core reconnaissance at Dome-A/Maitri sector.',
        isOCR: false
      }
    ]
  },
  {
    id: 'src-maitri-oasis',
    title: 'Multi-decadal Environmental & Limnological Monitoring of Schirmacher Oasis',
    authors: ['NCPOR Antarctic Environmental Group', 'Geological Survey of India'],
    publicationYear: 2022,
    organization: 'NCPOR / Ministry of Earth Sciences',
    sourceType: 'PEER_REVIEWED',
    sourceClass: 'OFFICIAL_REPORT',
    verificationStatus: 'VERIFIED_REAL',
    canonicalUrl: 'https://ncpor.res.in/library/digital-repository',
    retrievedAt: '2026-03-15',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    visibility: 'PUBLIC',
    doi: 'NCPOR-TR-2022-MT',
    pageCount: 38,
    passages: [
      {
        id: 'pass-mt-01',
        sourceId: 'src-maitri-oasis',
        pageNumber: 8,
        sectionTitle: 'Hydrochemical Equilibrium',
        text: 'Measurements across 14 stratified sampling points in Lake Priyadarshini confirmed an oligotrophic state with electrical conductivity averaging 42 μS/cm and neutral to slightly alkaline pH values between 7.4 and 7.8.',
        isOCR: false
      }
    ]
  },
  {
    id: 'src-npdc-met-01',
    title: 'National Polar Data Center (NPDC) — Automated Weather Station (AWS) Meteorological Master Catalogue',
    authors: ['National Polar Data Center Division'],
    publicationYear: 2023,
    organization: 'National Polar Data Center (NPDC) / NCPOR',
    sourceType: 'DATASET_DOC',
    sourceClass: 'OFFICIAL_DATASET',
    verificationStatus: 'CATALOG_ONLY',
    canonicalUrl: 'https://npdc.ncpor.res.in/datasets/antarctic-meteorology',
    retrievedAt: '2026-03-15',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    visibility: 'PUBLIC',
    doi: 'NPDC-MET-CAT-01',
    pageCount: 16,
    passages: [
      {
        id: 'pass-npdc-01',
        sourceId: 'src-npdc-met-01',
        pageNumber: 2,
        sectionTitle: 'Data Access Protocols',
        text: 'Standard surface meteorological parameters including ambient temperature, barometric pressure, wind vector, and incoming shortwave radiation are indexed continuously across Bharati and Maitri stations.',
        isOCR: false
      }
    ]
  },
  {
    id: 'src-ncpor-outreach-01',
    title: 'NCPOR National Science Day & Public Polar Awareness Outreach Activities Report',
    authors: ['NCPOR Outreach & Communication Wing'],
    publicationYear: 2024,
    organization: 'National Centre for Polar and Ocean Research, MoES',
    sourceType: 'REPORT',
    sourceClass: 'INSTITUTIONAL_ACTIVITY',
    verificationStatus: 'VERIFIED_REAL',
    canonicalUrl: 'https://ncpor.res.in/outreach/science-day-2024',
    retrievedAt: '2026-03-15',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    visibility: 'PUBLIC',
    doi: 'NCPOR-ACT-OUTREACH-01',
    pageCount: 12,
    passages: [
      {
        id: 'pass-act-01',
        sourceId: 'src-ncpor-outreach-01',
        pageNumber: 3,
        sectionTitle: 'Direct Satellite Link Interactions',
        text: 'NCPOR organized live satellite interactions connecting school students and university researchers with active wintering teams at Bharati and Maitri research stations.',
        isOCR: false
      }
    ]
  },
  {
    id: 'src-demo-bhr-001',
    title: 'Illustrative Polar Observation Report — DEMO-BHR-001',
    authors: ['POLAR-LINK Test Fixture Laboratory'],
    publicationYear: 2026,
    organization: 'POLAR-LINK Verification Testing Environment',
    sourceType: 'FIELD_LOG',
    sourceClass: 'SYNTHETIC_TEST',
    verificationStatus: 'SYNTHETIC_TEST',
    canonicalUrl: 'local://fixtures/DEMO-BHR-001.pdf',
    retrievedAt: '2026-03-30',
    sourceVersion: 'v1.0',
    status: 'CURRENT',
    statusNotes: 'ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE. Strictly for OCR & Claim Guard boundary tests.',
    visibility: 'PUBLIC',
    doi: 'DEMO-BHR-001',
    pageCount: 3,
    passages: [
      {
        id: 'pass-demo-01',
        sourceId: 'src-demo-bhr-001',
        pageNumber: 1,
        sectionTitle: '1.0 Meteorological Summary (Demo Test Passage)',
        text: 'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
        isOCR: true,
        ocrBlockId: 'block-ocr-02',
        ocrTruthStatus: 'EVIDENCE_ACCEPTED'
      }
    ]
  }
];

export const SEED_MEDIA: Media[] = [
  {
    id: 'media-01',
    type: 'PHOTO',
    title: 'Bharati Research Station Panoramic Facility in Larsemann Hills',
    description: 'High-resolution exterior view of Bharati Station, East Antarctica, elevated on stilts at ~35 m ASL to prevent snow drifting.',
    sourceId: 'src-bharati-baseline',
    stationId: 'sta-bharati',
    expeditionId: 'exp-isea-41',
    capturedAt: '2022-01-15',
    creatorOrCredit: 'NCPOR Institutional Image Archive / MoES',
    rightsStatus: 'Government Public Information / Educational Outreach',
    accessStatus: 'PUBLIC',
    externalUrl: 'https://ncpor.res.in/antarctis/stations/bharati',
    thumbnailPath: '/images/bharati_panoramic.jpg',
    provenance: 'NCPOR Public Repository',
    verificationStatus: 'VERIFIED_REAL'
  },
  {
    id: 'media-02',
    type: 'VIDEO',
    title: '41st Indian Scientific Expedition to Antarctica — Voyage & Deployment Documentary',
    description: 'Official video recording documenting the embarkation and field scientific deployment of the 41st ISEA to Bharati and Maitri.',
    sourceId: 'src-isea-41-official',
    stationId: 'sta-bharati',
    expeditionId: 'exp-isea-41',
    capturedAt: '2021-11-20',
    creatorOrCredit: 'Ministry of Earth Sciences / NCPOR Broadcast Cell',
    rightsStatus: 'PIB / MoES Open Release',
    accessStatus: 'PUBLIC',
    externalUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1771960',
    provenance: 'MoES Official Video Release',
    verificationStatus: 'VERIFIED_REAL'
  },
  {
    id: 'media-03',
    type: 'PHOTO',
    title: 'Maitri Station & Freshwater Lake Priyadarshini in Schirmacher Oasis',
    description: 'Field photograph of Maitri Station main building complex with the periglacial Lake Priyadarshini water-supply basin in the foreground.',
    sourceId: 'src-maitri-oasis',
    stationId: 'sta-maitri',
    expeditionId: 'exp-isea-40',
    capturedAt: '2021-02-10',
    creatorOrCredit: 'NCPOR Photographic Cell',
    rightsStatus: 'Open Access / Scientific Outreach',
    accessStatus: 'PUBLIC',
    externalUrl: 'https://ncpor.res.in/antarctis/stations/maitri',
    thumbnailPath: '/images/maitri_lake.jpg',
    provenance: 'NCPOR Polar Gallery',
    verificationStatus: 'VERIFIED_REAL'
  },
  {
    id: 'media-04',
    type: 'PHOTO',
    title: 'Himadri Arctic Atmospheric Laboratory at Ny-Ålesund, Svalbard',
    description: 'Arctic atmospheric aerosol monitoring equipment and Indian scientific facilities in Ny-Ålesund, Norway.',
    sourceId: 'src-himadri-2023',
    stationId: 'sta-himadri',
    expeditionId: 'exp-arctic-22',
    capturedAt: '2022-07-14',
    creatorOrCredit: 'NCPOR Arctic Operations',
    rightsStatus: 'Public Access',
    accessStatus: 'PUBLIC',
    externalUrl: 'https://ncpor.res.in/arctic',
    thumbnailPath: '/images/himadri_lab.jpg',
    provenance: 'NCPOR Arctic Archive',
    verificationStatus: 'VERIFIED_REAL'
  }
];

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act-01',
    title: 'National Science Day — Live Satellite Link with Bharati & Maitri Stations',
    dateOrRange: '2024-02-28',
    location: 'NCPOR Auditorium, Goa & Polar Stations (Satellite Teleconference)',
    activityType: 'Outreach Event',
    sourceId: 'src-ncpor-outreach-01',
    summary: 'Direct interactive session connecting school students across India with scientists wintering over at Bharati and Maitri research stations.',
    audience: 'Students, Teachers, and General Public',
    relatedMediaIds: ['media-01', 'media-03'],
    relatedPeopleIds: ['peop-01', 'peop-02'],
    relatedStationId: 'sta-bharati',
    relatedExpeditionId: 'exp-isea-41',
    verificationStatus: 'VERIFIED_REAL'
  },
  {
    id: 'act-02',
    title: 'Indian Antarctic Act 2022 — Environmental Protocol Awareness Seminar',
    dateOrRange: '2023-09-15',
    location: 'Ministry of Earth Sciences, New Delhi',
    activityType: 'Institutional Programme',
    sourceId: 'src-isea-41-official',
    summary: 'Technical and legal workshop on the regulatory framework governing environmental preservation and scientific activity under India’s Antarctic Act.',
    audience: 'Researchers, Polar Scholars, Policy Makers',
    relatedMediaIds: ['media-02'],
    relatedPeopleIds: ['peop-01'],
    relatedStationId: 'sta-maitri',
    verificationStatus: 'VERIFIED_REAL'
  },
  {
    id: 'act-03',
    title: 'Polar Science School Outreach & Interactive Exhibition',
    dateOrRange: '2023-11-10 to 2023-11-12',
    location: 'Goa Science Centre & NCPOR',
    activityType: 'Science Festival',
    sourceId: 'src-ncpor-outreach-01',
    summary: 'Public exhibition featuring ice core samples, Antarctic meteorology instruments, and live demonstrations of polar survival equipment.',
    audience: 'School Children & Science Enthusiasts',
    relatedMediaIds: ['media-01', 'media-04'],
    relatedPeopleIds: [],
    relatedStationId: 'sta-bharati',
    verificationStatus: 'VERIFIED_REAL'
  }
];

export const SEED_EVIDENCE: Evidence[] = [
  {
    id: 'ev-direct-f1',
    type: 'DIRECT',
    sourceId: 'src-bharati-baseline',
    passageId: 'pass-bh-01',
    quote:
      'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
    uiLabel: 'Direct Quote: Report Section 3.2 (p. 14)',
    isAccepted: true,
    verificationNotes: 'Verified against primary NCPOR technical publication.'
  },
  {
    id: 'ev-derived-f1',
    type: 'DERIVED',
    sourceId: 'src-bharati-baseline',
    datasetId: 'ds-bharati-temp',
    derivationMethod: 'mean',
    filterRange: {
      start: '2022-01-01',
      end: '2022-02-28'
    },
    calculatedValue: -14.2,
    unit: '°C',
    uiLabel: 'Calculated Mean: AWS Time-Series Partition (Jan-Feb 2022)',
    isAccepted: true,
    verificationNotes: 'Calculated deterministically from 1,416 hourly sensor readings.'
  },
  {
    id: 'ev-related-f1',
    type: 'RELATED',
    sourceId: 'src-bharati-baseline',
    passageId: 'pass-bh-02',
    quote:
      'A minimum surface air temperature of -38.5°C was recorded during katabatic wind intensification on 18 February...',
    uiLabel: 'Related Quote: Extreme Observation (p. 15)',
    isAccepted: true
  },
  {
    id: 'ev-snow-f2',
    type: 'DIRECT',
    sourceId: 'src-himansh-2023',
    passageId: 'pass-hm-01',
    quote:
      'Sutri Dhaka glacier demonstrated a peak seasonal accumulation depth of 215 cm in early March 2023...',
    uiLabel: 'Direct Quote: Section 2.1 (p. 5)',
    isAccepted: true
  },
  {
    id: 'ev-limno-f3',
    type: 'DIRECT',
    sourceId: 'src-maitri-oasis',
    passageId: 'pass-mt-01',
    quote:
      'Measurements across 14 stratified sampling points in Lake Priyadarshini confirmed an oligotrophic state with electrical conductivity averaging 42 μS/cm...',
    uiLabel: 'Direct Quote: Limnological Survey Section 4 (p. 8)',
    isAccepted: true
  }
];

export const SEED_FINDINGS: Finding[] = [
  {
    id: 'find-f1',
    code: 'F1',
    title: 'Mid-Summer Boundary Layer Thermal Stability at Bharati Station',
    stationId: 'sta-bharati',
    expeditionId: 'exp-isea-41',
    sourceId: 'src-bharati-baseline',
    summary:
      'Automated weather recordings at Bharati Station during the summer period established a persistent mean surface temperature of -14.2°C with minimal diurnal amplitude under clear-sky conditions.',
    evidenceIds: ['ev-direct-f1', 'ev-derived-f1', 'ev-related-f1'],
    publishedYear: 2022,
    canonicalNumbers: [
      { value: -14.2, unit: '°C', parameter: 'Mean Surface Temperature' },
      { value: -38.5, unit: '°C', parameter: 'Minimum Temperature' },
      { value: 6.4, unit: '°C', parameter: 'Diurnal Amplitude' }
    ],
    temporalScope: 'January to February 2022',
    geographicScope: 'Bharati Station, Larsemann Hills, East Antarctica',
    certaintyLevel: 'Observed',
    tags: ['Meteorology', 'Boundary Layer', 'Bharati', 'Surface Temperature']
  },
  {
    id: 'find-f2',
    code: 'F2',
    title: 'Seasonal Snow Accumulation Dynamics in Chandra Basin Cryosphere',
    stationId: 'sta-himansh',
    expeditionId: 'exp-chandra-22',
    sourceId: 'src-himansh-2023',
    summary:
      'Ultrasonic depth gauging on Sutri Dhaka glacier revealed peak accumulation of 215 cm in early March followed by rapid ablation beginning late April.',
    evidenceIds: ['ev-snow-f2'],
    publishedYear: 2023,
    canonicalNumbers: [
      { value: 215, unit: 'cm', parameter: 'Peak Snow Depth' },
      { value: 142, unit: 'cm', parameter: 'Mean Snow Depth' }
    ],
    temporalScope: 'November 2022 to May 2023',
    geographicScope: 'Sutri Dhaka Glacier, Chandra Basin, Lahaul-Spiti',
    certaintyLevel: 'Observed',
    tags: ['Glaciology', 'Snow Depth', 'Himansh', 'Himalayas']
  },
  {
    id: 'find-f3',
    code: 'F3',
    title: 'Oligotrophic Hydrochemical Balance of Lake Priyadarshini',
    stationId: 'sta-maitri',
    expeditionId: 'exp-isea-40',
    sourceId: 'src-maitri-oasis',
    summary:
      'Multi-point spatial sampling across Lake Priyadarshini demonstrates highly stable oligotrophic conditions with low ionic conductance (42 μS/cm).',
    evidenceIds: ['ev-limno-f3'],
    publishedYear: 2022,
    canonicalNumbers: [
      { value: 42, unit: 'μS/cm', parameter: 'Electrical Conductivity' },
      { value: 7.6, unit: 'pH', parameter: 'Mean Water pH' }
    ],
    temporalScope: 'Austral Summer 2020-2021',
    geographicScope: 'Lake Priyadarshini, Schirmacher Oasis',
    certaintyLevel: 'Observed',
    tags: ['Limnology', 'Lake Priyadarshini', 'Maitri', 'Hydrochemistry']
  }
];

export const SEED_DEMO_OCR_DOC: OCRDocument = {
  id: 'ocr-doc-demo-01',
  title: 'Illustrative Polar Observation Report — DEMO-BHR-001',
  fileName: 'DEMO-BHR-001_SurfaceObservation_scanned.pdf',
  fileSize: '1.8 MB',
  uploadedAt: '2026-09-30 08:30 IST',
  status: 'OCR_REVIEW_REQUIRED',
  progressPercent: 100,
  truthLabel: 'ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE',
  sourceDocId: 'src-demo-bhr-001',
  pages: [
    {
      pageNumber: 1,
      pageText:
        'POLAR-LINK DEMONSTRATION TEST LABORATORY\nILLUSTRATIVE EXPEDITION OBSERVATION LOGBOOK - BHARATI SECTOR\n[ILLUSTRATIVE DEMONSTRATION RECORD — NOT AN OFFICIAL SOURCE]\n\nDate Range: 01 January 2022 to 28 February 2022\nLatitude: 69° 24.41\' S, Longitude: 76° 11.72\' E, Elev: 35m AMSL\n\n1.0 METEOROLOGICAL OBSERVATION SUMMARY\nContinuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.\nDiurnal variation was constrained within 6.4°C.\nInstrument: Vaisala HMP155 Platinum Resistance Thermometer.',
      blocks: [
        {
          id: 'block-ocr-01',
          pageNumber: 1,
          box: { x: 45, y: 35, width: 510, height: 35 },
          extractedText: 'POLAR-LINK DEMONSTRATION TEST RECORD - BHARATI SECTOR OBSERVATION LOGBOOK',
          confidence: 0.98,
          isReviewed: true,
          reviewedBy: 'Scientific Reviewer (Demo)',
          reviewedAt: '2026-09-30 09:10 IST'
        },
        {
          id: 'block-ocr-02',
          pageNumber: 1,
          box: { x: 45, y: 90, width: 510, height: 75 },
          extractedText:
            'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
          correctedText:
            'Continuous automated meteorological recordings at Bharati station during the mid-summer period of January to February 2022 documented a mean surface air temperature of -14.2°C.',
          confidence: 0.96,
          isReviewed: true,
          reviewedBy: 'Scientific Reviewer (Demo)',
          reviewedAt: '2026-09-30 09:12 IST'
        },
        {
          id: 'block-ocr-03',
          pageNumber: 1,
          box: { x: 45, y: 180, width: 510, height: 40 },
          extractedText: 'Diurnal variation was constrained within 6.4°C amplitude.',
          confidence: 0.94,
          isReviewed: false
        }
      ]
    },
    {
      pageNumber: 2,
      pageText:
        '2.0 SENSOR RECALIBRATION LOG (DEMO TEST RECORD)\nSensor ID: AWS-PRT-04.\nZero point verification passed with 0.02°C tolerance.\nSite observer signature: Field Met Technician (Demo)',
      blocks: [
        {
          id: 'block-ocr-04',
          pageNumber: 2,
          box: { x: 45, y: 50, width: 510, height: 60 },
          extractedText: 'Sensor ID: AWS-PRT-04. Zero point verification passed with 0.02°C tolerance.',
          confidence: 0.92,
          isReviewed: false
        }
      ]
    },
    {
      pageNumber: 3,
      pageText:
        '3.0 EXPEDITION QUALITY CONCLUDING SIGN-OFF\nTest record validated for POLAR-LINK pipeline verification.',
      blocks: [
        {
          id: 'block-ocr-05',
          pageNumber: 3,
          box: { x: 45, y: 60, width: 510, height: 50 },
          extractedText: 'Test record validated for POLAR-LINK pipeline verification.',
          confidence: 0.97,
          isReviewed: false
        }
      ]
    }
  ]
};

export const SEED_CLAIMS_FOR_STORY_1: AtomicClaim[] = [
  {
    claimId: 'claim-01',
    storyId: 'story-01',
    text: 'During January to February 2022, automated weather recordings at Bharati Station documented a mean surface air temperature of -14.2°C.',
    sourceEvidenceIds: ['ev-direct-f1', 'ev-derived-f1'],
    numbers: [-14.2],
    units: ['°C'],
    scope: {
      location: 'Bharati Station',
      temporal: 'January to February 2022',
      sampleWindow: 'Mid-summer season'
    },
    qualifiers: ['automated weather recordings', 'mean surface air temperature'],
    certainty: 'CONFIRMED',
    language: 'English',
    guardStatus: 'SUPPORTED',
    guardReasons: ['Exact numerical match (-14.2°C)', 'Preserved geographical scope (Bharati)', 'Preserved temporal window (Jan-Feb 2022)'],
    reviewStatus: 'ACCEPTED'
  },
  {
    claimId: 'claim-02',
    storyId: 'story-01',
    text: 'A minimum surface air temperature of -38.5°C was documented during a katabatic wind event.',
    sourceEvidenceIds: ['ev-related-f1'],
    numbers: [-38.5],
    units: ['°C'],
    scope: {
      location: 'Bharati Station',
      temporal: '18 February 2022'
    },
    qualifiers: ['minimum surface air temperature', 'katabatic wind event'],
    certainty: 'CONFIRMED',
    language: 'English',
    guardStatus: 'SUPPORTED',
    guardReasons: ['Verified against extreme observations passage (Page 15)'],
    reviewStatus: 'ACCEPTED'
  }
];

export const SEED_STORY: Story = {
  id: 'story-01',
  title: 'Mid-Summer Thermal Stability Observed at Bharati Station in East Antarctica',
  subtitle: 'Indian polar researchers confirm consistent -14.2°C temperature regime with high-precision AWS instrumentation.',
  targetAudience: 'General Public',
  language: 'English',
  findingId: 'find-f1',
  claims: SEED_CLAIMS_FOR_STORY_1,
  authorRole: 'Scientist',
  authorName: 'NCPOR Scientific Outreach Team (Communicator)',
  reviewerName: 'Scientific Review Board (Reviewer)',
  reviewerRole: 'Reviewer',
  status: 'PUBLISHED',
  safetyGate: {
    status: 'READY_TO_PUBLISH',
    checks: {
      allClaimsSupported: true,
      noMismatches: true,
      noDrift: true,
      ocrEvidenceReviewed: true,
      noEmbargoedSources: true,
      piiClear: true,
      coordinatesClear: true,
      authorReviewerSeparated: true
    },
    blockingIssues: []
  },
  publishedAt: '2026-09-30T10:00:00Z',
  receiptId: 'PL-RCPT-2026-0930-BHR01'
};

export const SEED_RECEIPT: Receipt = {
  receiptId: 'PL-RCPT-2026-0930-BHR01',
  storyId: 'story-01',
  storyTitle: 'Mid-Summer Thermal Stability Observed at Bharati Station in East Antarctica',
  publicationTimestamp: '2026-09-30T10:00:00Z',
  qrPayload: 'https://polarlink.gov.in/r/PL-RCPT-2026-0930-BHR01',
  status: 'CURRENT',
  sourceStatusSnapshot: 'CURRENT',
  cryptographicHash: '8c074f7247227e487ad5a1e39bcc3908068e41d0ac0ed8ccc89fd2b7ff6096b2',
  canonicalDigest: '8c074f7247227e487ad5a1e39bcc3908068e41d0ac0ed8ccc89fd2b7ff6096b2',
  signature: '7610fd89ddfaabcf9694f0d40cc8a469d289aa21f4a7eadde366067d3b195de19973723dc27756b59e8b647b521476a5b07b287d53e4fea6d2249b858214c90e',
  publicKey: '302a300506032b6570032100fbcfa2947e46e9db5dfa70d6919f45eac09c66d00f4b2629c7da4162140e7ec2',
  signatureState: 'LOCAL_DEMO_SIGNATURE',
  payloadVersion: 'v5.0',
  claimsSummary: {
    total: 2,
    supported: 2,
    directEvidenceCount: 1,
    derivedEvidenceCount: 1
  },
  lineageNodes: [
    {
      id: 'node-story',
      type: 'STORY',
      label: 'Published Story: Bharati Summer Thermal Stability',
      details: 'Public science release approved by Editorial Review Board',
      state: 'VERIFIED'
    },
    {
      id: 'node-claim-1',
      type: 'CLAIM',
      label: 'Atomic Claim: -14.2°C mean temperature',
      details: 'Bound to primary report passage & verified AWS dataset',
      state: 'VERIFIED'
    },
    {
      id: 'node-pass-1',
      type: 'PASSAGE',
      label: 'Report Passage 3.2 (Page 14)',
      details: 'NCPOR Technical Publication series',
      state: 'VERIFIED'
    },
    {
      id: 'node-source-1',
      type: 'SOURCE',
      label: 'Source: NCPOR Permanent Station Bharati Baseline Profile',
      details: 'Identifier: NCPOR-STN-BHR-01',
      state: 'VERIFIED'
    },
    {
      id: 'node-exp-1',
      type: 'EXPEDITION',
      label: 'Expedition: 41st ISEA',
      details: 'Austral Summer & Winter Operations',
      state: 'VERIFIED',
      message: 'Official launch registered under MoES/PIB release PRID 1771960.'
    },
    {
      id: 'node-ds-raw',
      type: 'DATASET',
      label: 'NPDC Automated Weather Station Surface Time-Series',
      details: 'Record: NPDC-AWS-BHR-2022',
      state: 'VERIFIED',
      message: 'Surface meteorology catalogued at National Polar Data Center.'
    }
  ],
  lineageLinks: [
    { sourceId: 'node-story', targetId: 'node-claim-1', relationship: 'contains claim', state: 'VERIFIED' },
    { sourceId: 'node-claim-1', targetId: 'node-pass-1', relationship: 'supported by passage', state: 'VERIFIED' },
    { sourceId: 'node-pass-1', targetId: 'node-source-1', relationship: 'extracted from', state: 'VERIFIED' },
    { sourceId: 'node-source-1', targetId: 'node-exp-1', relationship: 'reported under', state: 'VERIFIED' },
    { sourceId: 'node-exp-1', targetId: 'node-ds-raw', relationship: 'originating record', state: 'VERIFIED' }
  ],
  auditTrail: [
    {
      id: 'audit-01',
      timestamp: '2026-09-30T09:15:00Z',
      action: 'CREATED',
      performedBy: 'NCPOR Scientific Outreach Team (Communicator)',
      role: 'Scientist',
      notes: 'Initial outreach draft created with atomic claim bindings to F1.',
      affectedEntityId: 'story-01'
    },
    {
      id: 'audit-02',
      timestamp: '2026-09-30T09:30:00Z',
      action: 'CLAIM_GUARD_CHECK',
      performedBy: 'Claim Guard Engine v5.0',
      role: 'Scientist',
      notes: 'Automated claim guard check passed: 2/2 claims supported, 0 drift detected.',
      affectedEntityId: 'story-01'
    },
    {
      id: 'audit-03',
      timestamp: '2026-09-30T09:45:00Z',
      action: 'REVIEWED',
      performedBy: 'Scientific Review Board (Reviewer)',
      role: 'Reviewer',
      notes: 'Verified against primary report and raw dataset derivations. Approved for dissemination.',
      affectedEntityId: 'story-01'
    },
    {
      id: 'audit-04',
      timestamp: '2026-09-30T10:00:00Z',
      action: 'PUBLISHED',
      performedBy: 'Scientific Review Board (Reviewer)',
      role: 'Reviewer',
      notes: 'Receipt generated, signed with local Ed25519 key, and registered.',
      affectedEntityId: 'PL-RCPT-2026-0930-BHR01'
    }
  ]
};

export const SEED_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-01',
    sourceEntityId: 'sta-bharati',
    sourceEntityType: 'Station',
    targetEntityId: 'exp-isea-41',
    targetEntityType: 'Expedition',
    relationshipType: 'HOSTED_EXPEDITION',
    status: 'VERIFIED',
    reason: 'Official NCPOR operational deployment record',
    verifiedBy: 'Chief Polar Officer',
    verifiedAt: '2022-04-01'
  },
  {
    id: 'rel-02',
    sourceEntityId: 'exp-isea-41',
    sourceEntityType: 'Expedition',
    targetEntityId: 'ds-bharati-temp',
    targetEntityType: 'Dataset',
    relationshipType: 'GENERATED_DATASET',
    status: 'VERIFIED',
    reason: 'Direct sensor logging stream registered under 41st ISEA',
    verifiedBy: 'Data Curator',
    verifiedAt: '2022-03-01'
  },
  {
    id: 'rel-03',
    sourceEntityId: 'sta-maitri',
    sourceEntityType: 'Station',
    targetEntityId: 'exp-isea-41',
    targetEntityType: 'Expedition',
    relationshipType: 'SECONDARY_SUPPORT_BASE',
    status: 'SUGGESTED',
    confidenceScore: 0.72,
    reason: 'Field logistics report mentions brief helicopter refueling stop at Maitri.',
    verifiedBy: undefined
  },
  {
    id: 'rel-04',
    sourceEntityId: 'sta-himansh',
    sourceEntityType: 'Station',
    targetEntityId: 'ds-bharati-temp',
    targetEntityType: 'Dataset',
    relationshipType: 'SHARED_EQUIPMENT_BATCH',
    status: 'REJECTED',
    confidenceScore: 0.15,
    reason: 'Vaisala sensor batch numbers belong to separate Himalayan cryosphere series.',
    verifiedBy: 'Equipment Registrar',
    verifiedAt: '2022-05-10'
  }
];
