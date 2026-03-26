/**
 * tools/test_multi_syndrome_logic.js - Suite de pruebas para el motor de ambigüedad
 */
import { runTriage } from '../../runtime/engine/model.js';

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m"
};

const TEST_CASES = [
    {
        name: "SÍNDROME DOMINANTE (No Ambigüedad)",
        input: { age: 30, fitzpatrick: 2, lesion_purpura: true, lesion_ulcera: true, timing: 'acute' },
        expectedMode: false,
        priority: 1
    },
    {
        name: "AMBIGÜEDAD REAL (Eczema vs Urticaria)",
        input: { age: 5, fitzpatrick: 2, lesion_placa: true, lesion_escama: true, lesion_costra: true, prurito: true, topo_flexuras: true, timing: 'acute' },
        expectedMode: true,
        priority: 3
    }
];

console.log(`${COLORS.bright}VALIDANDO LÓGICA MULTI-SÍNDROME (PHASE 1)${COLORS.reset}\n`);

let allPassed = true;

TEST_CASES.forEach(test => {
    const res = runTriage(test.input);
    const modeActive = res.probabilistic_analysis.is_multi_syndrome || false;
    
    const pass = modeActive === test.expectedMode;
    const priorityPass = res.priority === test.priority;
    
    const statusIcon = (pass && priorityPass) ? `${COLORS.green}✔${COLORS.reset}` : `${COLORS.red}✘${COLORS.reset}`;
    
    console.log(`${statusIcon} [${test.name}]`);
    console.log(`   - Modo Multi-Síndrome: ${modeActive ? 'ACTIVO' : 'INACTIVO'} (Esperado: ${test.expectedMode})`);
    console.log(`   - Prioridad Triage: P${res.priority} (Esperado: P${test.priority})`);
    
    if (modeActive) {
        console.log(`   - Síndromes Participantes: ${res.differential_ranking[0]?.source_syndromes.join(', ')}`);
    }

    if (!pass || !priorityPass) allPassed = false;
});

if (allPassed) {
    console.log(`\n${COLORS.bright}${COLORS.green}PRUEBA EXITOSA: La lógica de ambigüedad y el contrato de datos son estables.${COLORS.reset}`);
    process.exit(0);
} else {
    console.log(`\n${COLORS.bright}${COLORS.red}PRUEBA FALLIDA: Se detectó un comportamiento inesperado en el motor de ambigüedad.${COLORS.reset}`);
    process.exit(1);
}
