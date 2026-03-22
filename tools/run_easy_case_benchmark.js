import { runTriage } from '../model.js';
import fs from 'fs';

/**
 * RUNNER DE BENCHMARK EASY (TEXTBOOK CEILING)
 */

const casesPath = 'd:/dermato-triage-cdss/tests/generated_easy_cases.json';
const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));

console.log(`=== INICIANDO EASY BENCHMARK (CEILING TEST - ${cases.length} casos) ===`);

const stats = {
    total: cases.length,
    priorityOk: 0,
    syndromeOk: 0,
    failures: []
};

cases.forEach((c, idx) => {
    if (idx % 1000 === 0) console.log(`- Procesando: ${idx} / ${cases.length}...`);
    
    const res = runTriage(c.input);
    const topSyn = res.probabilistic_analysis.top_syndrome;
    
    const pOk = res.priority === c.expected_priority;
    const sOk = topSyn === c.expected_syndrome;

    if (pOk) stats.priorityOk++;
    if (sOk) stats.syndromeOk++;

    if (!pOk || !sOk) {
        if (stats.failures.length < 500) { // Keep sample
            stats.failures.push({
                id: c.id,
                disease: c.source_disease,
                expected: { p: c.expected_priority, s: c.expected_syndrome },
                got: { p: res.priority, s: topSyn }
            });
        }
    }
});

const pAcc = ((stats.priorityOk / stats.total) * 100).toFixed(1);
const sAcc = ((stats.syndromeOk / stats.total) * 100).toFixed(1);

console.log(`\nFinal Easy Benchmark Results (Ceiling Test):`);
console.log(`- Total: ${stats.total}`);
console.log(`- Priority Accuracy: ${pAcc}%`);
console.log(`- Syndrome Accuracy: ${sAcc}%`);

// Export Multi-Report
const overview = `# Overview Easy Benchmark (Ceiling Test - Phase 11)\n\n` +
                 `- Casos procesados: ${stats.total}\n` +
                 `- Precisión Prioridad: ${pAcc}%\n` +
                 `- Precisión Síndrome: ${sAcc}%\n\n` +
                 `## Conclusión Basal\n` +
                 `Este resultado representa el **techo real** del sistema actual si el input fuera perfecto.\n`;

fs.writeFileSync('d:/dermato-triage-cdss/reports/easy_benchmark_overview.md', overview);
fs.writeFileSync('d:/dermato-triage-cdss/reports/easy_error_patterns.md', JSON.stringify(stats.failures, null, 2));

console.log(`Reportes generados en reports/`);
process.exit(0);
