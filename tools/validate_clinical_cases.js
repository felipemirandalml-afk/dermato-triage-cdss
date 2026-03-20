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

/**
 * Constantes de Configuración del Benchmark
 */
const SYNDROME_ACCURACY_THRESHOLD = 85.0; // 85% de precisión sindrómica mínima

function runSuite(cases, suiteName, showExplainability = false) {
    printHeader(suiteName);
    
    const results = {
        total: 0,
        passedPriority: 0,
        passedSyndrome: 0,
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
        const topSyndrome = res.probabilistic_analysis.top_syndrome;
        const candidates = res.probabilistic_analysis.top_candidates || [];
        
        // 1. Validación de Prioridad (Safety)
        const priorityMatch = predictedPriority === c.expected_priority;
        
        // 2. Validación de Síndrome (Intelligence)
        // Soporte para Multi-Síndrome: Si el sistema detectó ambigüedad, permitimos match en el Top 2
        const isMulti = res.probabilistic_analysis.is_multi_syndrome;
        const syndromeMatch = !c.expected_syndrome || 
                            (topSyndrome === c.expected_syndrome) || 
                            (isMulti && candidates.length > 1 && candidates[1].syndrome === c.expected_syndrome);

        results.total++;
        results.byPriority[`P${c.expected_priority}`].total++;
        
        if (priorityMatch) {
            results.passedPriority++;
            results.byPriority[`P${c.expected_priority}`].passed++;
        }

        if (syndromeMatch) {
            results.passedSyndrome++;
        } else if (c.expected_syndrome) {
            results.syndromeDiscrepancies.push({ id: c.id, expected: c.expected_syndrome, predicted: topSyndrome });
        }

        // Under-triage detection
        if (c.expected_priority === 1 && predictedPriority > 1) {
            results.underTriage.push({ id: c.id, title: c.title, expected: 1, predicted: predictedPriority });
        }

        // Print Line Result
        const pIcon = priorityMatch ? `${COLORS.green}✔${COLORS.reset}` : `${COLORS.red}✘${COLORS.reset}`;
        const sIcon = syndromeMatch ? (topSyndrome === c.expected_syndrome ? `${COLORS.green}●${COLORS.reset}` : `${COLORS.blue}○${COLORS.reset}`) : `${COLORS.red}×${COLORS.reset}`;
        
        const pColor = priorityMatch ? COLORS.green : (c.expected_priority === 1 ? COLORS.red : COLORS.yellow);
        
        console.log(`${pIcon}${sIcon} [${c.id}] ${c.title.padEnd(40)} | Triage: ${pColor}P${predictedPriority}${COLORS.reset} | Mod: ${(res.modifier || 'None').slice(0, 15)}`);

        if (showExplainability || !syndromeMatch) {
            const syncStatus = syndromeMatch ? (topSyndrome === c.expected_syndrome ? 'Exacto' : 'Aceptado (Ambiguo)') : 'DISCREPANCIA';
            const logColor = syndromeMatch ? COLORS.white : COLORS.red;
            console.log(`   ${logColor}└─ Síndrome: ${syncStatus} | Exp: ${c.expected_syndrome} | Got: ${topSyndrome}${COLORS.reset}`);
            
            if (showExplainability) {
                console.log(`   ${COLORS.blue}└─ Pearl: ${res.reasoning_insights?.pearl || 'N/A'}`);
            }
        }
    });

    const pAcc = ((results.passedPriority / results.total) * 100).toFixed(1);
    const sAcc = ((results.passedSyndrome / results.total) * 100).toFixed(1);
    
    console.log(`\nAccuracy ${suiteName}:`);
    console.log(`   - Priority: ${COLORS.bright}${pAcc}%${COLORS.reset}`);
    console.log(`   - Syndrome: ${COLORS.bright}${sAcc}%${COLORS.reset}`);
    
    return results;
}

// 1. Integridad Estructural (Schema)
if (!validateDatasetSchema()) {
    console.error(`${COLORS.bright}${COLORS.red}BENCHMARK ABORTADO: Errores estructurales en el dataset.${COLORS.reset}`);
    process.exit(1);
}

// 2. Ejecución de Suites
const baseResults = runSuite(CLINICAL_CASES, "DERMATOTRIAGE BENCHMARK BASE v2.2");
const hardeningResults = runSuite(HARDENING_CASES, "HARDENING v2 - CASOS FRONTERA", true);

// 3. Verificación Final y Veredictos
const totalUnderTriage = baseResults.underTriage.length + hardeningResults.underTriage.length;
const totalUnknownKeys = baseResults.unknownInputs.length + hardeningResults.unknownInputs.length;
const p1BasePass = baseResults.byPriority.P1.passed === baseResults.byPriority.P1.total;

// Syndrome Accuracy Global (Weighted)
const totalCases = baseResults.total + hardeningResults.total;
const totalPassedSyndrome = baseResults.passedSyndrome + hardeningResults.passedSyndrome;
const globalSynAccuracy = (totalPassedSyndrome / totalCases) * 100;

printHeader("VEREDICTO FINAL DE AUDITORÍA");

const safetyVerdict = (totalUnderTriage === 0 && p1BasePass) ? `${COLORS.green}PASS${COLORS.reset}` : `${COLORS.red}FAIL${COLORS.reset}`;
const integrityVerdict = (totalUnknownKeys === 0) ? `${COLORS.green}PASS${COLORS.reset}` : `${COLORS.yellow}WARNING${COLORS.reset}`;
const intelligenceVerdict = (globalSynAccuracy >= SYNDROME_ACCURACY_THRESHOLD) ? `${COLORS.green}PASS${COLORS.reset}` : `${COLORS.red}FAIL${COLORS.reset}`;

console.log(`1. SEGURIDAD (Triage P1):     [ ${safetyVerdict} ] - Under-triage: ${totalUnderTriage}`);
console.log(`2. INTEGRIDAD (Contrato):     [ ${integrityVerdict} ] - Unknown keys: ${totalUnknownKeys}`);
console.log(`3. INTELIGENCIA (Síndrome):   [ ${intelligenceVerdict} ] - Accuracy: ${globalSynAccuracy.toFixed(1)}% (Threshold: ${SYNDROME_ACCURACY_THRESHOLD}%)`);

console.log(`\n${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);

const isOverallSuccess = (totalUnderTriage === 0 && p1BasePass && totalUnknownKeys === 0 && globalSynAccuracy >= SYNDROME_ACCURACY_THRESHOLD);

if (isOverallSuccess) {
    console.log(`\n${COLORS.bright}${COLORS.green}BENCHMARK EXITOSO: El sistema cumple con los estándares críticos de seguridad e inteligencia.${COLORS.reset}`);
    process.exit(0);
} else {
    console.log(`\n${COLORS.bright}${COLORS.red}BENCHMARK FALLIDO: Se detectaron debilidades inadmisibles en el motor.${COLORS.reset}`);
    if (globalSynAccuracy < SYNDROME_ACCURACY_THRESHOLD) {
        console.log(`${COLORS.red}Razón: La precisión sindrómica (${globalSynAccuracy.toFixed(1)}%) está por debajo del umbral clínico esperado.${COLORS.reset}`);
    }
    process.exit(1);
}
