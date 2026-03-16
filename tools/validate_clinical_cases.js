import { runTriage } from '../model.js';
import { CLINICAL_CASES } from '../data/clinical_cases.js';

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

console.log(`${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.cyan}   DERMATOTRIAGE CDSS - BENCHMARK AVANZADO v2.0    ${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}\n`);

const results = {
    total: 0,
    passed: 0,
    byPriority: {
        P1: { total: 0, passed: 0 },
        P2: { total: 0, passed: 0 },
        P3: { total: 0, passed: 0 }
    },
    underTriage: [],
    syndromeDiscrepancies: []
};

CLINICAL_CASES.forEach((c) => {
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

    // Detection of Under-triage (Critical)
    if (c.expected_priority === 1 && predictedPriority > 1) {
        results.underTriage.push({
            id: c.id,
            title: c.title,
            expected: 1,
            predicted: predictedPriority,
            modifier: res.modifier
        });
    }

    // Syndrome Discrepancies
    if (c.expected_syndrome && !syndromeMatch) {
        results.syndromeDiscrepancies.push({
            id: c.id,
            expected: c.expected_syndrome,
            predicted: predictedSyndrome,
            confidence: res.probabilistic_analysis.top_probability
        });
    }

    // Individual Case Output (Simplified)
    const statusIcon = priorityMatch ? `${COLORS.green}✔${COLORS.reset}` : `${COLORS.red}✘${COLORS.reset}`;
    const pColor = priorityMatch ? COLORS.green : (c.expected_priority === 1 ? COLORS.red : COLORS.yellow);
    
    console.log(`${statusIcon} [${c.id}] ${c.title.padEnd(35)} | Exp: P${c.expected_priority} -> Got: ${pColor}P${predictedPriority}${COLORS.reset}`);
});

// --- REPORT GENERATION ---
const accuracy = ((results.passed / results.total) * 100).toFixed(1);

console.log(`\n${COLORS.bright}1. MÉTRICAS GLOBALES${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
console.log(`Total Casos:    ${results.total}`);
console.log(`Global Accuracy: ${COLORS.bright}${accuracy}%${COLORS.reset}`);

console.log(`\n${COLORS.bright}2. ACCURACY POR PRIORIDAD${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
Object.keys(results.byPriority).forEach(p => {
    const stats = results.byPriority[p];
    const acc = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : "N/A";
    const color = acc === "100.0" ? COLORS.green : (p === "P1" ? COLORS.red : COLORS.yellow);
    console.log(`${p}: ${color}${acc}%${COLORS.reset} (${stats.passed}/${stats.total})`);
});

console.log(`\n${COLORS.bright}3. DETECCIÓN DE UNDER-TRIAGE (CRÍTICO)${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
if (results.underTriage.length === 0) {
    console.log(`${COLORS.green}✅ No se detectó under-triage en casos P1.${COLORS.reset}`);
} else {
    console.log(`${COLORS.red}⚠ ALERTA: ${results.underTriage.length} casos P1 fueron sub-clasificados!${COLORS.reset}`);
    results.underTriage.forEach(ut => {
        console.log(` - [${ut.id}] ${ut.title} (Exp: P1, Got: P${ut.predicted})`);
    });
}

console.log(`\n${COLORS.bright}4. MATRIZ DE ERRORES SINDRÓMICOS${COLORS.reset}`);
console.log(`${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
if (results.syndromeDiscrepancies.length === 0) {
    console.log(`${COLORS.green}✅ Concordancia sindrómica perfecta.${COLORS.reset}`);
} else {
    console.log(`Se detectaron ${results.syndromeDiscrepancies.length} discrepancias:`);
    results.syndromeDiscrepancies.forEach(d => {
        console.log(` - [${d.id}] Exp: ${COLORS.white}${d.expected.padEnd(25)}${COLORS.reset} | Pred: ${COLORS.yellow}${String(d.predicted).padEnd(25)}${COLORS.reset} | Conf: ${(d.confidence*100).toFixed(1)}%`);
    });
}

console.log(`\n${COLORS.bright}${COLORS.cyan}==================================================${COLORS.reset}`);

if (results.underTriage.length === 0 && results.byPriority.P1.passed === results.byPriority.P1.total) {
    console.log(`${COLORS.bright}${COLORS.green}BENCHMARK EXITOSO: Seguridad clínica garantizada.${COLORS.reset}`);
    process.exit(0);
} else {
    console.log(`${COLORS.bright}${COLORS.red}BENCHMARK FALLIDO: Riesgo clínico detectado en P1.${COLORS.reset}`);
    process.exit(1);
}
