import { runTriage } from '../../frontend-v2/src/engine/model.js';
import fs from 'fs';
import path from 'path';

/**
 * VERIFICADOR DE MOTOR CLÍNICO v2.1 
 * Basado en Benchmark Masivo para validar cambios de NotebookLM
 */

const casesPath = 'd:/dermato-triage-cdss/tests/generated_synthetic_cases_v2.json';
const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));

console.log(`\n🚀 INICIANDO VERIFICACIÓN DE MOTOR v2.1 (${cases.length} casos)`);
console.log(`- Fuente: ${casesPath}`);
console.log(`- Objetivo: Validación de Reglas Académicas y Limpieza de Repositorio\n`);

const stats = {
    total: cases.length,
    priorityOk: 0,
    syndromeOk: 0,
    safetyShieldsTriggered: 0,
    failures: [],
    variants: { 
        core: { ok:0, total:0 }, 
        sparse: { ok:0, total:0 }, 
        atypical: { ok:0, total:0 }, 
        borderline: { ok:0, total:0 }, 
        stress: { ok:0, total:0 } 
    }
};

const startTime = Date.now();

// Silent benchmark for large-scale validation
cases.forEach((c, idx) => {
    // Proceso silencioso para evitar overflow de tokens en el terminal
    
    // Inyectamos idioma por defecto
    const res = runTriage(c.input, 'es');
    const topSyn = res.probabilistic_analysis.top_syndrome;
    
    // Verificamos si se activó algún escudo tras mis cambios
    if (res.modifier) stats.safetyShieldsTriggered++;

    // Mapeo de compatibilidad para síndromes fusionados
    const mapSyn = (s) => {
        if (s === 'ectoparasitosis_scabies' || s === 'appendage_disorders_acne' || s === 'pigmentary_disorder') 
            return 'inflammatory_dermatosis_other';
        return s;
    };

    const pOk = res.priority === c.expected_priority;
    const sOk = mapSyn(topSyn) === mapSyn(c.expected_syndrome);

    if (pOk) stats.priorityOk++;
    if (sOk) stats.syndromeOk++;

    // Track por variante
    if (stats.variants[c.variant_type]) {
        stats.variants[c.variant_type].total++;
        if (pOk && sOk) stats.variants[c.variant_type].ok++;
    }

    if (!pOk || !sOk) {
        if (stats.failures.length < 100) { // Solo guardamos los primeros 100 fallos para análisis
            stats.failures.push({
                id: c.id,
                variant: c.variant_type,
                expected: { p: c.expected_priority, s: c.expected_syndrome },
                got: { p: res.priority, s: topSyn },
                modifier: res.modifier
            });
        }
    }
});

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
const pAcc = ((stats.priorityOk / stats.total) * 100).toFixed(2);
const sAcc = ((stats.syndromeOk / stats.total) * 100).toFixed(2);

console.log(`\n\n✅ VERIFICACIÓN COMPLETADA EN ${duration}s`);
console.log(`------------------------------------------`);
console.log(`📊 RESULTADOS GENERALES:`);
console.log(`- Precisión de Prioridad (Triage): ${pAcc}%`);
console.log(`- Precisión de Síndrome (IA):      ${sAcc}%`);
console.log(`- Escudos de Seguridad Activados:  ${stats.safetyShieldsTriggered}`);
console.log(`------------------------------------------`);

console.log(`\n🛡️ ANÁLISIS DE RESILIENCIA POR VARIANTE:`);
for (const [v, d] of Object.entries(stats.variants)) {
    const acc = d.total > 0 ? ((d.ok/d.total)*100).toFixed(1) : 0;
    console.log(`- ${v.toUpperCase().padEnd(10)}: ${acc}% (${d.ok}/${d.total})`);
}

// Generar reporte de integridad
const reportPath = 'd:/dermato-triage-cdss/reports/v2_1_integrity_report.json';
fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    accuracy: { priority: pAcc, syndrome: sAcc }
}, null, 2));

console.log(`\n📁 Reporte de integridad generado en: ${reportPath}`);
process.exit(0);
