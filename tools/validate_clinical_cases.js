import { runTriage } from '../model.js';
import { encodeFeatures } from '../engine/feature_encoder.js';
import { CLINICAL_CASES } from '../data/clinical_cases.js';
import { HARDENING_CASES } from '../data/hardening_cases_v2.js';
import { validateDatasetSchema } from './validate_case_schema.js';

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

function printHeader(title) {
    console.log(`\n${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.cyan}   ${title.padEnd(44)}   ${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}\n`);
}

function runSuite(cases, suiteName, showExplainability = false) {
    printHeader(suiteName);
    
    const results = {
        total: 0,
        passed: 0,
        byPriority: { P1: { total: 0, passed: 0 }, P2: { total: 0, passed: 0 }, P3: { total: 0, passed: 0 } },
        unknownInputs: [],
        underTriage: [],
        syndromeDiscrepancies: []
    };

    cases.forEach((c) => {
        const { unknownKeys } = encodeFeatures(c.input);
        if (unknownKeys.length > 0) results.unknownInputs.push({ id: c.id, keys: unknownKeys });

        const res = runTriage(c.input);
        const predictedPriority = res.priority;
        const predictedSyndrome = res.probabilistic_analysis.top_syndrome;
        
        const priorityMatch = predictedPriority === c.expected_priority;
        const syndromeMatch = !c.expected_syndrome || predictedSyndrome === c.expected_syndrome;

        results.total++;
        results.byPriority[`P${c.expected_priority}`].total++;
        if (priorityMatch) {
            results.passed++;
            results.byPriority[`P${c.expected_priority}`].passed++;
        }

        if (c.expected_priority === 1 && predictedPriority > 1) {
            results.underTriage.push({ id: c.id, title: c.title, expected: 1, predicted: predictedPriority });
        }

        if (c.expected_syndrome && !syndromeMatch) {
            results.syndromeDiscrepancies.push({ id: c.id, expected: c.expected_syndrome, predicted: predictedSyndrome });
        }

        const statusIcon = priorityMatch ? `${COLORS.green}✔${COLORS.reset}` : `${COLORS.red}✘${COLORS.reset}`;
        const pColor = priorityMatch ? COLORS.green : (c.expected_priority === 1 ? COLORS.red : COLORS.yellow);
        console.log(`${statusIcon} [${c.id}] ${c.title.padEnd(40)} | Exp: P${c.expected_priority} -> Got: ${pColor}P${predictedPriority}${COLORS.reset}`);

        if (showExplainability) {
            console.log(`   ${COLORS.white}└─ Reasoning:${COLORS.reset} ${res.reasoning_insights?.summary || 'N/A'}`);
            if (res.reasoning_insights?.pearl) {
                console.log(`   ${COLORS.blue}└─ Pearl:${COLORS.reset} ${res.reasoning_insights.pearl}`);
            }
            if (res.differential_ranking?.[0]) {
                const topDiff = res.differential_ranking[0];
                console.log(`   ${COLORS.yellow}└─ Top Diff:${COLORS.reset} ${topDiff.disease} (${topDiff.compatibility}) | Findings: ${topDiff.supporting_features.join(', ')}`);
            }
            console.log("");
        }
    });

    const accuracy = ((results.passed / results.total) * 100).toFixed(1);
    console.log(`\nAccuracy ${suiteName}: ${COLORS.bright}${accuracy}%${COLORS.reset} (${results.passed}/${results.total})`);
    
    return results;
}

// 1. Integridad Estructural (Schema)
if (!validateDatasetSchema()) {
    console.error(`${COLORS.bright}${COLORS.red}BENCHMARK ABORTADO: Errores estructurales en el dataset.${COLORS.reset}`);
    process.exit(1);
}

// 2. Ejecución de Suites
const baseResults = runSuite(CLINICAL_CASES, "DERMATOTRIAGE BENCHMARK BASE v2.1");
const hardeningResults = runSuite(HARDENING_CASES, "HARDENING v2 - CASOS FRONTERA", true);

// 3. Verificación Final de Seguridad e Integridad
const totalUnderTriage = baseResults.underTriage.length + hardeningResults.underTriage.length;
const totalUnknownKeys = baseResults.unknownInputs.length + hardeningResults.unknownInputs.length;
const p1BasePass = baseResults.byPriority.P1.passed === baseResults.byPriority.P1.total;

console.log(`\n${COLORS.bright}REPORTE FINAL DE CONSOLIDACIÓN${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
console.log(`Under-triage total: ${totalUnderTriage === 0 ? COLORS.green : COLORS.red}${totalUnderTriage}${COLORS.reset}`);
console.log(`Claves desconocidas: ${totalUnknownKeys === 0 ? COLORS.green : COLORS.yellow}${totalUnknownKeys}${COLORS.reset}`);

if (totalUnderTriage === 0 && totalUnknownKeys === 0 && p1BasePass) {
    console.log(`\n${COLORS.bright}${COLORS.green}BENCHMARK EXITOSO: El sistema es seguro y la inteligencia es auditable.${COLORS.reset}`);
    process.exit(0);
} else {
    console.log(`\n${COLORS.bright}${COLORS.red}BENCHMARK FALLIDO: Se detectaron riesgos críticos de seguridad o integridad.${COLORS.reset}`);
    process.exit(1);
}
