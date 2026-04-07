import baseWeights from '../data/statistical_base_weights_fit_v2.json' with { type: 'json' };
import pairModulators from '../data/contextual_pair_modulators_v2.json' with { type: 'json' };
import tripletModulators from '../data/contextual_triplet_modulators_v2.json' with { type: 'json' };
import syndromeBoosters from '../data/syndrome_boosters_fit_v2.json' with { type: 'json' };
import biasCorrections from '../data/classwise_bias_corrections_v1.json' with { type: 'json' };
import discScoresRaw from '../data/feature_discriminative_scores_v2.json' with { type: 'json' };

/**
 * RECALIBRATION ENGINE v1.3 (Browser-Compatible)
 * Migrado de fs.readFileSync a static JSON imports para compatibilidad con el navegador.
 */

const discScores = Array.isArray(discScoresRaw) ? discScoresRaw : [];

let activeBaseWeights = baseWeights;

export const recalibrationEngine = {
    setWeights: (newWeights) => { activeBaseWeights = newWeights; },
    getBaseWeight: (cid) => {
        return activeBaseWeights[cid] || 0.0;
    },
    getSyndromeForFeature: (cid) => {
        const info = discScores.find(d => d.feature === cid);
        return info ? info.top_syndrome : null;
    },
    getBiasCorrection: (sid) => {
        return biasCorrections[sid] || 1.0;
    },

    calculateBoosts: (features) => {
        let boost = 1.0;
        const matchedTriplets = [];
        const matchedPairs = [];

        for (let i = 0; i < features.length; i++) {
            for (let j = i + 1; j < features.length; j++) {
                for (let k = j + 1; k < features.length; k++) {
                    const key = [features[i], features[j], features[k]].sort().join('___');
                    if (tripletModulators[key]) {
                        boost *= Math.min(2.0, 1.0 + (tripletModulators[key] / 5));
                        matchedTriplets.push(key);
                    }
                }
            }
        }

        for (let i = 0; i < features.length; i++) {
            for (let j = i + 1; j < features.length; j++) {
                const key = [features[i], features[j]].sort().join('___');
                if (pairModulators[key]) {
                    const inTriplet = matchedTriplets.some(t => t.includes(features[i]) && t.includes(features[j]));
                    if (!inTriplet) {
                        boost *= (1.0 + (pairModulators[key] / 10));
                        matchedPairs.push(key);
                    }
                }
            }
        }

        return { boost, matchedTriplets, matchedPairs };
    },

    /**
     * Retorna el mejor boost sindrómico por cada categoría, evitando redundancia.
     */
    getSyndromeBoosts: (features) => {
        const bestBySyndrome = {}; // { syndrome: maxBoost }

        for (let i = 0; i < features.length; i++) {
            for (let j = i + 1; j < features.length; j++) {
                for (let k = j + 1; k < features.length; k++) {
                    const key = [features[i], features[j], features[k]].sort().join('___');
                    if (syndromeBoosters[key]) {
                        const sb = syndromeBoosters[key];
                        if (!bestBySyndrome[sb.syndrome] || sb.boost > bestBySyndrome[sb.syndrome]) {
                            bestBySyndrome[sb.syndrome] = sb.boost;
                        }
                    }
                }
            }
        }

        return Object.entries(bestBySyndrome).map(([s, b]) => ({ syndrome: s, boost: b }));
    }
};
