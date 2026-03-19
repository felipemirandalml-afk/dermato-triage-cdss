/**
 * export_service.js - Generador de Reportes Clínicos Estructurados
 * FASE 4: Interoperabilidad & Documentación Médica
 */

import { FEATURE_MAP_LABELS } from './constants.js';

/**
 * Transforma el resultado del motor en un reporte médico estructurado (texto plano).
 */
export function generateClinicalReport(formData, triageResult) {
    const syndromeLabels = {
        'eczema_dermatitis': "Eczema / Dermatitis",
        'psoriasiform_dermatosis': "Dermatosis Psoriasiforme",
        'bacterial_skin_infection': "Infección Bacteriana",
        'viral_skin_infection': "Infección Viral",
        'fungal_skin_infection': "Infección Fúngica",
        'drug_reaction': "Reacción a Fármacos",
        'urticarial_dermatosis': "Urticaria / Angioedema",
        'vesiculobullous_disease': "Enfermedad Ampollosa",
        'vasculitic_purpuric_disease': "Vasculitis / Púrpura",
        'cutaneous_tumor_suspected': "Sospecha de Neoplasia Maligna",
        'benign_cutaneous_tumor': "Tumoración Benigna",
        'inflammatory_dermatosis_other': "Otra Dermatosis Inflamatoria"
    };

    const timingMap = {
        'acute': 'agudo (< 2 semanas)',
        'subacute': 'subagudo (2-6 semanas)',
        'chronic': 'crónico (> 6 semanas)'
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CL');
    const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    
    const pa = triageResult.probabilistic_analysis;
    const topSynd = syndromeLabels[pa.top_syndrome] || pa.top_syndrome || "Patrón Indeterminado";

    const confMap = {
        'high': 'ALTA CONSISTENCIA',
        'medium': 'SUGESTIVO (MEDIA)',
        'low': 'ANÁLISIS AMBIGUO'
    };

    // --- CONSTRUCCIÓN DEL REPORTE (ESTILO CLÍNICO S.O.A.P.) ---
    let report = `REPORTE DE SOPORTE A LA DECISIÓN DERMATOLÓGICA (APS)\n`;
    report += `Emitido: ${dateStr} ${timeStr} | ID: ${Math.floor(1000 + Math.random() * 9000)}\n`;
    report += `----------------------------------------------------------\n\n`;

    // S: SUBJETIVO / DATOS BASALES
    report += `[S] DATOS DEL PACIENTE:\n`;
    report += `- Edad: ${formData.age} años\n`;
    report += `- Sexo: ${formData.sexo_female ? 'Femenino' : 'Masculino'}\n`;
    report += `- Fototipo: Fitzpatrick ${formData.fitzpatrick}\n`;
    report += `- Tiempo de Evolución: ${timingMap[formData.timing] || 'No especificado'}\n\n`;

    // O: OBJETIVO / HALLAZGOS
    report += `[O] SEMIOLOGÍA CUTÁNEA DETECTADA:\n`;
    const activeFeatures = Object.keys(formData)
        .filter(key => key.startsWith('lesion_') || key.startsWith('topog_') || key.startsWith('patron_'))
        .map(key => FEATURE_MAP_LABELS[key] || key.replace('lesion_','').toUpperCase().replace(/_/g,' '))
        .join(', ');
    
    report += activeFeatures ? `- Hallazgos: ${activeFeatures}\n` : `- Sin hallazgos específicos registrados.\n`;
    
    if (triageResult.redFlags && triageResult.redFlags.length > 0) {
        report += `- RED FLAGS: ${triageResult.redFlags.join(', ')}\n`;
    }
    report += `\n`;

    // A: ANÁLISIS / IMPRESIÓN
    report += `[A] ANÁLISIS DEL SISTEMA (CDSS):\n`;
    report += `- Prioridad: P${triageResult.priority} (${triageResult.label.split('-')[1].trim()})\n`;
    report += `- Sospecha Sindrómica: ${topSynd}\n`;
    report += `- Consistencia del Patrón: ${confMap[pa.confidence_level] || pa.confidence_level.toUpperCase()}\n`;
    report += `- Justificación Triage: ${triageResult.justification}\n`;
    
    if (triageResult.triggered_rules && triageResult.triggered_rules.length > 0) {
        report += `- Reglas Activadas:\n`;
        triageResult.triggered_rules.forEach(rule => {
            report += `  * ${rule.replace(/🚨|⚠️|ℹ️|✨/g, '').trim()}\n`;
        });
    }
    report += `\n`;

    // P: PLAN / CONDUCTA
    report += `[P] CONDUCTA SUGERIDA:\n`;
    report += `- Acción Recomendada: ${triageResult.conduct}\n`;
    report += `- Plazo de Atención: ${triageResult.timeframe}\n\n`;

    report += `----------------------------------------------------------\n`;
    report += `Generado por DermatoTriage Engine v1.1.2\n`;
    report += `NOTA: Este informe es una herramienta de soporte. La decisión final\n`;
    report += `depende de la evaluación presencial del profesional médico.\n`;

    return report;
}
