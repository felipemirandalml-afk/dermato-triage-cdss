import { runTriage } from '../model.js';
import fs from 'fs';

const cases = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/tests/generated_synthetic_cases.json', 'utf8'));

console.log("=== BENCHMARK SINTÉTICO MASIVO (STRESS TEST) ===");

const stats = {
    total: cases.length,
    priorityOk: 0,
    syndromeOk: 0,
    failures: []
};

cases.forEach(c => {
    const res = runTriage(c.input);
    const topSyn = res.probabilistic_analysis.top_syndrome;
    
    const pOk = res.priority === c.expected_priority;
    const sOk = topSyn === c.expected_syndrome;

    if (pOk) stats.priorityOk++;
    if (sOk) stats.syndromeOk++;

    if (!pOk || !sOk) {
        stats.failures.push({
            id: c.id,
            disease: c.source_disease,
            expected: { p: c.expected_priority, s: c.expected_syndrome },
            got: { p: res.priority, s: topSyn },
            errorType: (!pOk && !sOk) ? 'Both' : (!pOk ? 'Priority' : 'Syndrome'),
            variant: c.variant_type
        });
    }
});

const pAcc = ((stats.priorityOk / stats.total) * 100).toFixed(1);
const sAcc = ((stats.syndromeOk / stats.total) * 100).toFixed(1);

console.log(`\nFinal Results:`);
console.log(`- Total cases: ${stats.total}`);
console.log(`- Priority Accuracy: ${pAcc}%`);
console.log(`- Syndrome Accuracy: ${sAcc}%`);

// Detect Systemic Patterns
console.log(`\n=== PATRONES DE ERROR SISTÉMICOS DETECTADOS ===`);
const viralFailures = stats.failures.filter(f => f.expected.s === 'viral_skin_infection');
console.log(`- Viral Confusion: ${viralFailures.length} / ${cases.filter(c=>c.expected_syndrome==='viral_skin_infection').length} (${((viralFailures.length/cases.filter(c=>c.expected_syndrome==='viral_skin_infection').length)*100).toFixed(1)}%)`);

const tumorOvercall = stats.failures.filter(f => f.got.s === 'cutaneous_tumor_suspected' && f.expected.s !== 'cutaneous_tumor_suspected');
console.log(`- Tumor Overcalling: ${tumorOvercall.length} cases incorrectly labeled as tumor.`);

const sparseFails = stats.failures.filter(f => f.variant === 'sparse');
console.log(`- Sparse Input Fragility: ${sparseFails.length} failures on sparse inputs.`);

// Export Report
const report = `# Reporte Stress Test Sintético (v1.0)\n\n` +
               `- Accuracy Prioridad: ${pAcc}%\n` +
               `- Accuracy Síndrome: ${sAcc}%\n\n` +
               `## Patrones Críticos\n` +
               `- Confusión Viral: ${viralFailures.length} fallos\n` +
               `- Stress Fails: ${sparseFails.length}\n`;

fs.writeFileSync('d:/dermato-triage-cdss/reports/synthetic_benchmark_overview.md', report);
fs.writeFileSync('d:/dermato-triage-cdss/reports/systemic_error_patterns.md', JSON.stringify(stats.failures.slice(0, 50), null, 2));

console.log(`Reportes generados en reports/`);
if (pAcc > 0) process.exit(0);
