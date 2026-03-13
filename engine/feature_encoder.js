/**
 * feature_encoder.js - Transformación de inputs brutos a features del motor
 */
import { FEATURE_INDEX } from './constants.js';

export function encodeFeatures(formData) {
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    
    // Mapeo dinámico: busca IDs del formData en el FEATURE_INDEX
    for (const [key, value] of Object.entries(formData)) {
        // Mapeos numéricos/especiales
        if (key === 'age') {
            X[FEATURE_INDEX.edad] = (parseFloat(value) || 0) / 100;
            continue;
        }
        if (key === 'fitzpatrick') {
            X[FEATURE_INDEX.fototipo] = parseInt(value) || 1;
            continue;
        }

        // Mapeos booleanos
        if (FEATURE_INDEX[key] !== undefined) {
            if (typeof value === 'boolean') {
                X[FEATURE_INDEX[key]] = value ? 1 : 0;
            }
        }
    }

    // Mapeo de Timing (radiogroup en UI)
    if (formData.timing) {
        if (formData.timing === 'acute') X[FEATURE_INDEX.tiempo_agudo] = 1;
        if (formData.timing === 'subacute') X[FEATURE_INDEX.tiempo_subagudo] = 1;
        if (formData.timing === 'chronic') X[FEATURE_INDEX.tiempo_cronico] = 1;
    }

    return X;
}

/**
 * Crea un helper con métodos semánticos para consultar features
 * Evita depender de FEATURE_INDEX[key] en la lógica de modifiers
 */
export function createFeatureHelper(X) {
    return {
        has: (key) => X[FEATURE_INDEX[key]] === 1,
        get: (key) => X[FEATURE_INDEX[key]],
        X: X
    };
}
