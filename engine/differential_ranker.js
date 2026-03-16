/**
 * differential_ranker.js - Motor de Diagnóstico Diferencial Clínico
 * Calcula el Top 3 de enfermedades probables dentro de un síndrome.
 */

import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { SYNDROME_TO_ONTOLOGY_MAP } from './syndrome_to_ontology_map.js';

/**
 * Realiza el ranking de diagnósticos diferenciales para el síndrome detectado.
 * 
 * @param {string} syndromeKey - El síndrome ganador (ej: 'bacterial_skin_infection')
 * @param {Object} helper - FeatureHelper con los hallazgos del paciente
 * @returns {Array} Top 3 de diagnósticos diferenciales con scoring y justificación
 */
export function rankDifferentials(syndromeKey, helper) {
    const ontology = SYNDROME_TO_ONTOLOGY_MAP[syndromeKey];
    if (!ontology) return [];

    // 1. Inicializar scoring para cada enfermedad del síndrome
    const diseaseScores = ontology.differentials.map(diseaseName => ({
        disease_name: diseaseName,
        score: 0,
        matched_rules: []
    }));

    // 2. Ejecutar reglas cardinales y aplicar scoring
    for (const rule of CARDINAL_FEATURE_RULES) {
        if (rule.conditions(helper)) {
            diseaseScores.forEach(item => {
                // Boost: +3 (Puntaje estándar para hallazgo cardinal positivo)
                const isBoosted = rule.boost_differentials.some(b => 
                    item.disease_name.toLowerCase().includes(b.toLowerCase())
                );
                
                if (isBoosted) {
                    item.score += 3;
                    item.matched_rules.push(rule.label);
                }

                // Suppress: -3 (Puntaje estándar para hallazgo contradictorio)
                const isSuppressed = rule.suppress_differentials && rule.suppress_differentials.some(s => 
                    item.disease_name.toLowerCase().includes(s.toLowerCase())
                );

                if (isSuppressed) {
                    item.score -= 3;
                }
            });
        }
    }

    // 3. Ordenar por score (descendente)
    diseaseScores.sort((a, b) => b.score - a.score);

    // 4. Retornar Top 3
    return diseaseScores.slice(0, 3);
}
