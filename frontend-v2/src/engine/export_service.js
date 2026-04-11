/**
 * export_service.js - Generador de reportes clinicos estructurados.
 */

import { FEATURE_MAP_LABELS } from './constants.js';

export function generateClinicalReport(formData, triageResult) {
    const syndromeLabels = {
        eczema_dermatitis: 'Eczema / Dermatitis',
        psoriasiform_dermatosis: 'Dermatosis psoriasiforme',
        bacterial_skin_infection: 'Infeccion bacteriana',
        viral_skin_infection: 'Infeccion viral',
        fungal_skin_infection: 'Infeccion fungica',
        drug_reaction: 'Reaccion a farmacos',
        urticarial_dermatosis: 'Urticaria / Angioedema',
        vesiculobullous_disease: 'Enfermedad ampollosa',
        vasculitic_purpuric_disease: 'Vasculitis / Purpura',
        cutaneous_tumor_suspected: 'Sospecha de neoplasia maligna',
        benign_cutaneous_tumor: 'Tumoracion benigna',
        inflammatory_dermatosis_other: 'Otra dermatosis inflamatoria'
    };

    const timingMap = {
        agudo: 'agudo (< 2 semanas)',
        subagudo: 'subagudo (2-6 semanas)',
        cronico: 'cronico (> 6 semanas)'
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CL');
    const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const pa = triageResult.probabilistic_analysis || {
        top_syndrome: null,
        confidence_level: 'low'
    };
    const prioritySummary = triageResult.label?.includes(' - ')
        ? triageResult.label.split(' - ').slice(1).join(' - ').trim()
        : (triageResult.label || 'No especificado');
    const topSynd = syndromeLabels[pa.top_syndrome] || pa.top_syndrome || 'Patron indeterminado';

    const confMap = {
        high: 'ALTA CONSISTENCIA',
        medium: 'SUGESTIVO (MEDIA)',
        low: 'ANALISIS AMBIGUO'
    };

    let report = 'REPORTE DE SOPORTE A LA DECISION DERMATOLOGICA (APS)\n';
    report += `Emitido: ${dateStr} ${timeStr} | ID: ${Math.floor(1000 + Math.random() * 9000)}\n`;
    report += '----------------------------------------------------------\n\n';

    report += '[S] DATOS DEL PACIENTE:\n';
    report += `- Edad: ${formData.age || 'No especificada'}\n`;
    report += `- Sexo: ${formData.sex === 'female' ? 'Femenino' : formData.sex === 'male' ? 'Masculino' : 'No especificado'}\n`;
    report += `- Fototipo: Fitzpatrick ${formData.fitzpatrick || 'No especificado'}\n`;
    report += `- Tiempo de evolucion: ${timingMap[formData.timing] || 'No especificado'}\n\n`;

    report += '[O] SEMIOLOGIA CUTANEA DETECTADA:\n';
    const activeFeatures = Object.keys(formData.features || {})
        .filter((key) => formData.features[key] === true)
        .map((key) => FEATURE_MAP_LABELS[key] || key.replace(/_/g, ' ').toUpperCase())
        .join(', ');

    report += activeFeatures ? `- Hallazgos: ${activeFeatures}\n` : '- Sin hallazgos especificos registrados.\n';

    if (triageResult.redFlags && triageResult.redFlags.length > 0) {
        report += `- RED FLAGS: ${triageResult.redFlags.join(', ')}\n`;
    }
    report += '\n';

    report += '[A] ANALISIS DEL SISTEMA (CDSS):\n';
    report += `- Prioridad: ${triageResult.priority_code || `P${triageResult.priority}`} (${prioritySummary})\n`;
    report += `- Sospecha sindromica: ${topSynd}\n`;
    report += `- Consistencia del patron: ${confMap[pa.confidence_level] || pa.confidence_level.toUpperCase()}\n`;

    if (triageResult.reasoning_insights) {
        report += `- Perspectiva clinica: ${triageResult.reasoning_insights.summary}\n`;
        report += `- Perla clinica: ${triageResult.reasoning_insights.pearl}\n`;
    }

    report += `- Justificacion triage: ${triageResult.justification}\n`;

    if (triageResult.triggered_rules && triageResult.triggered_rules.length > 0) {
        report += '- Reglas activadas:\n';
        triageResult.triggered_rules.forEach((rule) => {
            report += `  * ${rule.replace(/^\[(ALERTA|BLOQUEO|AJUSTE)\]\s*/g, '').trim()}\n`;
        });
    }

    if (triageResult.differential_ranking && triageResult.differential_ranking.length > 0) {
        report += '- Diagnosticos diferenciales (Top 3):\n';
        triageResult.differential_ranking.forEach((item, idx) => {
            report += `  ${idx + 1}. ${item.disease_name} (Compatibilidad: ${item.compatibility})\n`;
            if (item.supporting_features?.length) {
                report += `     + Apoyado por: ${item.supporting_features.join(', ')}\n`;
            }
            if (item.missing_critical_features?.length) {
                report += `     ! Ausencia de: ${item.missing_critical_features.join(', ')}\n`;
            }
        });
    }
    report += '\n';

    report += '[P] CONDUCTA SUGERIDA:\n';
    report += `- Accion recomendada: ${triageResult.conduct}\n`;
    report += `- Plazo de atencion: ${triageResult.timeframe}\n\n`;

    report += '----------------------------------------------------------\n';
    report += 'Generado por DermatoTriage Engine v1.1.2\n';
    report += 'NOTA: Este informe es una herramienta de soporte. La decision final\n';
    report += 'depende de la evaluacion presencial del profesional medico.\n';

    return report;
}
