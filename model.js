/**
 * model.js - Arquitectura Modular CDSS v4.0 (Semiología y Topografía Avanzada)
 */

/**
 * 1. DICCIONARIO DE POSICIONES (Indice de Features X)
 * Total aproximado: 105 variables
 */
export const FEATURE_INDEX = {
    // 1. Demografía y Base (IDs 0-2)
    edad: 0, sexo: 1, fototipo: 2,

    // 2. Comorbilidades (IDs 3-10)
    inmunosupresion: 3, farmacos_recientes: 4, riesgo_metabolico: 5, atopia: 6, 
    auto_inmune: 7, enf_intestinal: 8, hepatopatia: 9, sop_hirsutismo: 10,

    // 3. Lesiones Primarias Sólidas (IDs 11-17)
    lesion_macula: 11, lesion_papula: 12, lesion_placa: 13, lesion_habon: 14, 
    lesion_nodulo: 15, lesion_tumor: 16, lesion_quiste: 17,

    // 4. Lesiones de Contenido Líquido (IDs 18-21)
    lesion_vesicula: 18, lesion_ampolla: 19, lesion_pustula: 20, lesion_absceso: 21,

    // 5. Lesiones Secundarias y Sol. Continuidad (IDs 22-29)
    lesion_escama: 22, lesion_costra: 23, lesion_escara: 24, lesion_erosion: 25, 
    lesion_ulcera: 26, lesion_fisura: 27, lesion_atrofia: 28, lesion_esclerosis: 29,

    // 6. Signos Sistémicos / Alarma (IDs 30-33)
    signo_fiebre: 30, signo_dolor: 31, signo_mucosas: 32, signo_adenopatias: 33,

    // 7. Topografía Mayor (Regiones) (IDs 34-40)
    topog_cabeza: 34, topog_tronco: 35, topog_ext_sup: 36, topog_ext_inf: 37, 
    topog_anogenital: 38, topog_palmas_plantas: 39, topog_mucosas: 40,

    // 8. Topografía Específica (Sub-áreas) (IDs 41-75+)
    topo_cuero_cabelludo: 41, topo_cara_central: 42, topo_cara_periferica: 43, topo_cuello: 44,
    topo_pecho: 45, topo_abdomen: 46, topo_espalda_sup: 47, topo_espalda_inf: 48,
    topo_axilas: 49, topo_brazos: 50, topo_manos: 51, topo_ingles: 52,
    topo_piernas: 53, topo_pies: 54, topo_genitales: 55, topo_perianal: 56,

    // 9. Distribución y Patrones (IDs 76-88)
    patron_simetrico: 76, patron_asimetrico: 77, patron_acral: 78, patron_central: 79,
    patron_dermatomal: 80, patron_lineal: 81, patron_herpetiforme: 82, patron_numular: 83,
    patron_flexoras: 84, patron_extensoras: 85, patron_fotoexpuesto: 86, patron_intertriginoso: 87,
    patron_generalizado: 88,

    // 10. Evolución (IDs 89-91)
    tiempo_agudo: 89, tiempo_subagudo: 90, tiempo_cronico: 91
};

/**
 * 2. ETIQUETAS CLÍNICAS (Mapeo Humano)
 */
export const FEATURE_LABELS = {
    edad: "Edad avanzada", sexo: "Sexo masculino", fototipo: "Fototipo oscuro",
    inmunosupresion: "Inmunosupresión / Cáncer", farmacos_recientes: "Fármacos recientes (<4s)",
    lesion_ampolla: "Ampollas", signo_mucosas: "Compromiso de mucosas", signo_fiebre: "Fiebre sistémica",
    lesion_ulcera: "Ulceración profunda", lesion_purpura: "Púrpura / Petequias",
    topog_mucosas: "Localización en Mucosas", patron_generalizado: "Distribución Generalizada",
    topo_cuero_cabelludo: "Cuero Cabelludo", topo_genitales: "Área Genital",
    patron_dermatomal: "Patrón Dermatomal (Zóster)", patron_acral: "Afectación Acral",
    lesion_macula: "Mácula", lesion_papula: "Pápula", lesion_placa: "Placa",
    lesion_nodulo: "Nódulo", lesion_vesicula: "Vesícula", lesion_pustula: "Pústula",
    lesion_escama: "Descamación", lesion_costra: "Costras", lesion_erosion: "Erosiones",
    signo_dolor: "Dolor intenso", signo_adenopatias: "Adenopatías palpables"
};

/**
 * 3. GRUPOS CLÍNICOS
 */
export const FEATURE_GROUPS = {
    primarias: ['lesion_macula', 'lesion_papula', 'lesion_placa', 'lesion_habon', 'lesion_nodulo', 'lesion_tumor', 'lesion_quiste'],
    liquidas: ['lesion_vesicula', 'lesion_ampolla', 'lesion_pustula', 'lesion_absceso'],
    secundarias: ['lesion_escama', 'lesion_costra', 'lesion_escara', 'lesion_erosion', 'lesion_ulcera', 'lesion_fisura', 'lesion_atrofia', 'lesion_esclerosis'],
    sistemicos: ['signo_fiebre', 'signo_dolor', 'signo_mucosas', 'signo_adenopatias'],
    regiones: ['topog_cabeza', 'topog_tronco', 'topog_ext_sup', 'topog_ext_inf', 'topog_anogenital', 'topog_palmas_plantas', 'topog_mucosas'],
    patrones: ['patron_simetrico', 'patron_asimetrico', 'patron_acral', 'patron_central', 'patron_dermatomal', 'patron_lineal', 'patron_herpetiforme', 'patron_numular', 'patron_flexoras', 'patron_extensoras', 'patron_fotoexpuesto', 'patron_intertriginoso', 'patron_generalizado']
};

