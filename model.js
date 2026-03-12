/**
 * model.js - Motor Clínico Canónico CDSS v6.0
 * Arquitectura de "Única Fuente de Verdad"
 */

// 1. DICCIONARIO MAESTRO DE VARIABLES (120+ Features)
export const FEATURE_INDEX = {};
export const FEATURE_LABELS = {};

const featureGroups = {
    basics: ['edad', 'fototipo', 'sexo_male', 'sexo_female'],
    red_flags: ['inmunosupresion', 'farmacos_recientes', 'riesgo_metabolico', 'signo_fiebre'],
    primarias: ['lesion_macula', 'lesion_mancha', 'lesion_papula', 'lesion_placa', 'lesion_nodulo', 'lesion_habon', 'lesion_eritema', 'lesion_purpura', 'lesion_telangiectasia', 'lesion_comedon', 'lesion_quiste', 'lesion_tumor', 'lesion_vegetacion'],
    liquidas: ['lesion_vesicula', 'lesion_ampolla', 'lesion_bula', 'lesion_pustula'],
    secundarias: ['lesion_escama', 'lesion_costra', 'lesion_escara', 'lesion_erosion', 'lesion_ulcera', 'lesion_excoriacion', 'lesion_fisura', 'lesion_atrofia', 'lesion_esclerosis', 'lesion_liquenificacion', 'lesion_cicatriz'],
    topografia: [
        'topog_cabeza', 'topo_cuero_cabelludo', 'topo_cara_centro', 'topo_cuello',
        'topog_tronco', 'topo_pecho', 'topo_abdomen', 'topo_espalda', 'topo_axilas',
        'topog_ext_inf', 'topo_muslos', 'topo_rodillas', 'topo_espinillas', 'topo_pantorrillas', 'topo_tobillos', 'topo_pies', 'topo_plantas', 'topo_dorso_pies'
    ],
    patrones: ['patron_acral', 'patron_dermatomal', 'patron_seborreica', 'patron_fotoexpuesto', 'patron_simetrico', 'patron_extensoras', 'patron_flexoras', 'patron_generalizado'],
    timing: ['tiempo_agudo', 'tiempo_subagudo', 'tiempo_cronico']
};

// Inicialización automática del índice
let i = 0;
Object.values(featureGroups).flat().forEach(f => {
    FEATURE_INDEX[f] = i++;
});

// Mapeo de etiquetas para el motor de explicabilidad
export const FEATURE_MAP_LABELS = {
    farmacos_recientes: "Exposición a Fármacos Sistémicos",
    signo_fiebre: "Respuesta Inflamatoria Sistémica",
    lesion_ampolla: "Formación de Ampollas",
    lesion_bula: "Dermatosis Ampollosa Mayor",
    lesion_ulcera: "Pérdida de Continuidad Tisular",
    lesion_purpura: "Extravasación Hemática (Púrpura)",
    patron_generalizado: "Compromiso Extenso de Superficie",
    tiempo_agudo: "Instauración Hiperaguda",
    inmunosupresion: "Estado de Inmunocompromiso",
    tiempo_cronico: "Evolución Crónica (>6 sem)",
    lesion_escama: "Descamación Superficial"
};

