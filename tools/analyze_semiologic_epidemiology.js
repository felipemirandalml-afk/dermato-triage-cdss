import fs from 'fs';

// 1. Cargar Archivos
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

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

// 3. Análisis Global
const totalDiseases = Object.keys(profiles).length;
const featureStats = {}; // { feat: { globalCount, syndromeCounts: { sId: count }, diseases: [] } }

console.log("=== ANALIZANDO EPIDEMIOLOGÍA SEMIOLÓGICA (4,426 perfiles) ===");

for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    for (const [feat, prob] of Object.entries(profile)) {
        if (prob < 0.1) continue; // Umbral de relevancia

        if (!featureStats[feat]) featureStats[feat] = { globalCount: 0, syndromeCounts: {}, diseases: [] };
        featureStats[feat].globalCount++;
        featureStats[feat].syndromeCounts[sId] = (featureStats[feat].syndromeCounts[sId] || 0) + 1;
        featureStats[feat].diseases.push({ name: disease, prob });
    }
}

// 4. Calcular Poder Discriminativo (Mutual Information / Specificity)
const discriminativeScores = [];
for (const [feat, stats] of Object.entries(featureStats)) {
    // Especificidad: ¿En cuántos síndromes distintos aparece?
    const syndromesPresent = Object.keys(stats.syndromeCounts).length;
    const syndromeDiversity = syndromesPresent / Object.keys(syndromeMap).length;
    
    // Calcular Score: DP = 1 - (syndromeDiversity)
    // Pero ponderado por frecuencia global. Si es muy raro y muy específico, es un "Ancla".
    const rarity = stats.globalCount / totalDiseases;
    const dpScore = (1 - syndromeDiversity) * (1 - rarity); 

    let category = "ruido";
    if (dpScore > 0.8) category = "ancla_absoluta";
    else if (dpScore > 0.6) category = "altamente_especifico";
    else if (dpScore > 0.3) category = "util_compartido";
    
    discriminativeScores.push({
        feature: feat,
        global_freq: (rarity * 100).toFixed(2) + "%",
        syndrome_diversity: syndromesPresent,
        dp_score: dpScore.toFixed(3),
        category: category,
        top_syndrome: Object.entries(stats.syndromeCounts).sort((a,b) => b[1]-a[1])[0][0]
    });
}

// Sort by DP
discriminativeScores.sort((a,b) => b.dp_score - a.dp_score);

// 5. Exportar Resultados
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_discriminative_scores.json', JSON.stringify(discriminativeScores, null, 2));

// Resumen Markdown
let report = `# Análisis de Discriminación de Features (Fase 12)\n\n`;
report += `Total Diagnósticos Analizados: ${totalDiseases}\n\n`;
report += `| Feature | Freq Global | Síndromes | DP Score | Categoría |\n`;
report += `| :--- | :---: | :---: | :---: | :--- |\n`;
discriminativeScores.slice(0, 50).forEach(s => {
    report += `| ${s.feature} | ${s.global_freq} | ${s.syndrome_diversity} | ${s.dp_score} | ${s.category.toUpperCase()} |\n`;
});

fs.writeFileSync('d:/dermato-triage-cdss/reports/feature_discrimination_analysis.md', report);

console.log("Análisis completado en data/ y reports/");
process.exit(0);
