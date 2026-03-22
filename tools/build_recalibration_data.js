import fs from 'fs';

// 1. Cargar Evidencia
const discriminative = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_discriminative_scores.json', 'utf8'));
const pairs = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_pair_scores.json', 'utf8'));
const triplets = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_triplet_scores.json', 'utf8'));

// 2. Mapas de referencia
const dpMap = {};
discriminative.forEach(d => dpMap[d.feature] = parseFloat(d.dp_score));

// 3. Generar Pesos Basales (Base Weights)
const baseWeights = {};
discriminative.forEach(d => {
    let w = parseFloat(d.dp_score);
    if (w < 0.2) w = 0.2; 
    baseWeights[d.feature] = w;
});

// 4. Generar Moduladores de Pares (Pair Modulators)
const pairModulators = {};
pairs.filter(p => parseFloat(p.lc_score) > 3).forEach(p => {
    pairModulators[p.pair.replace(' + ', '___')] = parseFloat(p.lc_score) / 5;
});

// 5. Generar Moduladores de Tríadas (Triplet Modulators) y Boosters
const tripletModulators = {};
const syndromeBoosters = {};

triplets.filter(t => parseFloat(t.incremental_gain) > 2).forEach(t => {
    const key = t.triplet.replace(/ \+ /g, '___');
    tripletModulators[key] = parseFloat(t.incremental_gain) / 10;
    
    // FILTRO DE CALIDAD: Solo boostear si al menos un rasgo tiene DP decente (> 0.2)
    // Evita que el trío del ruido (eritema+papula+mancha) nos emborrache
    const feats = key.split('___');
    const hasSignal = feats.some(f => (dpMap[f] || 0) > 0.2);

    if (t.category === 'gestalt_fuerte' && hasSignal) {
        syndromeBoosters[key] = {
            syndrome: t.top_syndrome,
            boost: Math.min(0.5, parseFloat(t.incremental_gain) / 100)
        };
    }
});

// 6. Guardar Artefactos
fs.writeFileSync('d:/dermato-triage-cdss/data/statistical_base_weights.json', JSON.stringify(baseWeights, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/contextual_pair_modulators.json', JSON.stringify(pairModulators, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/contextual_triplet_modulators.json', JSON.stringify(tripletModulators, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/syndrome_boosters.json', JSON.stringify(syndromeBoosters, null, 2));

console.log("=== ARTEFACTOS DE RECALIBRACIÓN GENERADOS (v1.2 - Filtro de Ruido) ===");
console.log(`- Syndrome Boosters (Filtrados): ${Object.keys(syndromeBoosters).length} (De 636)`);
