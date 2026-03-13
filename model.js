/**
 * model.js - Orquestador del Motor Clínico CDSS
 * Arquitectura modular FASE 1
 */

import { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI } from './engine/constants.js';
import { encodeFeatures, createFeatureHelper } from './engine/feature_encoder.js';
import { predictBaseline } from './engine/baseline_model.js';
import { applySafetyModifiers, applyBlockModifiers } from './engine/safety_modifiers.js';
import { applyContextModifiers, applyRefinementModifiers } from './engine/context_modifiers.js';
import { interpretResult, explain, buildResult } from './engine/interpreter.js';
import { predictProbabilisticSyndrome } from './engine/probabilistic_model.js';

// Re-exports para compatibilidad
export { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI, encodeFeatures, explain, interpretResult };

/**
 * Función principal de inferencia (API unificada)
 * Implementa el pipeline clínico en el orden canónico para preservar comportamiento.
 */
export function predict(X) {
    const baseline = predictBaseline(X, FEATURE_INDEX);
    const helper = createFeatureHelper(X);
    
    // Pipeline de Modificadores (Secuencial con "Early Return" si hay coincidencia de regla)
    
    // 1. Capa de Seguridad Crítica (Morfología)
    const safety = applySafetyModifiers(helper, baseline);
    if (safety && safety.match) return buildResult(safety.priority, safety.modifier, baseline);
    
    // 2. Capa de Contexto Sistémico
    const context = applyContextModifiers(helper, baseline);
    if (context && context.match) return buildResult(context.priority, context.modifier, baseline);
    
    // 3. Capa de Bloqueo (Escudos de Malignidad/Reacciones Urgentes)
    const block = applyBlockModifiers(helper, baseline);
    if (block && block.match) return buildResult(block.priority, block.modifier, baseline);
    
    // 4. Capa de Refinamiento (Downscales controlados)
    const refinement = applyRefinementModifiers(helper, baseline);
    if (refinement && refinement.match) return buildResult(refinement.priority, refinement.modifier, baseline);
    
    // Si ningún modificador aplica, retornamos el baseline estadístico
    return baseline;
}

/**
 * API de alto nivel para triage
 */
export function runTriage(formData) {
    const X = encodeFeatures(formData);
    const prediction = predict(X);
    const result = interpretResult(X, prediction);
    
    // Nueva capa: Inferencia de Síndrome Probabilístico
    result.probabilistic_analysis = predictProbabilisticSyndrome(formData);
    
    return result;
}

// Compatibilidad con validadores externos
export function applyClinicalModifiers(X, result) {
    return predict(X);
}
