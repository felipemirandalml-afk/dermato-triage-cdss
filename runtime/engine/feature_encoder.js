/**
 * feature_encoder.js - Single Source of Truth para la transformación de features.
 * Transforma formData de la UI en representaciones numéricas y semánticas.
 */
import { FEATURE_INDEX, PROBABILISTIC_FEATURES } from './constants.js';
import conceptMapper from './concept_mapper.js';

export function encodeFeatures(formData) {
    // 1. Inicializar vector X con el tamaño del diccionario total
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    const featureMap = {};
    const unknownKeys = [];

    // 2. Mapeos de Datos Básicos y Demografía (Mapeo Explícito)
    const age = parseFloat(formData.age) || 0;
    X[FEATURE_INDEX.edad] = age;
    featureMap.edad = age;

    const fitzpatrick = parseInt(formData.fitzpatrick) || 1;
    // Removida asignación a X[fototipo] por no ser canónico en este modelo
    featureMap.fitzpatrick = fitzpatrick;

    // Expansión de Dummies de Fitzpatrick (v1 numérica y v2 romana para alineación con modelo)
    const fitzKeys = [`ft_${romanize(fitzpatrick)}`, `ft_${fitzpatrick}`];
    fitzKeys.forEach(k => {
        if (FEATURE_INDEX[k] !== undefined) {
            X[FEATURE_INDEX[k]] = 1;
            featureMap[k] = 1;
        }
    });

    // Sexo (Unificado)
    if (formData.sex === 'male') {
        X[FEATURE_INDEX.sexo_male] = 1;
        featureMap.sexo_male = 1;
    } else if (formData.sex === 'female') {
        X[FEATURE_INDEX.sexo_female] = 1;
        featureMap.sexo_female = 1;
    }

    // 3. Mapeo de Timing
    const timingMap = { 'acute': 'agudo', 'subacute': 'subagudo', 'chronic': 'cronico' };
    if (formData.timing && timingMap[formData.timing]) {
        const key = timingMap[formData.timing];
        X[FEATURE_INDEX[key]] = 1;
        featureMap[key] = 1;
    }

    // 4. Mapeo de Morfología, Topografía y Contexto (Capa Canónica + Legacy)
    for (const [rawKey, value] of Object.entries(formData)) {
        if (['age', 'sex', 'fitzpatrick', 'timing'].includes(rawKey)) continue;
        if (value !== true) continue;

        const canonicalId = conceptMapper.resolve(rawKey);
        
        if (canonicalId) {
            // Evaluamos si el ID es reconocido por el motor en su INDEX
            if (FEATURE_INDEX[canonicalId] !== undefined) {
                // Feature Válida (Probabilística o Registrada como Adicional)
                X[FEATURE_INDEX[canonicalId]] = 1;
            } else {
                // ID desconocido para el vector final, guardamos para logs/debug
                unknownKeys.push(rawKey);
            }
            // Siempre se registra en el mapa de hallazgos (Para heurísticas / differential ranker)
            featureMap[canonicalId] = 1;
        }
    }

    // 5. Features Compuestas (Interacciones Clínicas Críticas)
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
    const helper = createFeatureHelper(X, featureMap);

    return {
        X: X,
        featureMap: featureMap,
        helper: helper,
        unknownKeys: unknownKeys
    };
}

/**
 * Crea un helper con métodos semánticos para consultar features.
 * Soporta resolución canónica en tiempo de consulta.
 */
export function createFeatureHelper(X, featureMap = {}) {
    return {
        has: (key) => {
            // 1. Intentar resolución canónica
            const resolvedId = conceptMapper.resolve(key) || key;

            // 2. Verificar en el vector base (Logistic Regression)
            const idx = FEATURE_INDEX[resolvedId];
            if (idx !== undefined && X && X[idx] === 1) return true;

            // 3. Verificar en el mapa extendido (Canonical/UI)
            if (featureMap[resolvedId] === 1 || featureMap[resolvedId] === true) return true;

            return false;
        },
        get: (key) => {
            const resolvedId = conceptMapper.resolve(key) || key;
            const idx = FEATURE_INDEX[resolvedId];
            if (idx !== undefined && X) return X[idx];
            return featureMap[resolvedId];
        },
        X: X,
        featureMap: featureMap
    };
}

/**
 * Utilidad para mapear fototipo a romano (I-VI)
 */
function romanize(num) {
    const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
    return map[num] || 'I';
}
