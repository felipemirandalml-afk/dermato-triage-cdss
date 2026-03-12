/**
 * validate_clinical_cases.js - Clinical Validation Runner v1.0
 * Ejecuta el dataset de validación contra el motor clínico actual.
 */

import { encodeFeatures, predict, explain, interpretResult } from '../model.js';
import { CLINICAL_CASES } from '../clinical_cases.js';

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m"
};

console.log(`${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.cyan}   DERMATOTRIAGE CDSS - VALIDACIÓN CLÍNICA v6.0    ${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}\n`);

let passed = 0;
let failed = 0;
const failingCases = [];

// Estadísticas de distribución
const stats = {
    expected: { P1: 0, P2: 0, P3: 0 },
    predicted: { P1: 0, P2: 0, P3: 0 }
};

CLINICAL_CASES.forEach((c, index) => {
    const X = encodeFeatures(c.input);
    const raw = predict(X);
    const result = interpretResult(X, raw); // Usamos la capa de interpretación (con modifiers)
    const explanation = explain(X, raw.classIdx);

    const isMatch = result.priority === c.expected_priority;
    
    // Track stats
    stats.expected[`P${c.expected_priority}`]++;
    stats.predicted[`P${result.priority}`]++;

    if (isMatch) {
        passed++;
    } else {
        failed++;
        failingCases.push({
            id: c.id,
            title: c.title,
            expected: c.expected_priority,
            predicted: result.priority
        });
    }

    const statusIcon = isMatch ? `${COLORS.green}✔ PASS${COLORS.reset}` : `${COLORS.red}✘ FAIL${COLORS.reset}`;
    
    console.log(`${COLORS.bright}[${c.id}] ${c.title}${COLORS.reset}`);
    console.log(`   Summary: ${COLORS.blue}${c.short_clinical_summary}${COLORS.reset}`);
    console.log(`   Expected: P${c.expected_priority} | Predicted: ${isMatch ? COLORS.green : COLORS.red}P${result.priority}${COLORS.reset} (${result.label})`);
    if (result.modifier) {
        console.log(`   ${COLORS.yellow}✦ Modifier: ${result.modifier}${COLORS.reset}`);
    }
    console.log(`   Status:   ${statusIcon}`);

    if (!isMatch) {
        console.log(`   ${COLORS.yellow}⚠ ALERTA: La predicción no coincide con el criterio clínico esperado.${COLORS.reset}`);
    }

    // Mostrar señales dominantes
    const signals = explanation.map(e => `${e.name} (${e.val > 0 ? '+' : ''}${e.val.toFixed(1)})`).join(', ');
    console.log(`   Top Signals: ${COLORS.magenta}${signals}${COLORS.reset}`);
    console.log(`   Notes: ${COLORS.cyan}${c.notes}${COLORS.reset}`);
    console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
});

const total = CLINICAL_CASES.length;
const accuracy = ((passed / total) * 100).toFixed(1);

console.log(`\n${COLORS.bright}ESTADÍSTICAS DE VALIDACIÓN:${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
console.log(`Expected Distribution: P1: ${stats.expected.P1} | P2: ${stats.expected.P2} | P3: ${stats.expected.P3}`);
console.log(`Predicted Distribution: P1: ${stats.predicted.P1} | P2: ${stats.predicted.P2} | P3: ${stats.predicted.P3}`);
console.log(`Concordance Rate: ${COLORS.bright}${accuracy}%${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);

console.log(`\n${COLORS.bright}RESULTADO FINAL:${COLORS.reset}`);
console.log(`${COLORS.green}Passed: ${passed}${COLORS.reset}`);
console.log(`${COLORS.red}Failed: ${failed}${COLORS.reset}`);
console.log(`Total:  ${total}`);

if (failingCases.length > 0) {
    console.log(`\n${COLORS.bright}${COLORS.red}CASOS FALLIDOS:${COLORS.reset}`);
    failingCases.forEach(f => {
        console.log(`- [${f.id}] ${f.title} (Exp: P${f.expected}, Got: P${f.predicted})`);
    });
}

if (failed === 0) {
    console.log(`\n${COLORS.bright}${COLORS.green}✅ VALIDACIÓN EXITOSA: El motor clínico es consistente con todos los casos.${COLORS.reset}\n`);
    process.exit(0);
} else {
    console.log(`\n${COLORS.bright}${COLORS.red}❌ VALIDACIÓN INCOMPLETA: Se detectaron ${failed} inconsistencias en situaciones frontera.${COLORS.reset}\n`);
    process.exit(1);
}
