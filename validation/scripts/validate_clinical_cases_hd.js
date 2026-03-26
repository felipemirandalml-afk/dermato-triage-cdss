/**
 * validate_clinical_cases_hd.js - Validador de Benchmark de Alta Fidelidad
 * 
 * Este script ejecuta el dataset clinical_cases_hd.js contra el modelo de 81 dimensiones.
 */

import { CLINICAL_CASES_HD } from '../datasets/clinical_cases_hd.js';
import { runTriage } from '../../runtime/engine/model.js';
import { PROBABILISTIC_FEATURES } from '../../runtime/engine/constants.js';

console.log("==================================================");
console.log("       DERMATOTRIAGE HD BENCHMARK v3.0         ");
console.log("==================================================\n");

let stats = {
    total: 0,
    priority_ok: 0,
    syndrome_ok: 0,
    by_syndrome: {}
};

CLINICAL_CASES_HD.forEach(testCase => {
    stats.total++;
    
    // Normalizar input (asegurar todas las features)
    const fullInput = {};
    PROBABILISTIC_FEATURES.forEach(feat => {
        fullInput[feat] = testCase.input[feat] || 0;
    });
    // Age y timing son especiales
    fullInput.age = testCase.input.age || 40;
    fullInput.timing = testCase.input.timing || "acute";

    const result = runTriage(fullInput);
    
    // Extracción de datos según arquitectura Phase 15
    const syndrome = result.probabilistic_analysis?.top_syndrome;
    const confidence = result.probabilistic_analysis?.top_probability || 0;
    
    const prioOk = result.priority === testCase.expected_priority;
    const syndromeOk = syndrome === testCase.expected_syndrome;
    
    if (prioOk) stats.priority_ok++;
    if (syndromeOk) stats.syndrome_ok++;
    
    // Stats por síndrome
    if (!stats.by_syndrome[testCase.expected_syndrome]) {
        stats.by_syndrome[testCase.expected_syndrome] = { total: 0, ok: 0 };
    }
    stats.by_syndrome[testCase.expected_syndrome].total++;
    if (syndromeOk) stats.by_syndrome[testCase.expected_syndrome].ok++;

    const icon_prio = prioOk ? "✔" : "✘";
    const icon_synd = syndromeOk ? "●" : "×";
    
    console.log(`${icon_prio}${icon_synd} [${testCase.id}] ${testCase.title.padEnd(45)} | Triage: P${result.priority} | Synd: ${syndrome}`);
    if (!syndromeOk) {
        console.log(`   └─ DISCREPANCIA | Exp: ${testCase.expected_syndrome} | Got: ${syndrome} (Conf: ${confidence.toFixed(2)})`);
    }
});

console.log("\n" + "=".repeat(50));
console.log("          RESULTADOS FINALES HD             ");
console.log("=".repeat(50));
console.log(`Accuracy Prioridad: ${(stats.priority_ok/stats.total*100).toFixed(1)}%`);
console.log(`Accuracy Sindrómica: ${(stats.syndrome_ok/stats.total*100).toFixed(1)}%`);
console.log("-".repeat(50));

Object.keys(stats.by_syndrome).sort().forEach(synd => {
    const s = stats.by_syndrome[synd];
    const acc = (s.ok / s.total * 100).toFixed(1);
    console.log(`${synd.padEnd(30)}: ${acc}% (${s.ok}/${s.total})`);
});
