/**
 * constants.js - Diccionarios maestros y configuraciones del motor
 * Refactorizado: Single Source of Truth para el vocabulario clínico.
 */

// 1. Definición del Vector de Inferencia Probabilística (Orden Estricto del Modelo)
export const PROBABILISTIC_FEATURES = [
    "edad", "papula", "placa", "vesicula", "pustula", "bula_ampolla", "escama", "ulcera", "purpura", "dermatomal",
    "generalizado", "localizado", "acral", "fotoexpuesto", "topo_flexural_pliegues", "topo_friccion_extensora",
    "agudo", "subagudo", "cronico", "prurito", "prurito_nocturno", "ardor_quemazon", "dolor", "asintomatico",
    "fiebre", "farmacos_recientes", "inmunosupresion", "diabetes", "hepatopatia", "atopia", "embarazo",
    "contagio_familiar", "eritema", "hiperpigmentacion", "hipopigmentacion", "costra", "erosion", "excoriacion",
    "liquenificacion", "nodulo", "quiste", "induracion", "telangiectasias", "atrofia", "habon", "comedon", "surco",
    "fistulas_supuracion", "interaccion_fiebre_purpura", "interaccion_fiebre_ampolla", "interaccion_inmuno_agudo",
    "interaccion_dolor_agudo", "cabeza", "cara_centro", "tronco", "extremidad_superior", "extremidad_inferior",
    "pies", "escama_nacarada", "escama_untuosa", "anular", "curacion_central", "zosteriforme", "umbilicacion",
    "cupuliforme", "mucosas",
    "simetrico", "seborreica", "macula",
    "prodromo_catarral", "despegamiento_epidermico", "borde_activo", "costra_mielicerica", "purpura_palpable", "engrosamiento_ungueal",
    "ft_I", "ft_II", "ft_III", "ft_IV", "ft_V", "ft_VI"
];

// 2. Características Adicionales (Solo Heurística / Trazabilidad)
export const FEATURE_INDEX = {};
PROBABILISTIC_FEATURES.forEach((f, idx) => {
    FEATURE_INDEX[f] = idx;
});

// 2. Características Adicionales (Capa de Razonamiento Heurístico / Trazabilidad)
// Estas no se incluyen en el vector numérico del Random Forest para evitar desincronización
const EXTRA_CLINICAL_FEATURES = [
    'sexo_male', 'sexo_female',
    'mancha', 'tumor', 'vegetacion',
    'escara', 'fisura', 'esclerosis', 'cicatriz',
    'lineal',
    'ampolla_nikolsky', 'signo_abcde',
    'lesion_evanescente', 'color_violaceo'
];

export const EXTRA_FEATURE_INDEX = {};
EXTRA_CLINICAL_FEATURES.forEach(f => {
    EXTRA_FEATURE_INDEX[f] = true;
});

export const FEATURE_MAP_LABELS = {
    farmacos_recientes: "Exp. a Fármacos",
    fiebre: "Fiebre",
    bula_ampolla: "Ampollas/Bulas",
    ulcera: "Úlcera",
    purpura: "Púrpura",
    generalizado: "Generalizado",
    agudo: "Agudo",
    inmunosupresion: "Inmunocompromiso",
    cronico: "Crónico",
    escama: "Descamación",
    dolor: "Dolor Intenso",
    signo_mucosas: "Mucosas",
    nodulo: "Nódulo",
    tumor: "Tumor",
    erosion: "Erosiones",
    comedon: "Comedones",
    hepatopatia: "Hepatopatía",
    diabetes: "Diabetes/Metabólico",
    atopia: "Atopía",
    embarazo: "Embarazo",
    contagio_familiar: "Contagio Familiar",
    dermatomal: "Dermatomal",
    topo_flexural_pliegues: "Flexuras / Pliegues",
    topo_friccion_extensora: "Extensoras / Fricción",
    fotoexpuesto: "Fotoexpuesto",
    acral: "Patrón Acral",
    lineal: "Lineal",
    localizado: "Localizado",
    cabeza: "Cabeza y Cuello",
    tronco: "Tronco",
    extremidad_superior: "M. Superiores",
    extremidad_inferior: "M. Inferiores",
    simetrico: "Simetrico",
    macula: "Mácula",
    papula: "Pápula",
    placa: "Placa",
    vesicula: "Vesícula",
    pustula: "Pústula",
    habon: "Habón",
    costra: "Costra",
    escara: "Escara/Necrosis",
    atrofia: "Atrofia",
    liquenificacion: "Liquenificación",
    cicatriz: "Cicatriz",
    prurito_nocturno: "Prurito Nocturno",
    ardor_quemazon: "Ardor/Quemazón",
    asintomatico: "Asintomática",
    fistulas_supuracion: "Fístulas",
    escama_nacarada: "Escama Nacarada",
    escama_untuosa: "Escama Untuosa",
    ampolla_nikolsky: "Nikolsky Positivo",
    signo_abcde: "Señal ABCDE",
    lesion_evanescente: "Habón Evanescente",
    curacion_central: "Curación Central",
    umbilicacion: "Umbilicación",
    cupuliforme: "Cupuliforme",
    prodromo_catarral: "Pródromo Catarral",
    despegamiento_epidermico: "Signo de Nikolsky",
    borde_activo: "Borde Activo",
    costra_mielicerica: "Costra Melicérica",
    purpura_palpable: "Púrpura Palpable",
    engrosamiento_ungueal: "Uñas (Pitting/Onicolisis)"
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
