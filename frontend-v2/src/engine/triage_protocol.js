/**
 * triage_protocol.js — Capas 0 y 1 del triage (reemplazo de WEIGHT_MATRIX)
 *
 * Fuente clínica: docs/ssmso_triage_map.md (protocolo SSMSO Res. 2499/2022 para los
 * síndromes ambulatorios + guías nac/internacionales para los agudos). Cada valor
 * tiene fuente citable — no hay números mágicos (ver METHODS §5.3, regla rectora §2).
 *
 *   Capa 0 — SYNDROME_BASELINE_URGENCY: urgencia basal (piso) por síndrome.
 *   Capa 1 — applySeverityModifiers: criterios de severidad/extensión que escalan P3→P2.
 *   Capa 2 (banderas rojas → P1) vive en safety_modifiers.js / context_modifiers.js.
 */

// Capa 0 — urgencia basal por síndrome (1 = P1, 2 = P2, 3 = P3).
// La mayoría son ambulatorios (P3); los agudos/de especialidad tienen piso P2
// ("derivar siempre", no se manejan en APS).
export const SYNDROME_BASELINE_URGENCY = {
    eczema_dermatitis: 3,
    psoriasiform_dermatosis: 3,
    fungal_skin_infection: 3,
    viral_skin_infection: 3,
    inflammatory_dermatosis_other: 3,
    pigmentary_disorder: 3,
    benign_cutaneous_tumor: 3,
    bacterial_skin_infection: 3,
    drug_reaction: 3,
    urticarial_dermatosis: 3,
    // Piso P2 — no se manejan ambulatoriamente (ver docs/ssmso_triage_map.md)
    cutaneous_tumor_suspected: 2,
    vesiculobullous_disease: 2,
    vasculitic_purpuric_disease: 2,
    connective_tissue_disease: 2
};

export const DEFAULT_BASELINE = 3; // síndrome no reconocido / baja confianza → ambulatorio + red flags

// Mapeos ordinales para los inputs estructurados de severidad.
const MONTH_VALUE = { lt1: 0, '1to3': 2, '3to6': 4, gt6: 7 };
const COUNT_VALUE = { single: 1, few: 2, many: 3, numerous: 4 };

/**
 * Construye el contexto de evaluación de la Capa 1 a partir del helper de features
 * y de los sub-objetos estructurados del formulario (treatment, severity).
 */
export function makeTriageContext(helper, formData = {}) {
    const treatment = formData.treatment || {};
    const severity = formData.severity || {};
    return {
        has: (key) => helper.has(key),
        // refractariedad: recibió tratamiento + (sin respuesta o empeoró) + tiempo ≥ minMonths
        refractory: (minMonths = 0) =>
            treatment.received === 'yes' &&
            ['none', 'worsening'].includes(treatment.response) &&
            (MONTH_VALUE[treatment.months] ?? 0) >= minMonths,
        bsaOver: (pct) => Number(severity.bsaPercent) > pct,
        site: (name) => !!(severity.specialSites && severity.specialSites[name]),
        largeLesion: () => !!severity.largeLesion,
        countAtLeast: (level) => (COUNT_VALUE[severity.lesionCount] ?? 0) >= (COUNT_VALUE[level] ?? 99)
    };
}

