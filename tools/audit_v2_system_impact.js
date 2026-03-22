import fs from 'fs';
import { runTriage } from '../model.js';

// 1. Cargar Datos
const easyCases = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/tests/generated_easy_cases.json', 'utf8'));
const syndromes = ["eczema_dermatitis", "psoriasiform_dermatosis", "bacterial_skin_infection", "viral_skin_infection", "fungal_skin_infection", "drug_reaction", "urticarial_dermatosis", "vesiculobullous_disease", "vasculitic_purpuric_disease", "cutaneous_tumor_suspected", "benign_cutaneous_tumor", "inflammatory_dermatosis_other"];

console.log("=== INICIANDO VALIDACIÓN DE IMPACTO v2.0 (Full Benchmark) ===");

const metrics = {};
syndromes.forEach(s => metrics[s] = { tp: 0, fp: 0, fn: 0, total: 0, confusions: {} });

let processed = 0;
easyCases.forEach(c => {
    const result = runTriage(c.input);
    const predicted = result.probabilistic_analysis.top_syndrome;
    const actual = c.expected_syndrome;

    if (metrics[actual]) {
        metrics[actual].total++;
        if (predicted === actual) {
            metrics[actual].tp++;
        } else {
            metrics[actual].fn++;
            if (predicted) {
                metrics[actual].confusions[predicted] = (metrics[actual].confusions[predicted] || 0) + 1;
                if (metrics[predicted]) metrics[predicted].fp++;
            }
        }
    }
    processed++;
    if (processed % 1000 === 0) console.log(`- Procesados: ${processed} / ${easyCases.length}...`);
});

// 2. Reporte Final
const finalReport = [];
const confusionData = {};

syndromes.forEach(s => {
    const m = metrics[s];
    const prec = m.tp + m.fp > 0 ? (m.tp / (m.tp + m.fp)) : 0;
    const rec = m.total > 0 ? (m.tp / m.total) : 0;
    const f1 = (prec + rec > 0) ? (2 * (prec * rec) / (prec + rec)) : 0;

    finalReport.push({
        syndrome: s,
        recall: (rec * 100).toFixed(1) + "%",
        precision: (prec * 100).toFixed(1) + "%",
        f1: f1.toFixed(2),
        total_cases: m.total,
        top_confusion: Object.entries(m.confusions).sort((a,b) => b[1]-a[1])[0] || [null, 0]
    });
    confusionData[s] = m.confusions;
});

finalReport.sort((a,b) => b.f1 - a.f1);

fs.writeFileSync('d:/dermato-triage-cdss/data/syndromic_confusion_matrix_runtime_v2.json', JSON.stringify(confusionData, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/reports/v2_easy_benchmark_results_raw.json', JSON.stringify(finalReport, null, 2));

console.log("=== VALIDACIÓN COMPLETADA ===");
console.table(finalReport.map(r => ({ syndrome: r.syndrome, f1: r.f1, recall: r.recall, confusion: r.top_confusion[0] })));
