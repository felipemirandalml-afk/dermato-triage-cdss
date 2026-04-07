import { FEATURE_INDEX, PROBABILISTIC_FEATURES, EXTRA_FEATURE_INDEX } from './constants.js';
import conceptMapper from './concept_mapper.js';

export function encodeFeatures(formData) {
    // 1. Inicializar vector X con el tamaño del diccionario total definido en constants.js
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    const featureMap = {};
    const unknownKeys = [];

    // 2. Mapeos de Datos Básicos (Mapeo Explícito Numérico/Categoría)
    
    // Edad
    const age = parseFloat(formData.age) || 0;
    if (FEATURE_INDEX.edad !== undefined) {
        X[FEATURE_INDEX.edad] = age;
        featureMap.edad = age;
    }

    // Fototipo
    const fitzpatrick = parseInt(formData.fitzpatrick) || 1;
    featureMap.fitzpatrick = fitzpatrick;
    const fitzKeys = [`ft_${romanize(fitzpatrick)}`, `ft_${fitzpatrick}`];
    fitzKeys.forEach(k => {
        if (FEATURE_INDEX[k] !== undefined) {
            X[FEATURE_INDEX[k]] = 1;
            featureMap[k] = 1;
        }
    });

    // Sexo (Unificado via Index para Motor Heurístico/Seguridad)
    const sexId = formData.sex === 'male' ? 'sexo_male' : (formData.sex === 'female' ? 'sexo_female' : null);
    if (sexId) {
        if (FEATURE_INDEX[sexId] !== undefined) X[FEATURE_INDEX[sexId]] = 1;
        featureMap[sexId] = 1;
    }

    // 3. Mapeo de Hallazgos y Temporalidad (Resolución vía Schema)
    // Extraemos las claves activas del nuevo contrato { metadata, features }
    const activeKeys = [];
    
    // A. Añadir timing si existe
    if (formData.timing) {
        activeKeys.push(formData.timing);
    }
    
    // B. Añadir features si vienen en la estructura oficial v2.1 (Segmentada)
    if (formData.features) {
        for (const [rawKey, value] of Object.entries(formData.features)) {
            if (value === true) activeKeys.push(rawKey);
        }
    } else {
        // Fallback por si llega un objeto plano (V1 Legacy Support)
        for (const [rawKey, value] of Object.entries(formData)) {
            if (['age', 'sex', 'fitzpatrick', 'timing'].includes(rawKey)) continue;
            if (typeof value === 'string' && value !== 'on') {
                activeKeys.push(value); 
            } else if (value === true) {
                activeKeys.push(rawKey);
            }
        }
    }

    // Resolviendo cada clave activa usando el Mapper SSoT
    activeKeys.forEach(lookupKey => {
        const canonicalId = conceptMapper.resolve(lookupKey);
        
        if (canonicalId) {
            if (FEATURE_INDEX[canonicalId] !== undefined) {
                X[FEATURE_INDEX[canonicalId]] = 1;
            } else if (EXTRA_FEATURE_INDEX[canonicalId] === undefined) {
                unknownKeys.push(lookupKey);
            }
            featureMap[canonicalId] = 1;
        }
    });

    // 4. Features Compuestas (Interacciones Clínicas Críticas)
    // Se mantienen explícitas por seguridad diagnóstica
    const interactions = [
        { condition: featureMap.fiebre && featureMap.purpura, id: 'interaccion_fiebre_purpura' },
        { condition: featureMap.fiebre && featureMap.bula_ampolla, id: 'interaccion_fiebre_ampolla' },
        { condition: featureMap.inmunosupresion && featureMap.agudo, id: 'interaccion_inmuno_agudo' },
        { condition: featureMap.dolor && featureMap.agudo, id: 'interaccion_dolor_agudo' }
    ];

    interactions.forEach(inter => {
        if (inter.condition && FEATURE_INDEX[inter.id] !== undefined) {
            X[FEATURE_INDEX[inter.id]] = 1;
            featureMap[inter.id] = 1;
        }
    });

    // 5. Creación del Helper y retorno unificado
    const helper = createFeatureHelper(X, featureMap);

    return { X, featureMap, helper, unknownKeys };
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
