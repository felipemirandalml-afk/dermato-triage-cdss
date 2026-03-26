import fs from 'fs';

// 1. Cargar Mapeo Actual y Clusters Naturales
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));
const clusters = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/reports/nextgen_taxonomy_clusters_raw.json', 'utf8'));

console.log("=== AUDITORÍA DE COHERENCIA TAXONÓMICA (Current vs Natural) ===");

const analysis = [];

Object.entries(syndromeMap).forEach(([sId, data]) => {
    const differentials = data.differentials;
    const syndromeClusters = new Set();
    
    differentials.forEach(d => {
        // Buscar a qué cluster pertenece este diferencial
        const clusterIdx = clusters.findIndex(c => c.some(name => name.toLowerCase() === d.toLowerCase()));
        if (clusterIdx !== -1) syndromeClusters.add(clusterIdx);
    });
    
    analysis.push({
        syndrome: sId,
        diff_count: differentials.length,
        clusters_found: syndromeClusters.size,
        coherence: syndromeClusters.size === 1 ? 'ALTA' : (syndromeClusters.size === 0 ? 'NEUTRA' : 'FRAGMENTADA')
    });
});

console.table(analysis);

console.log("--- Hallazgo: Síndromes Fragmentados (Un solo nombre para mundos semiológicos distintos) ---");
analysis.filter(a => a.coherence === 'FRAGMENTADA').forEach(a => {
    console.log(`- ${a.syndrome}: Se distribuye en ${a.clusters_found} clusters naturales.`);
});

console.log("=== AUDITORÍA COMPLETADA ===");
process.exit(0);
