import fs from 'fs';

// 1. Cargar Datos
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

// 2. Fragmentación Quirúrgica (Heurística p/ normalización v2)
function inferSyndromeV2(name) {
    name = name.toLowerCase();
    
    // Fragmentación Prioritaria: Acné / Rosácea
    if (name.includes('acne') || name.includes('rosacea') || name.includes('folliculitis') || name.includes('hidradenitis')) {
        return 'appendage_disorders_acne';
    }
    // Fragmentación: Parasitosis
    if (name.includes('scabies') || name.includes('insect bite') || name.includes('louse') || name.includes('tungiasis')) {
        return 'ectoparasitosis_scabies';
    }

    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === name)) return sId;
    }
    if (name.includes('eczema') || name.includes('dermatitis')) return 'eczema_dermatitis';
    return 'inflammatory_dermatosis_other';
}

// 3. Re-calcular Poblaciones con Fragmentación
const popV2 = {};
for (const [disease] of Object.entries(profiles)) {
    const sId = inferSyndromeV2(disease);
    popV2[sId] = (popV2[sId] || 0) + 1;
}

// 4. Calcular Frecuencias
const statsV2 = {}; 
for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndromeV2(disease);
    for (const [feat, prob] of Object.entries(profile)) {
        if (prob > 0.15) {
            if (!statsV2[feat]) statsV2[feat] = { total: 0, syndromes: {} };
            statsV2[feat].total++;
            statsV2[feat].syndromes[sId] = (statsV2[feat].syndromes[sId] || 0) + 1;
        }
    }
}

// 5. Aplicar RPR Refinado (con boost por exclusividad)
const globalN = Object.keys(profiles).length;
const discV2 = [];

for (const [feat, stats] of Object.entries(statsV2)) {
    const freqG = stats.total / globalN;
    const syndromeRatios = [];
    
    for (const [sId, count] of Object.entries(stats.syndromes)) {
        const freqS = count / popV2[sId];
        let rpr = freqS / freqG;
        
        // BOOST POR EXCLUSIVIDAD: Si el rasgo solo aparece en este síndrome, su valor es máximo
        if (Object.keys(stats.syndromes).length === 1) {
            rpr = Math.max(rpr, 10.0); // Forzar ancla absoluta si es único
        }
        
        syndromeRatios.push({ sId, rpr, freqS });
    }

    syndromeRatios.sort((a,b) => b.rpr - a.rpr);
    const top = syndromeRatios[0];
    let dp = Math.min(1.0, top.rpr / 10);
    
    let cat = "ruido";
    if (dp > 0.8) cat = "ancla_absoluta";
    else if (dp > 0.5) cat = "altamente_especifico";
    else if (dp > 0.2) cat = "util_compartido";

    discV2.push({
        feature: feat,
        rpr_top: top.rpr.toFixed(2),
        dp_score: dp.toFixed(3),
        category: cat,
        top_syndrome: top.sId,
        syndrome_diversity: Object.keys(stats.syndromes).length
    });
}

discV2.sort((a,b) => b.dp_score - a.dp_score);
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_discriminative_scores_v2.json', JSON.stringify(discV2, null, 2));

console.log("=== RE-NORMALIZACIÓN FRAGMENTADA COMPLETADA ===");
process.exit(0);
