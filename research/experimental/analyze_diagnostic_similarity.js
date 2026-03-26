import fs from 'fs';

// 1. Cargar Perfiles
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const diseases = Object.keys(profiles);

console.log(`=== ANALIZANDO SIMILITUD ENTRE ${diseases.length} DIAGNÓSTICOS ===`);

// 2. Función de Similitud de Perfiles (Jaccard-like weighted)
function calculateSimilarity(d1, d2) {
    const p1 = profiles[d1];
    const p2 = profiles[d2];
    
    let intersection = 0;
    let union = 0;
    
    const allFeatures = new Set([...Object.keys(p1), ...Object.keys(p2)]);
    
    allFeatures.forEach(f => {
        const v1 = p1[f] || 0;
        const v2 = p2[f] || 0;
        intersection += Math.min(v1, v2);
        union += Math.max(v1, v2);
    });
    
    return union === 0 ? 0 : (intersection / union);
}

// 3. Matriz de Similitud y Detección de Colisiones
const collisions = [];

for (let i = 0; i < diseases.length; i++) {
    for (let j = i + 1; j < diseases.length; j++) {
        const sim = calculateSimilarity(diseases[i], diseases[j]);
        if (sim > 0.6) { // Umbral de alta confusión potencial
            collisions.push({ d1: diseases[i], d2: diseases[j], similarity: sim.toFixed(2) });
        }
    }
}

collisions.sort((a,b) => b.similarity - a.similarity);

console.log("--- Top Colisiones Semiológicas (Indistinguibles por Rasgos) ---");
console.table(collisions.slice(0, 20));

// 4. Agrupación por Clusters (Simple Connect-component)
const clusters = [];
const visited = new Set();

diseases.forEach(d => {
    if (!visited.has(d)) {
        const group = [d];
        visited.add(d);
        collisions.forEach(c => {
            if (c.d1 === d && !visited.has(c.d2)) { group.push(c.d2); visited.add(c.d2); }
            if (c.d2 === d && !visited.has(c.d1)) { group.push(c.d1); visited.add(c.d1); }
        });
        if (group.length > 1) clusters.push(group);
    }
});

console.log("--- Clusters Naturales Detectados ---");
clusters.forEach((g, i) => console.log(`Cluster ${i+1}: ${g.join(' | ')}`));

fs.writeFileSync('d:/dermato-triage-cdss/reports/nextgen_taxonomy_clusters_raw.json', JSON.stringify(clusters, null, 2));
console.log("=== ANÁLISIS COMPLETADO ===");
process.exit(0);
