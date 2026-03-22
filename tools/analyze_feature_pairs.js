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

const totalDiseases = Object.keys(profiles).length;
const pairStats = {}; // { X_Y: { count, syndromes: { sId: n } } }
const singleStats = {}; // { X: count }

console.log("=== ANALIZANDO COMBINACIONES SEMIOLÓGICAS (PARES) ===");

for (const [disease, profile] of Object.entries(profiles)) {
    const sId = inferSyndrome(disease);
    const features = Object.entries(profile).filter(([f, p]) => p > 0.15).map(([f]) => f);

    features.forEach(f => singleStats[f] = (singleStats[f] || 0) + 1);

    for (let i = 0; i < features.length; i++) {
        for (let j = i + 1; j < features.length; j++) {
            const key = [features[i], features[j]].sort().join('___');
            if (!pairStats[key]) pairStats[key] = { count: 0, syndromes: {} };
            pairStats[key].count++;
            pairStats[key].syndromes[sId] = (pairStats[key].syndromes[sId] || 0) + 1;
        }
    }
}

// 3. Calcular Muestras Informativas (Lift / Specificity)
const pairScores = [];
for (const [key, stats] of Object.entries(pairStats)) {
    if (stats.count < 3) continue; // Umbral de soporte mínimo

    const [f1, f2] = key.split('___');
    const lift = (stats.count / totalDiseases) / ((singleStats[f1] / totalDiseases) * (singleStats[f2] / totalDiseases));
    
    // Especificidad: ¿En cuántos síndromes distintos aparece el PAR?
    const syndromesPresent = Object.keys(stats.syndromes).length;
    const syndromeDiversity = syndromesPresent / Object.keys(syndromeMap).length;

    // Calcular Score: LC = Lift * (1 - syndromeDiversity)
    const lcScore = lift * (1 - syndromeDiversity); 

    let category = "ruido";
    if (lcScore > 10) category = "ancla_combinada_fuerte";
    else if (lcScore > 5) category = "señal_util";
    else if (lcScore > 2) category = "moderada";

    pairScores.push({
        pair: key.replace('___', ' + '),
        count: stats.count,
        lift: lift.toFixed(2),
        syndromes: syndromesPresent,
        lc_score: lcScore.toFixed(3),
        category: category,
        top_syndrome: Object.entries(stats.syndromes).sort((a,b) => b[1]-a[1])[0][0]
    });
}

// Sort by LC
pairScores.sort((a,b) => b.lc_score - a.lc_score);

// 4. Exportar
fs.writeFileSync('d:/dermato-triage-cdss/data/feature_pair_scores.json', JSON.stringify(pairScores, null, 2));

// Reporte
let report = `# Análisis de Pares Semiológicos (Phase 13)\n\n`;
report += `| Par de Rasgos | Count | Lift | Div. Sindrómica | LC Score | Categoría |\n`;
report += `| :--- | :---: | :---: | :---: | :---: | :--- |\n`;
pairScores.slice(0, 50).forEach(s => {
    report += `| ${s.pair} | ${s.count} | ${s.lift} | ${s.syndromes} | ${s.lc_score} | ${s.category.toUpperCase()} |\n`;
});

fs.writeFileSync('d:/dermato-triage-cdss/reports/feature_pair_analysis.md', report);

console.log("Análisis completado en data/ y reports/");
process.exit(0);