// Capa 1 — reglas de severidad/extensión que escalan P3→P2. Cada una con su fuente.
// (Solo se evalúan cuando la prioridad actual es P3; nunca bajan de prioridad.)
const SEVERITY_RULES = [
    { syndromes: ['psoriasiform_dermatosis'], when: (c) => c.bsaOver(7), label: 'Psoriasis con BSA >7%', source: 'SSMSO 4.8' },
    { syndromes: ['psoriasiform_dermatosis'], when: (c) => c.refractory(3), label: 'Psoriasis sin respuesta a tratamiento', source: 'SSMSO 4.8' },
    { syndromes: ['eczema_dermatitis'], when: (c) => c.bsaOver(10), label: 'Dermatitis con BSA >10%', source: 'SSMSO 4.16' },
    { syndromes: ['eczema_dermatitis'], when: (c) => c.refractory(1), label: 'Dermatitis refractaria', source: 'SSMSO 4.5/4.13/4.16' },
    { syndromes: ['eczema_dermatitis'], when: (c) => c.site('palmoplantar'), label: 'Eczema palmoplantar persistente', source: 'SSMSO 4.13' },
    { syndromes: ['fungal_skin_infection'], when: (c) => c.refractory(3), label: 'Micosis sin respuesta a 3 meses', source: 'SSMSO 4.11/4.12' },
    { syndromes: ['viral_skin_infection'], when: (c) => c.site('periocular'), label: 'Lesión viral periocular', source: 'SSMSO 4.3/4.4/4.15' },
    { syndromes: ['viral_skin_infection'], when: (c) => c.site('anogenital'), label: 'Lesión viral anogenital', source: 'SSMSO 4.3/4.15' },
    { syndromes: ['viral_skin_infection'], when: (c) => c.refractory(3), label: 'Verrugas/molusco refractario', source: 'SSMSO 4.3/4.15' },
    { syndromes: ['viral_skin_infection'], when: (c) => c.countAtLeast('many'), label: 'Verrugas múltiples (>10)', source: 'SSMSO 4.15' },
    { syndromes: ['inflammatory_dermatosis_other'], when: (c) => c.refractory(6), label: 'Rosácea/acné refractario', source: 'SSMSO 4.1/4.14' },
    // Acné severo: requiere signo de acné (comedón o pústula) + severidad (nódulo o cicatriz),
    // para no escalar otros inflamatorios con nódulo (p. ej. escabiosis nodular).
    { syndromes: ['inflammatory_dermatosis_other'], when: (c) => (c.has('comedon') || c.has('pustula')) && (c.has('nodulo') || c.has('cicatriz')), label: 'Acné severo (nódulo-quístico o con cicatrices)', source: 'SSMSO 4.14' },
    { syndromes: ['inflammatory_dermatosis_other'], when: (c) => c.site('periocular'), label: 'Rosácea con compromiso ocular', source: 'SSMSO 4.1' },
    { syndromes: ['pigmentary_disorder'], when: (c) => c.has('generalizado'), label: 'Trastorno pigmentario extenso/progresivo', source: 'SSMSO 4.7' },
    { syndromes: ['benign_cutaneous_tumor'], when: (c) => c.largeLesion(), label: 'Tumor benigno >3 cm', source: 'SSMSO 4.2' },
    { syndromes: ['benign_cutaneous_tumor'], when: (c) => c.site('periocular') || c.site('anogenital'), label: 'Tumor benigno en sitio complejo', source: 'SSMSO 4.2' },
    { syndromes: ['bacterial_skin_infection'], when: (c) => c.refractory(1), label: 'Infección bacteriana sin respuesta', source: 'SSMSO / Hernández-Calle et al.' },
    { syndromes: ['urticarial_dermatosis'], when: (c) => c.has('cronico'), label: 'Urticaria crónica (>6 semanas)', source: 'guías de urticaria' },
    { syndromes: ['urticarial_dermatosis'], when: (c) => c.refractory(0), label: 'Urticaria refractaria/recurrente', source: 'guías de urticaria' },
    { syndromes: ['drug_reaction'], when: (c) => c.bsaOver(10), label: 'Farmacodermia extensa (BSA >10%)', source: 'guías farmacodermia' },
    { syndromes: ['drug_reaction'], when: (c) => c.refractory(0), label: 'Farmacodermia que no cede tras suspender el fármaco', source: 'guías farmacodermia' }
];

/**
 * Capa 1 — aplica los modificadores de severidad/extensión.
 * Solo escala P3→P2 (no toca P2/P1 ya establecidos, ni baja prioridad).
 */
export function applySeverityModifiers(syndrome, ctx, currentResult) {
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    if (priority <= 2) return { priority, modifier, rules, match: false };

    for (const rule of SEVERITY_RULES) {
        if (!rule.syndromes.includes(syndrome)) continue;
        if (rule.when(ctx)) {
            rules.push(`[SEVERIDAD] ${rule.label} (${rule.source})`);
            priority = 2;
            modifier = rule.label;
        }
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}
