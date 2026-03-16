/**
 * constants.js - Diccionarios maestros y configuraciones del motor
 * Refactorizado: Single Source of Truth para el vocabulario clínico.
 */

// 1. Definición del Vector de Inferencia Probabilística (Orden Estricto del Modelo)
export const PROBABILISTIC_FEATURES = [
    "edad", "papula", "placa", "vesicula", "pustula", "bula_ampolla", "escama", "ulcera", "purpura",
    "dermatomal", "intertriginoso", "flexural", "extensor", "generalizado", "localizado",
    "agudo", "subagudo", "cronico", "prurito", "dolor", "fiebre",
    "farmacos_recientes", "inmunosupresion", "diabetes", "hepatopatia", "atopia", "embarazo",
    "eritema", "hiperpigmentacion", "hipopigmentacion", "costra", "erosion", "excoriacion",
    "liquenificacion", "nodulo", "quiste", "induracion", "telangiectasias", "atrofia", "habon", "comedon", "surco",
    "ft_I", "ft_II", "ft_III", "ft_IV", "ft_V", "ft_VI",
    "interaccion_fiebre_purpura", "interaccion_fiebre_ampolla", "interaccion_inmuno_agudo", "interaccion_dolor_agudo"
];

// 2. Características Adicionales (Lógica Heurística, Anatomía y Detalles UI)
const EXTRA_CLINICAL_FEATURES = [
    // Demografía/Basales extra
    'sexo_male', 'sexo_female',
    // Lesiones primarias no incluidas en el modelo probabilístico
    'macula', 'mancha', 'tumor', 'vegetacion',
    // Lesiones secundarias extra
    'escara', 'fisura', 'esclerosis', 'cicatriz',
    // Topografía Detallada
    'topog_cabeza', 'topo_cuero_cabelludo', 'topo_cara_centro', 'topo_cuello',
    'topog_tronco', 'topo_pecho', 'topo_abdomen', 'topo_espalda', 'topo_axilas', 'topo_inguinal', 'topo_submamario',
    'topog_ext_sup', 'topo_hombros', 'topo_brazos', 'topo_codos', 'topo_antebrazos', 'topo_manos', 'topo_dorso_manos', 'topo_palmas',
    'topog_ext_inf', 'topo_muslos', 'topo_rodillas', 'topo_espinillas', 'topo_pantorrillas', 'topo_tobillos', 'topo_pies', 'topo_plantas', 'topo_dorso_pies',
    // Patrones extra
    'patron_acral', 'patron_seborreica', 'patron_fotoexpuesto', 'patron_simetrico', 'patron_lineal',
    // Contexto extra
    'antecedente_neoplasia', 'antecedente_autoinmune', 'antecedente_obesidad', 'antecedente_trauma', 'antecedente_quimico', 'antecedente_viaje', 'antecedente_eii',
    // Señales específicas
    'signo_mucosas'
];

export const FEATURE_INDEX = {};
[...PROBABILISTIC_FEATURES, ...EXTRA_CLINICAL_FEATURES].forEach((f, idx) => {
    FEATURE_INDEX[f] = idx;
});

export const FEATURE_MAP_LABELS = {
    farmacos_recientes: "Exposición a Fármacos Sistémicos",
    fiebre: "Respuesta Inflamatoria Sistémica (Fiebre)",
    bula_ampolla: "Formación de Ampollas / Bulas",
    ulcera: "Pérdida de Continuidad Tisular (Úlcera)",
    purpura: "Extravasación Hemática (Púrpura)",
    generalizado: "Compromiso Extenso de Superficie",
    agudo: "Instauración Hiperaguda (Fast-onset)",
    inmunosupresion: "Estado de Inmunocompromiso",
    cronico: "Evolución Crónica (>6 sem)",
    escama: "Descamación Superficial",
    dolor: "Dolor Intenso / Progresivo",
    signo_mucosas: "Compromiso de Mucosas",
    nodulo: "Lesión Nodular",
    tumor: "Lesión Tumoral / Masa",
    erosion: "Erosiones Cutáneas",
    comedon: "Presencia de Comedones",
    antecedente_neoplasia: "Antecedente de Neoplasia",
    antecedente_autoinmune: "Condición Autoinmune",
    hepatopatia: "Hepatopatía Crónica",
    diabetes: "Diabetes Mellitus / Riesgo Metabólico",
    antecedente_trauma: "Trauma o Herida Reciente",
    antecedente_viaje: "Viaje a Zona Tropical",
    atopia: "Perfil Atópico (Dermatitis/Asma)",
    embarazo: "Estado de Embarazo",
    dermatomal: "Distribución Dermatomal (Segmentaria)",
    intertriginoso: "Patrón Intertriginoso (Pliegues)",
    flexural: "Distribución en Flexuras",
    extensor: "Distribución en Superficies Extensoras",
    lineal: "Distribución Lineal",
    localizado: "Lesión Localizada / Única",
    topog_cabeza: "Cabeza y Cuello",
    topog_tronco: "Tronco",
    topog_ext_sup: "Miembros Superiores",
    topog_ext_inf: "Miembros Inferiores",
    patron_acral: "Patrón Acral (Manos/Pies)",
    patron_simetrico: "Distribución Simétrica",
    lesion_macula: "Mácula",
    lesion_papula: "Pápula",
    lesion_placa: "Placa",
    lesion_vesicula: "Vesícula",
    lesion_pustula: "Pústula",
    lesion_habon: "Habón / Roncha",
    lesion_costra: "Costra",
    lesion_escara: "Escara / Necrosis",
    lesion_atrofia: "Atrofia",
    lesion_liquenificacion: "Liquenificación",
    lesion_cicatriz: "Cicatriz",
    topo_cara_centro: "Cara Centrofacial",
    topo_cuero_cabelludo: "Cuero Cabelludo",
    topo_pies: "Pies / Plantas",
    topo_manos: "Manos / Palmas",
    topo_inguinal: "Región Inguinal / Genital",
    topo_submamario: "Pliegue Submamario"
};

export const CLINICAL_GUI = {
    recommendations: {
        1: {
            conduct: "Evaluación urgente / Derivación inmediata a Servicio de Urgencias.",
            timeframe: "Inmediato (Hoy)",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        2: {
            conduct: "Derivación prioritaria a Dermatología o evaluación preferente por especialista.",
            timeframe: "Plazo Corto (7-14 días)",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        3: {
            conduct: "Manejo ambulatorio estándar / Control programado o seguimiento por medicina general.",
            timeframe: "Diferible (Según disponibilidad)",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    },
    warnings: "Esta herramienta es un apoyo a la decisión clínica y no reemplaza el juicio médico presencial. Si el paciente presenta compromiso hemodinámico o insuficiencia respiratoria, actúe según protocolo de emergencia independientemente del resultado."
};

export const PRIORITY_LABELS = {
    1: "URGENCIAL",
    2: "PRIORITARIO",
    3: "ESTABLE"
};
