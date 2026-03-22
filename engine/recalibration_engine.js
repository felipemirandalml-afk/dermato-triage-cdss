import fs from 'fs';

/**
 * RECALIBRATION ENGINE v1.2 (Phase 15)
 */

const baseWeights = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_fit_v2.json', 'utf8'));
const pairModulators = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/contextual_pair_modulators_v2.json', 'utf8'));
const tripletModulators = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/contextual_triplet_modulators_v2.json', 'utf8'));
const syndromeBoosters = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_fit_v2.json', 'utf8'));
const biasCorrections = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/classwise_bias_corrections_v1.json', 'utf8'));

let activeBaseWeights = baseWeights;

const discScores = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_discriminative_scores_v2.json', 'utf8'));

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
