/**
 * hardening_cases_v2.js - Validación Clínica Avanzada (Casos Frontera y Compuestos)
 * Diseñado para estresar las capas de inteligencia Derm1M y Reasoning Map.
 */

export const HARDENING_CASES = [
    {
        id: "TC-H2-01",
        title: "Eczema Atópico Sobreinfectado (Impetiginizado)",
        difficulty_type: "compound",
        short_clinical_summary: "Paciente con dermatitis atópica conocida que presenta aparición súbita de costras mielicéricas, exudado y fiebre de 38°C.",
        input: {
            age: 8,
            lesion_escama: true,
            lesion_costra: true, // Hallazgo clave de infección
            signo_fiebre: true,  // Elevación de prioridad
            flexural: true,      // Patrón atópico
            timing: "acute"      // Sobre base crónica
        },
        expected_priority: 1,
        expected_syndrome: "bacterial_skin_infection",
        notes: "Caso compuesto donde la infección aguda debe dominar el triage (P1) y el ranking (Infección Bacteriana).",
        explainability_goals: ["Pearl: infectious_diseases", "Supporting: costra, fiebre"]
    },
    {
        id: "TC-H2-02",
        title: "Lúes II (Sífilis Secundaria) - El gran imitador",
        difficulty_type: "frontier_diagnostic",
        short_clinical_summary: "Exantema papuloescamoso generalizado que afecta palmas y plantas, simulando pitiriasis rosada.",
        input: {
            age: 28,
            lesion_papula: true,
            lesion_escama: true,
            generalizado: true,
            patron_acral: true,   // Hallazgo clave de atipicidad para PR
            timing: "subacute"
        },
        expected_priority: 2,
        expected_syndrome: "inflammatory_dermatosis_other", // Donde suele caer Sífilis en el modelo base
        notes: "Mimetismo con Pitiriasis Rosada. El patrón acral debe activar sospecha en el Reasoning Map.",
        explainability_goals: ["Reasoning: summary", "Missing: feature inconsistency"]
    },
    {
        id: "TC-H2-03",
        title: "Zoster Sine Herpete (Herpes Zóster sin Vesículas)",
        difficulty_type: "frontier_pattern",
        short_clinical_summary: "Dolor lancinante intenso en trayecto intercostal derecho de 3 días de evolución, sin lesiones elementales visibles salvo leve eritema.",
        input: {
            age: 65,
            signo_dolor: true,    // Hallazgo dominante
            topog_tronco: true,
            dermatomal: true,     // Clave diagnóstica (corregida)
            lesion_eritema: true,
            timing: "acute"
        },
        expected_priority: 2, // Prioridad corregida: Zoster tronco es P2 prioritario, no urgencial
        expected_syndrome: "viral_skin_infection",
        notes: "Estresa el motor al no tener vesículas (morfología primaria ausente). Se apoya en patrón y síntoma.",
        explainability_goals: ["Pearl: infectious_diseases", "Supporting: dolor, dermatomal"]
    },
    {
        id: "TC-H2-04",
        title: "Melanoma Amelanótico (Nodular)",
        difficulty_type: "atypical_oncology",
        short_clinical_summary: "Nódulo rosado de crecimiento rápido en pierna, asimétrico, sin pigmento visible a simple vista.",
        input: {
            age: 55,
            lesion_nodulo: true,
            lesion_eritema: true,
            topog_ext_inf: true,
            timing: "subacute"
        },
        expected_priority: 2,
        expected_syndrome: "cutaneous_tumor_suspected",
        notes: "Variante agresiva sin el hallazgo 'hiperpigmentación'. Evalúa si Derm1M mantiene al Melanoma en el top del diferencial.",
        explainability_goals: ["Differential: Melanoma Rank 1", "Pearl: neoplastic_disorders"]
    },
    {
        id: "TC-H2-05",
        title: "Erisipela Facial vs Dermatitis Seborreica",
        difficulty_type: "frontier_priority",
        short_clinical_summary: "Placa eritematosa brillante en mejilla derecha, caliente, con fiebre y malestar, iniciada hace 24h.",
        input: {
            age: 72,
            lesion_eritema: true,
            signo_fiebre: true,   // Diferenciador clave
            signo_dolor: true,    // Diferenciador clave
            topog_cabeza: true,
            topo_cara_centro: true,
            timing: "acute"
        },
        expected_priority: 1,
        expected_syndrome: "bacterial_skin_infection",
        notes: "Frontera entre inflamatorio crónico y urgencia infecciosa facial (P1).",
        explainability_goals: ["Red Flag: Fiebre", "Reasoning: summary bacterial"]
    }
];
