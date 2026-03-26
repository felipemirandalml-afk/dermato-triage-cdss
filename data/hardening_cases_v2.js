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
            escama: true,
            costra: true,
            fiebre: true,
            topo_flexural_pliegues: true,
            extremidad_superior: true,
            timing: "acute"
        },
        expected_priority: 1,
        expected_syndrome: "bacterial_skin_infection",
        notes: "Caso compuesto donde la infección aguda debe dominar el triage (P1).",
        explainability_goals: ["Pearl: infectious_diseases", "Supporting: costra, fiebre"]
    },
    {
        id: "TC-H2-02",
        title: "Lúes II (Sífilis Secundaria) - El gran imitador",
        difficulty_type: "frontier_diagnostic",
        short_clinical_summary: "Exantema papuloescamoso generalizado que afecta palmas y plantas, simulando pitiriasis rosada.",
        input: {
            age: 28,
            papula: true,
            escama: true,
            generalizado: true,
            acral: true,
            pies: true,
            timing: "subacute"
        },
        expected_priority: 2,
        expected_syndrome: "inflammatory_dermatosis_other",
        notes: "Mimetismo con Pitiriasis Rosada. El patrón acral en el modelo es clave.",
        explainability_goals: ["Reasoning: summary", "Missing: feature inconsistency"]
    },
    {
        id: "TC-H2-03",
        title: "Zoster Sine Herpete (Herpes Zóster sin Vesículas)",
        difficulty_type: "frontier_pattern",
        short_clinical_summary: "Dolor lancinante intenso en trayecto intercostal derecho de 3 días de evolución, sin lesiones elementales visibles salvo leve eritema.",
        input: {
            age: 65,
            dolor: true,
            tronco: true,
            dermatomal: true,
            zosteriforme: true,
            eritema: true,
            timing: "acute"
        },
        expected_priority: 2,
        expected_syndrome: "viral_skin_infection",
        notes: "Estresa el motor al no tener vesículas. Se apoya en patrón zosteriforme y síntoma.",
        explainability_goals: ["Pearl: infectious_diseases", "Supporting: dolor, dermatomal"]
    },
    {
        id: "TC-H2-04",
        title: "Melanoma Amelanótico (Nodular)",
        difficulty_type: "atypical_oncology",
        short_clinical_summary: "Nódulo rosado de crecimiento rápido en pierna, asimétrico, sin pigmento visible a simple vista.",
        input: {
            age: 55,
            nodulo: true,
            eritema: true,
            extremidad_inferior: true,
            localizado: true,
            timing: "subacute"
        },
        expected_priority: 2,
        expected_syndrome: "cutaneous_tumor_suspected",
        notes: "Variante agresiva sin el hallazgo 'hiperpigmentación'.",
        explainability_goals: ["Differential: Melanoma Rank 1", "Pearl: neoplastic_disorders"]
    },
    {
        id: "TC-H2-05",
        title: "Erisipela Facial vs Dermatitis Seborreica",
        difficulty_type: "frontier_priority",
        short_clinical_summary: "Placa eritematosa brillante en mejilla derecha, caliente, con fiebre y malestar, iniciada hace 24h.",
        input: {
            age: 72,
            eritema: true,
            fiebre: true,
            dolor: true,
            cabeza: true,
            cara_centro: true,
            timing: "acute"
        },
        expected_priority: 1,
        expected_syndrome: "bacterial_skin_infection",
        notes: "Frontera entre inflamatorio crónico y urgencia infecciosa facial (P1).",
        explainability_goals: ["Red Flag: Fiebre", "Reasoning: summary bacterial"]
    }
];