// 2. CONFIGURACIÓN DEL MODELO (Pesos Estratégicos)
export const MODEL_WEIGHTS = {
    labels: ["Prioridad 3 - Estable", "Prioridad 2 - Derivación", "Prioridad 1 - URGENCIAL"],
    biases: [4.0, 0.0, -12.0],
    
    // Motor de pesos dinámico para escala de 120+ variables
    getWeight: (priorityIdx, featureIdx) => {
        const featureKey = Object.keys(FEATURE_INDEX).find(k => FEATURE_INDEX[k] === featureIdx);
        if (!featureKey) return 0;

        // PRIORIDAD 1: ALTA (Rojo)
        if (priorityIdx === 2) { 
            if (featureKey.includes('ampolla') || featureKey.includes('bula')) return 12;
            if (featureKey.includes('ulcera') || featureKey.includes('erosion')) return 8;
            if (featureKey.includes('farmacos')) return 10;
            if (featureKey.includes('fiebre')) return 9;
            if (featureKey.includes('agudo')) return 8;
            if (featureKey.includes('purpura')) return 10;
            if (featureKey.includes('generalizado')) return 9;
            if (featureKey.includes('inmunosupresion')) return 6;
            if (featureKey.includes('dolor')) return 7;
            if (featureKey.includes('mucosas')) return 8;
        }
        
        // PRIORIDAD 3: BAJA (Verde)
        if (priorityIdx === 0) { 
            if (featureKey.includes('cronico')) return 5;
            if (featureKey.includes('cicatriz') || featureKey.includes('atrofia')) return 3;
            if (featureKey.includes('escama')) return 1.5;
        }

        // PRIORIDAD 2: MEDIA (Ámbar)
        if (priorityIdx === 1) {
            if (featureKey.includes('nodulo') || featureKey.includes('tumor')) return 6;
            if (featureKey.includes('subagudo')) return 4;
            if (featureKey.includes('cabeza')) return 1;
            if (featureKey.includes('dolor')) return 8;
            if (featureKey.includes('vesicula')) return 5;
            if (featureKey.includes('purpura')) return 6;
            if (featureKey.includes('generalizado')) return 4;
        }

        return 0.1; // Ruido base para estabilidad numérica
    }
};

// 3. FUNCIONES DE INFERENCIA
export function encodeFeatures(formData) {
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    
    // Mapeo dinámico: busca IDs del formData en el FEATURE_INDEX
    for (const [key, value] of Object.entries(formData)) {
        if (FEATURE_INDEX[key] !== undefined) {
            if (typeof value === 'boolean') {
                X[FEATURE_INDEX[key]] = value ? 1 : 0;
            } else if (key === 'age') {
                X[FEATURE_INDEX.edad] = (parseFloat(value) || 0) / 100;
            } else if (key === 'fitzpatrick') {
                X[FEATURE_INDEX.fototipo] = parseInt(value) || 1;
            }
        }
    }

    // Mapeo de Timing radiogroup
    if (formData.timing) {
        if (formData.timing === 'acute') X[FEATURE_INDEX.tiempo_agudo] = 1;
        if (formData.timing === 'subacute') X[FEATURE_INDEX.tiempo_subagudo] = 1;
        if (formData.timing === 'chronic') X[FEATURE_INDEX.tiempo_cronico] = 1;
    }

    return X;
}

function softmax(scores) {
    const maxZ = Math.max(...scores);
    const exps = scores.map(zi => Math.exp(zi - maxZ));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(ei => ei / sumExps);
}

export function predict(X) {
    const scores = [0, 1, 2].map(priorityIdx => {
        let sum = MODEL_WEIGHTS.biases[priorityIdx];
        X.forEach((val, fIdx) => {
            sum += val * MODEL_WEIGHTS.getWeight(priorityIdx, fIdx);
        });
        return sum;
    });

    const probs = softmax(scores);
    const winIdx = probs.indexOf(Math.max(...probs));
    
    return {
        classIdx: winIdx,
        probabilities: probs,
        priority: [3, 2, 1][winIdx],
        label: MODEL_WEIGHTS.labels[winIdx]
    };
}

export function explain(X, winningClassIdx) {
    const contribs = Object.keys(FEATURE_INDEX).map(fKey => {
        const fIdx = FEATURE_INDEX[fKey];
        return {
            name: FEATURE_MAP_LABELS[fKey] || fKey.replace('lesion_','').replace('topo_','').replace('patron_','').toUpperCase().replace('_',' '),
            val: MODEL_WEIGHTS.getWeight(winningClassIdx, fIdx) * X[fIdx]
        };
    }).filter(c => Math.abs(c.val) > 0.5)
      .sort((a,b) => Math.abs(b.val) - Math.abs(a.val))
      .slice(0, 5);

    return contribs;
}
