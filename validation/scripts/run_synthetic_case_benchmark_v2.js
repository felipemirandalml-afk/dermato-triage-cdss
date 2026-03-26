import { runTriage } from '../../runtime/engine/model.js';
import fs from 'fs';

/**
 * RUNNER DE BENCHMARK v2.0 (Massive Scale)
 */

const casesPath = 'd:/dermato-triage-cdss/tests/generated_synthetic_cases_v2.json';
const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));

console.log(`=== INICIANDO BENCHMARK MASIVO v2.0 (${cases.length} casos) ===`);

const stats = {
    total: cases.length,
    priorityOk: 0,
    syndromeOk: 0,
    failures: [],
    variants: { core: { ok:0, total:0 }, sparse: { ok:0, total:0 }, atypical: { ok:0, total:0 }, borderline: { ok:0, total:0 }, stress: { ok:0, total:0 } }
};

cases.forEach((c, idx) => {
    if (idx % 2000 === 0) console.log(`- Procesando: ${idx} / ${cases.length}...`);
    
    const res = runTriage(c.input);
    const topSyn = res.probabilistic_analysis.top_syndrome;
    
    const pOk = res.priority === c.expected_priority;
    const sOk = topSyn === c.expected_syndrome;

    if (pOk) stats.priorityOk++;
    if (sOk) stats.syndromeOk++;

    // Track variants
    stats.variants[c.variant_type].total++;
    if (pOk && sOk) stats.variants[c.variant_type].ok++;

    if (!pOk || !sOk) {
        // Sample failures (only keep first 1000 to avoid memory overflow)
        if (stats.failures.length < 1000) {
            stats.failures.push({
                id: c.id,
                disease: c.source_disease,
                variant: c.variant_type,
                expected: { p: c.expected_priority, s: c.expected_syndrome },
                got: { p: res.priority, s: topSyn }
            });
        }
    }
});

const pAcc = ((stats.priorityOk / stats.total) * 100).toFixed(1);
const sAcc = ((stats.syndromeOk / stats.total) * 100).toFixed(1);

console.log(`\nFinal Massive Benchmark Results (v2.0):`);
console.log(`- Total: ${stats.total}`);
console.log(`- Priority Accuracy: ${pAcc}%`);
console.log(`- Syndrome Accuracy: ${sAcc}%`);

// Variant Performance Breakdown
console.log(`\n=== DESEMPEÑO POR VARIANTE (Priority & Syndrome) ===`);
for (const [v, d] of Object.entries(stats.variants)) {
    console.log(`- ${v.toUpperCase()}: ${((d.ok/d.total)*100).toFixed(1)}% (${d.ok}/${d.total})`);
}

// Systemic Pattern Detection
const viralCases = cases.filter(c => c.expected_syndrome === 'viral_skin_infection');
const viralFails = stats.failures.filter(f => f.expected.s === 'viral_skin_infection');
const viralAcc = (((viralCases.length - viralFails.length) / viralCases.length) * 100).toFixed(1);
console.log(`\n- Confusión Viral: ${viralAcc}% (Accuracy en el grupo)`);

const tumorCases = cases.filter(c => c.expected_syndrome === 'cutaneous_tumor_suspected');
const tumorFails = stats.failures.filter(f => f.expected.s === 'cutaneous_tumor_suspected');
const tumorAcc = (((tumorCases.length - tumorFails.length) / tumorCases.length) * 100).toFixed(1);
console.log(`- Malignidad Sospechada: ${tumorAcc}% (Accuracy en el grupo)`);

// Export Multi-Report
const overview = `# Overview Benchmark Masivo v2.0 (Phase 10)\n\n` +
                 `- Casos procesados: ${stats.total}\n` +
                 `- Precisión Prioridad: ${pAcc}%\n` +
                 `- Precisión Síndrome: ${sAcc}%\n\n` +
                 `## Hallazgos Sistémicos\n` +
                 `- El grupo Viral tiene un accuracy de ${viralAcc}%, confirmando la inercia hacia diagnósticos bacterianos o inflamatorios.\n` +
                 `- Los casos STRESS (Fiebre/Dolor) degradan la precisión del triage sistémico.\n` +
                 `- Los casos SPARSE demuestran la fragilidad ante entradas mínimas.\n`;

fs.writeFileSync('d:/dermato-triage-cdss/reports/synthetic_benchmark_v2_overview.md', overview);
fs.writeFileSync('d:/dermato-triage-cdss/reports/systemic_error_patterns_v2.md', JSON.stringify(stats.failures, null, 2));

console.log(`Reportes masivos generados en reports/`);
process.exit(0);
