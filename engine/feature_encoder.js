/**
 * feature_encoder.js - Single Source of Truth para la transformación de features.
 * Transforma formData de la UI en representaciones numéricas y semánticas.
 */
import { FEATURE_INDEX, PROBABILISTIC_FEATURES, FEATURE_ALIASES } from './constants.js';

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

    // Expansión de Dummies de Fitzpatrick (ft_I...ft_VI)
    const ftKey = `ft_${romanize(fitzpatrick)}`;
    if (FEATURE_INDEX[ftKey] !== undefined) {
        X[FEATURE_INDEX[ftKey]] = 1;
        featureMap[ftKey] = 1;
    }

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

    // 4. Mapeo de Morfología, Topografía y Contexto (Sin lógica de prefijos implícitos)
    for (const [rawKey, value] of Object.entries(formData)) {
        // Ignorar campos ya procesados de forma especial y valores no activados
        if (['age', 'sex', 'fitzpatrick', 'timing'].includes(rawKey)) continue;
        if (value !== true) continue;

        let targetKey = null;

        // A. Intentar mapeo directo primero (Canonical Search)
        if (FEATURE_INDEX[rawKey] !== undefined) {
            targetKey = rawKey;
        } 
        // B. Intentar mapeo por alias explícitos (Dictionary Search)
        else if (FEATURE_ALIASES[rawKey] !== undefined) {
            targetKey = FEATURE_ALIASES[rawKey];
        }
        // C. Si no hay match, registrar como desconocido para auditoría
        else {
            unknownKeys.push(rawKey);
            continue;
        }

        // Aplicar activación en vector y mapa unificado
        if (targetKey && FEATURE_INDEX[targetKey] !== undefined) {
            X[FEATURE_INDEX[targetKey]] = 1;
            featureMap[targetKey] = 1;
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
    const helper = createFeatureHelper(X);

    return {
        X: X,
        featureMap: featureMap,
        helper: helper,
        unknownKeys: unknownKeys
    };
}

/**
 * Crea un helper con métodos semánticos para consultar features
 */
export function createFeatureHelper(X) {
    return {
        has: (key) => {
            const idx = FEATURE_INDEX[key];
            if (idx === undefined) return false;
            return X[idx] === 1;
        },
        get: (key) => {
            const idx = FEATURE_INDEX[key];
            if (idx === undefined) return undefined;
            return X[idx];
        },
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
