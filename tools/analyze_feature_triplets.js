import fs from 'fs';

// 1. Cargar Archivos
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));
const pairScores = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/feature_pair_scores.json', 'utf8'));

const totalDiseases = Object.keys(profiles).length;
const tripletStats = {}; // { X_Y_Z: { count, syndromes: { sId: n } } }
const pairMap = {}; // { X_Y: score }
pairScores.forEach(p => pairMap[p.pair.split(' + ').sort().join('___')] = parseFloat(p.lc_score));

// 2. Syndrome Inferrer (Heurístico)
function inferSyndrome(name) {
    name = name.toLowerCase();
    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === name)) return sId;
    }
    if (name.includes('eczema') || name.includes('dermatitis')) return 'eczema_dermatitis';
    if (name.includes('carcinoma') || name.includes('melanoma')) return 'cutaneous_tumor_suspected';
    if (name.includes('herpes') || name.includes('viral')) return 'viral_skin_infection';
    if (name.includes('cellulitis') || name.includes('abscess')) return 'bacterial_skin_infection';
    if (name.includes('tinea') || name.includes('micosis')) return 'fungal_skin_infection';
    return 'inflammatory_dermatosis_other';
}

console.log("=== ANALIZANDO TRÍADAS SEMIOLÓGICAS (4,426 perfiles) ===");

for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    const features = Object.entries(profile).filter(([f, p]) => p > 0.15).map(([f]) => f);

    if (features.length < 3) continue;

    for (let i = 0; i < features.length; i++) {
        for (let j = i + 1; j < features.length; j++) {
            for (let k = j + 1; k < features.length; k++) {
                const key = [features[i], features[j], features[k]].sort().join('___');
                if (!tripletStats[key]) tripletStats[key] = { count: 0, syndromes: {} };
                tripletStats[key].count++;
                tripletStats[key].syndromes[sId] = (tripletStats[key].syndromes[sId] || 0) + 1;
            }
        }
    }
}

// 3. Calcular Ganancia Incremental (v2.0)
const tripletScores = [];
for (const [key, stats] of Object.entries(tripletStats)) {
    if (stats.count < 3) continue; // Umbral de soporte mínimo

    const [f1, f2, f3] = key.split('___');
    const p12 = pairMap[[f1, f2].sort().join('___')] || 1;
    const p13 = pairMap[[f1, f3].sort().join('___')] || 1;
    const p23 = pairMap[[f2, f3].sort().join('___')] || 1;
    const bestPairScore = Math.max(p12, p13, p23);
    const incrementalGain = (stats.count / bestPairScore);

    let category = "baja_ganancia";
    if (incrementalGain > 3) category = "gestalt_fuerte";
    else if (incrementalGain > 1.5) category = "gestalt_util";

    const topSyndrome = Object.entries(stats.syndromes).sort((a,b) => b[1]-a[1])[0][0];

    tripletScores.push({
        triplet: key.replace(/___/g, ' + '),
        count: stats.count,
        best_pair_score: bestPairScore.toFixed(2),
        incremental_gain: incrementalGain.toFixed(2),
        category: category,
        top_syndrome: topSyndrome
    });
}

tripletScores.sort((a,b) => b.incremental_gain - a.incremental_gain);
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_triplet_scores.json', JSON.stringify(tripletScores, null, 2));

console.log("Análisis completado en data/");
process.exit(0);
