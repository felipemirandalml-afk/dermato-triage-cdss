import fs from 'fs';

// 1. Cargar Datos
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

// 2. Inferrer
function inferSyndrome(name) {
    name = name.toLowerCase();
    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === name)) return sId;
    }
    return 'inflammatory_dermatosis_other';
}

const syndPop = {};
for (const [disease] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    syndPop[sId] = (syndPop[sId] || 0) + 1;
}

// 3. Analizar Pares v2
const pairStats = {}; // { X_Y: { global, syndromes: { sId: n } } }
for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    const feats = Object.entries(profile).filter(([f, p]) => p > 0.15).map(([f]) => f);
    for (let i = 0; i < feats.length; i++) {
        for (let j = i + 1; j < feats.length; j++) {
            const key = [feats[i], feats[j]].sort().join('___');
            if (!pairStats[key]) pairStats[key] = { global: 0, syndromes: {} };
            pairStats[key].global++;
            pairStats[key].syndromes[sId] = (pairStats[key].syndromes[sId] || 0) + 1;
        }
    }
}

const pairScoresv2 = [];
const globalN = Object.keys(profiles).length;

for (const [key, stats] of Object.entries(pairStats)) {
    if (stats.global < 3) continue;
    const freqGlobal = stats.global / globalN;
    
    const syndromeRatios = [];
    for (const [sId, count] of Object.entries(stats.syndromes)) {
        const freqInSynd = count / syndPop[sId];
        syndromeRatios.push({ sId, rpr: freqInSynd / freqGlobal });
    }
    syndromeRatios.sort((a,b) => b.rpr - a.rpr);
    const top = syndromeRatios[0];

    pairScoresv2.push({
        pair: key.replace('___', ' + '),
        rpr: top.rpr.toFixed(2),
        top_syndrome: top.sId,
        lc_score: (top.rpr / 2).toFixed(2) // Scale normalization
    });
}

pairScoresv2.sort((a,b) => b.rpr - a.rpr);
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_pair_scores_v2.json', JSON.stringify(pairScoresv2, null, 2));

// 4. Analizar Tríadas v2
// (Similar logic simplified for triplets)
const tripletStats = {};
for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    const feats = Object.entries(profile).filter(([f, p]) => p > 0.15).map(([f]) => f);
    if (feats.length < 3) continue;
    for (let i = 0; i < feats.length; i++) {
        for (let j = i + 1; j < feats.length; j++) {
            for (let k = j + 1; k < feats.length; k++) {
                const key = [feats[i], feats[j], feats[k]].sort().join('___');
                if (!tripletStats[key]) tripletStats[key] = { global: 0, syndromes: {} };
                tripletStats[key].global++;
                tripletStats[key].syndromes[sId] = (tripletStats[key].syndromes[sId] || 0) + 1;
            }
        }
    }
}

const tripletScoresv2 = [];
for (const [key, stats] of Object.entries(tripletStats)) {
    if (stats.global < 3) continue;
    const freqGlobal = stats.global / globalN;
    const syndromeRatios = [];
    for (const [sId, count] of Object.entries(stats.syndromes)) {
        const freqInSynd = count / syndPop[sId];
        syndromeRatios.push({ sId, rpr: freqInSynd / freqGlobal });
    }
    syndromeRatios.sort((a,b) => b.rpr - a.rpr);
    const top = syndromeRatios[0];

    tripletScoresv2.push({
        triplet: key.replace(/___/g, ' + '),
        rpr: top.rpr.toFixed(2),
        top_syndrome: top.sId,
        incremental_gain: (top.rpr / 5).toFixed(2)
    });
}

tripletScoresv2.sort((a,b) => b.rpr - a.rpr);
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_triplet_scores_v2.json', JSON.stringify(tripletScoresv2, null, 2));

console.log("=== EVIDENCIA CONTEXTUAL v2.0 REGENERADA ===");
