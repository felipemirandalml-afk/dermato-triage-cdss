import { runTriage } from '../model.js';
import { CLINICAL_CASES } from '../data/clinical_cases.js';
import { HARDENING_CASES } from '../data/hardening_cases_v2.js';
import { SYNDROME_TO_ONTOLOGY_MAP } from '../engine/syndrome_to_ontology_map.js';
import fs from 'fs';

const ALL_CASES = [...CLINICAL_CASES, ...HARDENING_CASES];

const groupMap = {
    'VIRAL': { syndromes: ['viral_skin_infection'], results: [] },
    'BACTERIANO': { syndromes: ['bacterial_skin_infection'], results: [] },
    'FUNGICO': { syndromes: ['fungal_skin_infection'], results: [] },
    'INFLAMATORIO': { syndromes: ['eczema_dermatitis', 'psoriasiform_dermatosis', 'drug_reaction', 'urticarial_dermatosis', 'vesiculobullous_disease', 'inflammatory_dermatosis_other'], results: [] },
    'PROLIFERATIVO': { syndromes: ['cutaneous_tumor_suspected', 'benign_cutaneous_tumor'], results: [] },
    'VASCULAR': { syndromes: ['vasculitic_purpuric_disease'], results: [] },
    'SEGURIDAD_P1': { results: [], isPriorityBased: true }
};

console.log("=== EJECUTANDO VALIDACIÓN ESTRUCTURADA POR GRUPOS (FASE 8) ===");

ALL_CASES.forEach(c => {
    const res = runTriage(c.input);
    const topSyndrome = res.probabilistic_analysis.top_syndrome;
    const isPriorityMatch = res.priority === c.expected_priority;
    const isSyndromeMatch = !c.expected_syndrome || topSyndrome === c.expected_syndrome;

    const outcome = {
        id: c.id,
        title: c.title,
        priorityOk: isPriorityMatch,
        syndromeOk: isSyndromeMatch,
        gotPriority: res.priority,
        expectedPriority: c.expected_priority,
        gotSyndrome: topSyndrome,
        expectedSyndrome: c.expected_syndrome
    };

    // Asignar a grupos diagnósticos
    for (const [groupName, config] of Object.entries(groupMap)) {
        if (config.isPriorityBased) {
            if (c.expected_priority === 1) groupMap[groupName].results.push(outcome);
        } else if (config.syndromes.includes(c.expected_syndrome)) {
            groupMap[groupName].results.push(outcome);
        }
    }
});

// Generar Reporte Markdown
let report = `# Reporte de Validación por Grupos Diagnósticos (Fase 8)\n\n`;
report += `Fecha: ${new Date().toISOString().split('T')[0]}\n\n`;

for (const [groupName, group] of Object.entries(groupMap)) {
    const total = group.results.length;
    if (total === 0) continue;
    
    const pOk = group.results.filter(r => r.priorityOk).length;
    const sOk = group.results.filter(r => r.syndromeOk).length;
    
    report += `## Grupo: ${groupName}\n`;
    report += `- Total Casos: ${total}\n`;
    report += `- Precisión Prioridad: ${((pOk/total)*100).toFixed(1)}%\n`;
    report += `- Precisión Síndrome: ${((sOk/total)*100).toFixed(1)}%\n\n`;
    
    if (pOk < total || sOk < total) {
        report += `### Fallos / Discrepancias:\n`;
        group.results.filter(r => !r.priorityOk || !r.syndromeOk).forEach(r => {
            report += `- [${r.id}] ${r.title}\n`;
            if (!r.priorityOk) report += `  - P: Exp ${r.expectedPriority} | Got ${r.gotPriority}\n`;
            if (!r.syndromeOk) report += `  - S: Exp ${r.expectedSyndrome} | Got ${r.gotSyndrome}\n`;
        });
        report += `\n`;
    }
}

fs.writeFileSync('d:/dermato-triage-cdss/reports/fase8_validation_by_group.md', report);
console.log("Reporte generado en reports/fase8_validation_by_group.md");
console.log("Reporte generado en reports/fase8_validation_by_group.md");
process.exit(0);
