/**
 * constants.js - Diccionarios maestros y configuraciones del motor.
 */

export const PROBABILISTIC_FEATURES = [
    'edad', 'papula', 'placa', 'vesicula', 'pustula', 'bula_ampolla', 'escama', 'ulcera', 'purpura', 'dermatomal',
    'generalizado', 'localizado', 'acral', 'fotoexpuesto', 'topo_flexural_pliegues', 'topo_friccion_extensora',
    'agudo', 'subagudo', 'cronico', 'prurito', 'prurito_nocturno', 'ardor_quemazon', 'dolor', 'asintomatico',
    'fiebre', 'farmacos_recientes', 'inmunosupresion', 'diabetes', 'hepatopatia', 'atopia', 'embarazo',
    'contagio_familiar', 'eritema', 'hiperpigmentacion', 'hipopigmentacion', 'costra', 'erosion', 'excoriacion',
    'liquenificacion', 'nodulo', 'quiste', 'induracion', 'telangiectasias', 'atrofia', 'habon', 'comedon', 'surco',
    'fistulas_supuracion', 'interaccion_fiebre_purpura', 'interaccion_fiebre_ampolla', 'interaccion_inmuno_agudo',
    'interaccion_dolor_agudo', 'cabeza', 'cara_centro', 'tronco', 'extremidad_superior', 'extremidad_inferior',
    'pies', 'escama_nacarada', 'escama_untuosa', 'anular', 'curacion_central', 'zosteriforme', 'umbilicacion',
    'cupuliforme', 'simetrico', 'seborreica', 'macula', 'prodromo_catarral', 'despegamiento_epidermico',
    'borde_activo', 'costra_mielicerica', 'purpura_palpable', 'engrosamiento_ungueal', 'mucosas',
    'ft_I', 'ft_II', 'ft_III', 'ft_IV', 'ft_V', 'ft_VI'
];

export const FEATURE_INDEX = {};
PROBABILISTIC_FEATURES.forEach((feature, idx) => {
    FEATURE_INDEX[feature] = idx;
});

const EXTRA_CLINICAL_FEATURES = [
    'sexo_male', 'sexo_female',
    'mancha', 'tumor', 'vegetacion',
    'escara', 'fisura', 'esclerosis', 'cicatriz',
    'lineal',
    'necrosis_isquemia', 'signo_hipotension', 'compromiso_conciencia',
    'ampolla_nikolsky', 'signo_abcde',
    'lesion_evanescente', 'color_violaceo'
];

export const EXTRA_FEATURE_INDEX = {};
EXTRA_CLINICAL_FEATURES.forEach(feature => {
    EXTRA_FEATURE_INDEX[feature] = true;
});

export const FEATURE_MAP_LABELS = {
    farmacos_recientes: 'Exp. a farmacos',
    fiebre: 'Fiebre',
    bula_ampolla: 'Ampollas/Bulas',
    ulcera: 'Ulcera',
    purpura: 'Purpura',
    generalizado: 'Generalizado',
    agudo: 'Agudo',
    inmunosupresion: 'Inmunocompromiso',
    cronico: 'Cronico',
    escama: 'Descamacion',
    dolor: 'Dolor intenso',
    mucosas: 'Mucosas',
    signo_mucosas: 'Mucosas',
    nodulo: 'Nodulo',
    tumor: 'Tumor',
    erosion: 'Erosiones',
    comedon: 'Comedones',
    hepatopatia: 'Hepatopatia',
    diabetes: 'Diabetes/Metabolico',
    atopia: 'Atopia',
    embarazo: 'Embarazo',
    contagio_familiar: 'Contagio familiar',
    dermatomal: 'Dermatomal',
    topo_flexural_pliegues: 'Flexuras / Pliegues',
    topo_friccion_extensora: 'Extensoras / Friccion',
    fotoexpuesto: 'Fotoexpuesto',
    acral: 'Patron acral',
    lineal: 'Lineal',
    localizado: 'Localizado',
    cabeza: 'Cabeza y cuello',
    tronco: 'Tronco',
    extremidad_superior: 'M. superiores',
    extremidad_inferior: 'M. inferiores',
    simetrico: 'Simetrico',
    macula: 'Macula',
    papula: 'Papula',
    placa: 'Placa',
    vesicula: 'Vesicula',
    pustula: 'Pustula',
    habon: 'Habon',
    costra: 'Costra',
    escara: 'Escara/Necrosis',
    atrofia: 'Atrofia',
    liquenificacion: 'Liquenificacion',
    cicatriz: 'Cicatriz',
    prurito_nocturno: 'Prurito nocturno',
    ardor_quemazon: 'Ardor/Quemazon',
    asintomatico: 'Asintomatica',
    fistulas_supuracion: 'Fistulas',
    escama_nacarada: 'Escama nacarada',
    escama_untuosa: 'Escama untuosa',
    ampolla_nikolsky: 'Nikolsky positivo',
    necrosis_isquemia: 'Necrosis / Isquemia',
    signo_hipotension: 'Hipotension',
    compromiso_conciencia: 'Compromiso de conciencia',
    signo_abcde: 'Senal ABCDE',
    lesion_evanescente: 'Habon evanescente',
    curacion_central: 'Curacion central',
    umbilicacion: 'Umbilicacion',
    cupuliforme: 'Cupuliforme',
    prodromo_catarral: 'Prodromo catarral',
    despegamiento_epidermico: 'Signo de Nikolsky',
    borde_activo: 'Borde activo',
    costra_mielicerica: 'Costra melicerica',
    purpura_palpable: 'Purpura palpable',
    engrosamiento_ungueal: 'Unas (Pitting/Onicolisis)'
};

export const CLINICAL_GUI = {
    recommendations: {
        1: {
            conduct: 'Evaluacion urgente / Derivacion inmediata a Servicio de Urgencias.',
            timeframe: 'Inmediato (Hoy)',
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        2: {
            conduct: 'Derivacion prioritaria a Dermatologia o evaluacion preferente por especialista.',
            timeframe: 'Plazo corto (7-14 dias)',
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        3: {
            conduct: 'Manejo ambulatorio estandar / Control programado o seguimiento por medicina general.',
            timeframe: 'Diferible (Segun disponibilidad)',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    },
    warnings: 'Esta herramienta es un apoyo a la decision clinica y no reemplaza el juicio medico presencial. Si el paciente presenta compromiso hemodinamico o insuficiencia respiratoria, actue segun protocolo de emergencia independientemente del resultado.'
};

export const PRIORITY_LABELS = {
    1: 'URGENTE',
    2: 'PRIORITARIO',
    3: 'ESTABLE'
};
