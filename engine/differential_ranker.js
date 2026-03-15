/**
 * differential_ranker.js - Optimizador de diagnósticos diferenciales
 * Aplica reglas de hallazgos cardinales para reordenar y refinar la ontología Derm1M.
 */

import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { createFeatureHelper, encodeFeatures } from './feature_encoder.js';

/**
 * Procesa la información de la ontología aplicando el conocimiento dermatológico cardinal.
 * 
 * @param {Object} formData - Datos brutos del formulario
 * @param {Object} result - Objeto de resultado generado por runTriage
 * @returns {Object} El objeto ontology_info modificado (o el original si no aplica nada)
 */
export function rankDifferentials(formData, result) {
    if (!result.ontology_info) return null;

    const X = encodeFeatures(formData);
    const helper = createFeatureHelper(X);
    const ontologyInfo = { ...result.ontology_info };
    const matchedRules = [];

    // 1. Identificar reglas que aplican
    for (const rule of CARDINAL_FEATURE_RULES) {
        if (rule.conditions(helper)) {
            matchedRules.push(rule);
        }
    }

    if (matchedRules.length === 0) return ontologyInfo;

    // 2. Aplicar boosts y supresiones
    let differentials = [...ontologyInfo.differentials];

    matchedRules.forEach(rule => {
        // Boost: mover al inicio (procesado en reverso para mantener prioridad del array de la regla)
        [...rule.boost_differentials].reverse().forEach(target => {
            const index = differentials.findIndex(d => d.toLowerCase().includes(target.toLowerCase()));
            if (index !== -1) {
                const [item] = differentials.splice(index, 1);
                differentials.unshift(item);
            } else {
                // Si no estaba en el diferencial original, añadirlo al inicio (enriquecimiento)
                differentials.unshift(target);
            }
        });

        // Suppress: mover al final o eliminar (aquí los movemos al final para ser conservadores)
        if (rule.suppress_differentials) {
            rule.suppress_differentials.forEach(target => {
                const index = differentials.findIndex(d => d.toLowerCase().includes(target.toLowerCase()));
                if (index !== -1) {
                    const [item] = differentials.splice(index, 1);
                    differentials.push(item);
                }
            });
        }
    });

    // Limpiar duplicados manteniendo orden
    ontologyInfo.differentials = [...new Set(differentials)];
    
    // Añadir metadatos de las reglas aplicadas para que la UI pueda destacarlas
    ontologyInfo.applied_cardinal_rules = matchedRules.map(r => ({
        label: r.label,
        rationale: r.rationale
    }));

    return ontologyInfo;
}
