/**
 * feature_encoder.js - Single Source of Truth para la transformación de features.
 * Transforma formData de la UI en representaciones numéricas y semánticas.
 */
import { FEATURE_INDEX, PROBABILISTIC_FEATURES } from './constants.js';

export function encodeFeatures(formData) {
    // 1. Inicializar vector X con el tamaño del diccionario total
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    const featureMap = {};

    // 2. Mapeos de Datos Básicos y Demografía
    const age = parseFloat(formData.age) || 0;
    X[FEATURE_INDEX.edad] = age;
    featureMap.edad = age;

    const fitzpatrick = parseInt(formData.fitzpatrick) || 1;
    X[FEATURE_INDEX.fototipo] = fitzpatrick; // Para baseline si lo usa
    featureMap.fototipo = fitzpatrick;

    // Expansión de Dummies de Fitzpatrick (ft_I...ft_VI)
    const ftKey = `ft_${romanize(fitzpatrick)}`;
    if (FEATURE_INDEX[ftKey] !== undefined) {
        X[FEATURE_INDEX[ftKey]] = 1;
    }

    // Sexo
    if (formData.sex === 'male') X[FEATURE_INDEX.sexo_male] = 1;
    if (formData.sex === 'female') X[FEATURE_INDEX.sexo_female] = 1;

    // 3. Mapeo de Timing
    const timingMap = { 'acute': 'agudo', 'subacute': 'subagudo', 'chronic': 'cronico' };
    if (formData.timing && timingMap[formData.timing]) {
        const key = timingMap[formData.timing];
        X[FEATURE_INDEX[key]] = 1;
        featureMap[key] = 1;
    }

    // 4. Mapeo de Morfología, Topografía y Contexto
    for (const [rawKey, value] of Object.entries(formData)) {
        if (value !== true) continue;

        // Intentar mapeo directo primero (Preserva prefijos como patron_ o topo_)
        if (FEATURE_INDEX[rawKey] !== undefined) {
            X[FEATURE_INDEX[rawKey]] = 1;
            featureMap[rawKey] = 1;
            continue;
        }

        // Mapeos de normalización si el directo falla
        let targetKey = rawKey;
        if (rawKey === 'signo_fiebre') targetKey = 'fiebre';
        if (rawKey === 'signo_dolor') targetKey = 'dolor';
        if (rawKey === 'riesgo_metabolico') targetKey = 'diabetes';
        
        // Strip de prefijos para buscar en los 48 base del modelo probabilístico
        if (rawKey.startsWith('lesion_')) targetKey = rawKey.replace('lesion_', '');
        if (rawKey.startsWith('patron_')) targetKey = rawKey.replace('patron_', '');
        if (rawKey.startsWith('antecedente_')) targetKey = rawKey.replace('antecedente_', '');

        // Uniones especiales
        if (targetKey === 'ampolla' || targetKey === 'bula') targetKey = 'bula_ampolla';

        if (FEATURE_INDEX[targetKey] !== undefined) {
            X[FEATURE_INDEX[targetKey]] = 1;
            featureMap[targetKey] = 1;
        }
    }

    // 5. Features Compuestas (Interacciones Clínicas Críticas)
    // Estas variables permiten capturar la no-linealidad de ciertos síntomas
    if (featureMap.fiebre === 1 && featureMap.purpura === 1) {
        X[FEATURE_INDEX.interaccion_fiebre_purpura] = 1;
        featureMap.interaccion_fiebre_purpura = 1;
    }
    if (featureMap.fiebre === 1 && featureMap.bula_ampolla === 1) {
        X[FEATURE_INDEX.interaccion_fiebre_ampolla] = 1;
        featureMap.interaccion_fiebre_ampolla = 1;
    }
    if (featureMap.inmunosupresion === 1 && featureMap.agudo === 1) {
        X[FEATURE_INDEX.interaccion_inmuno_agudo] = 1;
        featureMap.interaccion_inmuno_agudo = 1;
    }
    if (featureMap.dolor === 1 && featureMap.agudo === 1) {
        X[FEATURE_INDEX.interaccion_dolor_agudo] = 1;
        featureMap.interaccion_dolor_agudo = 1;
    }

    // 6. Creación del Helper y retorno unificado
    const helper = createFeatureHelper(X);

    return {
        X: X,
        featureMap: featureMap,
        helper: helper
    };
}

/**
 * Crea un helper con métodos semánticos para consultar features
 */
export function createFeatureHelper(X) {
    return {
        has: (key) => X[FEATURE_INDEX[key]] === 1,
        get: (key) => X[FEATURE_INDEX[key]],
        X: X
    };
}

/**
 * Utilidad para mapear fototipo a romano (I-VI)
 */
function romanize(num) {
    const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
    return map[num] || 'I';
}