/**
 * 4. CONFIGURACIÓN DE PESOS ESTRATÉGICOS (Logística Multiclase)
 */
const NUM_FEATURES = Object.keys(FEATURE_INDEX).length;

function createWeightsForClass(intensityMap) {
    const w = new Array(NUM_FEATURES).fill(0);
    for (const [key, value] of Object.entries(intensityMap)) {
        if (FEATURE_INDEX[key] !== undefined) {
            w[FEATURE_INDEX[key]] = value;
        }
    }
    return w;
}

export const MODEL_WEIGHTS = {
    labels: ["Prioridad 3 (Baja)", "Prioridad 2 (Media)", "Prioridad 1 (Alta)"],
    weights: [
        // Clase 0: Prioridad Baja (Crónico, localizado, sin signos de alarma)
        createWeightsForClass({
            tiempo_cronico: 2.0, patron_simetrico: 0.5, lesion_placa: 0.8, lesion_escama: 0.5,
            signo_fiebre: -5.0, lesion_ampolla: -5.0, inmunosupresion: -3.0
        }),
        // Clase 1: Prioridad Media (Subagudo, patrones extensos pero estables)
        createWeightsForClass({
            tiempo_subagudo: 1.5, lesion_papula: 1.0, lesion_nodulo: 1.0, topo_cara_central: 0.5,
            patron_generalizado: 0.5, lesion_pustula: 0.8
        }),
        // Clase 2: Prioridad Alta (Urgencia)
        createWeightsForClass({
            // SINDROMES GRAVES: Ampollas + Mucosas + Fiebre (NET/SSJ)
            lesion_ampolla: 6.0, signo_mucosas: 5.5, signo_fiebre: 4.0, farmacos_recientes: 4.5,
            // VASCULITIS / INFECCIÓN: Púrpura/Ulceración + Fiebre
            lesion_ulcera: 4.0, signo_dolor: 3.5, inmunosupresion: 3.5,
            // Otros
            patron_generalizado: 2.5, signo_adenopatias: 2.0, tiempo_agudo: 2.0
        })
    ],
    biases: [2.0, 0.0, -5.5] // Bias bajo para clase 2 para evitar falsos rojos sin evidencia fuerte
};

/**
 * 5. FEATURE ENGINEERING DINÁMICO
 */
export function encodeFeatures(formData) {
    const X = new Array(NUM_FEATURES).fill(0);

    // Mapeo automático de todo lo que coincida con FEATURE_INDEX
    for (const [key, value] of Object.entries(formData)) {
        if (FEATURE_INDEX[key] !== undefined) {
            if (typeof value === 'boolean') {
                X[FEATURE_INDEX[key]] = value ? 1 : 0;
            } else if (key === 'age') {
                X[FEATURE_INDEX.edad] = (parseFloat(value) || 0) / 100;
            } else if (typeof value === 'string' && value === key) { // Casos de "value=key"
                 X[FEATURE_INDEX[key]] = 1;
            }
        }
    }

    // Mapeo manual de valores específicos
    X[FEATURE_INDEX.sexo] = formData.gender === 'male' ? 1 : 0;
    X[FEATURE_INDEX.fototipo] = parseInt(formData.fitzpatrick) || 0;
    
    // Temporalidad
    if (formData.timing === 'acute') X[FEATURE_INDEX.tiempo_agudo] = 1;
    if (formData.timing === 'subacute') X[FEATURE_INDEX.tiempo_subagudo] = 1;
    if (formData.timing === 'chronic') X[FEATURE_INDEX.tiempo_cronico] = 1;

    return X;
}

// Funciones matemáticas permanecen consistentes
function dotProduct(w, x) {
    return w.reduce((sum, wi, i) => sum + wi * (x[i] || 0), 0);
}

function softmax(z) {
    const maxZ = Math.max(...z);
    const exps = z.map(zi => Math.exp(zi - maxZ));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(ei => ei / sumExps);
}

export function predict(X) {
    const scores = MODEL_WEIGHTS.weights.map((w, i) => dotProduct(w, X) + MODEL_WEIGHTS.biases[i]);
    const probs = softmax(scores);
    const winIdx = probs.indexOf(Math.max(...probs));
    return { classIdx: winIdx, probabilities: probs, priority: [3, 2, 1][winIdx], label: MODEL_WEIGHTS.labels[winIdx] };
}

export function explain(X, winningClassIdx) {
    const weights = MODEL_WEIGHTS.weights[winningClassIdx];
    const contribs = Object.keys(FEATURE_INDEX).map(key => {
        const idx = FEATURE_INDEX[key];
        return { name: FEATURE_LABELS[key] || key, value: weights[idx] * X[idx] };
    });
    return contribs.filter(c => Math.abs(c.value) > 0.1).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 3);
}
