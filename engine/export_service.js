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

    const now = new Date().toLocaleString();
    const pa = triageResult.probabilistic_analysis;
    const topSynd = syndromeLabels[pa.top_syndrome] || pa.top_syndrome || "Patrón Indeterminado";

    // 1. MOTIVO DE CONSULTA & DATOS BASALES
    let report = `==================================================\n`;
    report += `INFORME CLÍNICO DE TRIAGE DERMATOLÓGICO (CDSS)\n`;
    report += `==================================================\n`;
    report += `Fecha: ${now}\n`;
    report += `Paciente: ${formData.age} años | Sexo: ${formData.sexo_female ? 'Femenino' : 'Masculino'}\n`;
    report += `Fototipo: Fitzpatrick ${formData.fitzpatrick}\n`;
    report += `--------------------------------------------------\n\n`;

    report += `1. BREVE RESUMEN SEMIOLÓGICO\n`;
    report += `Cuadro de evolución ${timingMap[formData.timing] || 'no especificada'}.\n`;
    
    // Extraer lesiones y topografía activas
    const activeFeatures = Object.keys(formData)
        .filter(key => key.startsWith('lesion_') || key.startsWith('topog_') || key.startsWith('patron_'))
        .map(key => FEATURE_MAP_LABELS[key] || key.replace('lesion_','').toUpperCase().replace(/_/g,' '))
        .join(', ');
    
    if (activeFeatures) {
        report += `Hallazgos predominantes: ${activeFeatures}.\n`;
    }
    report += `\n`;

    // 2. HALLAZGOS CRÍTICOS (HEURÍSTICA)
    report += `2. SEGURIDAD CLÍNICA & RED FLAGS\n`;
    if (triageResult.triggered_rules && triageResult.triggered_rules.length > 0) {
        triageResult.triggered_rules.forEach(rule => {
            report += `- ${rule.replace(/🚨|⚠️|ℹ️|✨/g, '').trim()}\n`;
        });
    } else {
        report += `No se detectaron red flags inmediatas por reglas heurísticas.\n`;
    }
    report += `\n`;

    // 3. ANÁLISIS SINDRÓMICO (MOTOR PROBABILÍSTICO)
    report += `3. ANÁLISIS SINDRÓMICO\n`;
    report += `Presunción: ${topSynd}\n`;
    report += `Confianza: ${pa.confidence_level.toUpperCase()} (${(pa.top_probability * 100).toFixed(1)}%)\n\n`;

    if (pa.feature_importance) {
        report += `Factores determinantes presentes:\n`;
        pa.feature_importance.positive.forEach(f => {
            const label = FEATURE_MAP_LABELS[f.key] || f.key.toUpperCase().replace(/_/g,' ');
            report += `  (+) ${label}\n`;
        });
        pa.feature_importance.negative.forEach(f => {
            const label = FEATURE_MAP_LABELS[f.key] || f.key.toUpperCase().replace(/_/g,' ');
            report += `  (-) Ausencia de: ${label}\n`;
        });
    }
    report += `\n`;

    // 4. CONDUCTA SUGERIDA (TRIAGE)
    report += `4. SUGERENCIA DE CONDUCTA (TRIAGE)\n`;
    report += `PRIORIDAD: P${triageResult.priority} - ${triageResult.label.split('-')[1].trim()}\n`;
    report += `Recomendación: ${triageResult.conduct}\n`;
    report += `Plazo sugerido: ${triageResult.timeframe}\n`;
    report += `\n--------------------------------------------------\n`;
    report += `Generado por DermatoTriage CDSS Algorithm v1.1\n`;
    report += `Aviso: Este reporte es un soporte a la decisión y debe ser validado por un médico.\n`;

    return report;
}
