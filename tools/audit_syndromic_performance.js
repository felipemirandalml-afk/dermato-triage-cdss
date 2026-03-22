import fs from 'fs';
import { runTriage } from '../model.js';

// 1. Cargar Casos Fáciles (Ceiling Test)
const easyCases = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/tests/generated_easy_cases.json', 'utf8'));

// 2. Estructura de Métricas { syndromeId: { TP, FP, FN, TN, confusions: { otherId: n } } }
const syndromes = ["eczema_dermatitis", "psoriasiform_dermatosis", "bacterial_skin_infection", "viral_skin_infection", "fungal_skin_infection", "drug_reaction", "urticarial_dermatosis", "vesiculobullous_disease", "vasculitic_purpuric_disease", "cutaneous_tumor_suspected", "benign_cutaneous_tumor", "inflammatory_dermatosis_other"];

const metrics = {};
syndromes.forEach(s => metrics[s] = { tp: 0, fp: 0, fn: 0, total: 0, confusions: {} });

console.log(`=== AUDITORÍA SINDRÓMICA (Easy Benchmark - ${easyCases.length} casos) ===`);

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
    if (processed % 500 === 0) console.log(`- Procesados: ${processed} / ${easyCases.length}...`);
});

// 3. Calcular Reporte Final
const report = [];
const confusionData = {};

syndromes.forEach(s => {
    const m = metrics[s];
    const precision = m.tp + m.fp > 0 ? (m.tp / (m.tp + m.fp)) : 0;
    const recall = m.total > 0 ? (m.tp / m.total) : 0;
    const f1 = precision + recall > 0 ? (2 * (precision * recall) / (precision + recall)) : 0;

    report.push({
        syndrome: s,
        accuracy: (recall * 100).toFixed(1) + "%",
        precision: (precision * 100).toFixed(1) + "%",
        recall: (recall * 100).toFixed(1) + "%",
        f1: f1.toFixed(2),
        total_cases: m.total,
        top_confusion: Object.entries(m.confusions).sort((a,b) => b[1]-a[1])[0] || [null, 0]
    });

    confusionData[s] = m.confusions;
});

report.sort((a,b) => b.f1 - a.f1);

// 4. Guardar Artefactos
fs.writeFileSync('d:/dermato-triage-cdss/data/syndromic_confusion_matrix.json', JSON.stringify(confusionData, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/reports/syndromic_easy_benchmark_raw.json', JSON.stringify(report, null, 2));

console.log("=== REPORTE SINDRÓMICO GENERADO ===");
console.table(report.map(r => ({ syndrome: r.syndrome, f1: r.f1, accuracy: r.accuracy, top_confusion: r.top_confusion[0] })));
