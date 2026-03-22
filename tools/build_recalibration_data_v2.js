import fs from 'fs';

// 1. Cargar Evidencia v2
const scoresv2 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_discriminative_scores_v2.json', 'utf8'));
const pairScoresv2 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_pair_scores_v2.json', 'utf8'));
const tripletScoresv2 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_triplet_scores_v2.json', 'utf8'));

console.log("=== GENERANDO ARTEFACTOS OPERATIVOS v2 ===");

// 2. Base Weights v2
const baseWeightsV2 = {};
scoresv2.forEach(s => {
    // Escalamiento logarítmico del RPR para pesos diferenciales
    baseWeightsV2[s.feature] = parseFloat(s.dp_score);
});
fs.writeFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_v2.json', JSON.stringify(baseWeightsV2, null, 2));

// 3. Pair Modulators v2
const pairModulatorsV2 = {};
pairScoresv2.forEach(p => {
    const key = p.pair.replace(' + ', '___');
    pairModulatorsV2[key] = parseFloat(p.lc_score);
});
fs.writeFileSync('d:/dermato-triage-cdss/data/contextual_pair_modulators_v2.json', JSON.stringify(pairModulatorsV2, null, 2));

// 4. Triplet Modulators v2
const tripletModulatorsV2 = {};
tripletScoresv2.forEach(t => {
    const key = t.triplet.replace(/ \+ /g, '___');
    tripletModulatorsV2[key] = parseFloat(t.incremental_gain);
});
fs.writeFileSync('d:/dermato-triage-cdss/data/contextual_triplet_modulators_v2.json', JSON.stringify(tripletModulatorsV2, null, 2));

// 5. Syndrome Boosters v2
const syndromeBoostersV2 = {};
tripletScoresv2.forEach(t => {
    // Solo tríadas con RPR alto actúan como sindrómicos
    if (parseFloat(t.rpr) > 3.0) {
        const key = t.triplet.replace(/ \+ /g, '___');
        syndromeBoostersV2[key] = {
            syndrome: t.top_syndrome,
            boost: Math.min(0.5, parseFloat(t.incremental_gain) * 0.5) 
        };
    }
});
fs.writeFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_v2.json', JSON.stringify(syndromeBoostersV2, null, 2));

console.log("=== ARTEFACTOS v2 GENERADOS EXITOSAMENTE ===");
