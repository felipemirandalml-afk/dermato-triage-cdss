/**
 * clinical_cases.js - Dataset de Validación Clínica v1.0
 * Casos índice representativos para el motor DermatoTriage CDSS.
 */

export const CLINICAL_CASES = [
    {
        id: "TC-001",
        title: "Dermatitis Atópica Localizada",
        short_clinical_summary: "Paciente con eccema pruriginoso en flexuras de larga data, sin signos sistémicos.",
        input: {
            age: 25,
            lesion_escama: true,
            lesion_liquenificacion: true,
            patron_flexoras: true,
            timing: "chronic"
        },
        expected_priority: 3,
        notes: "Caso estable, manejo ambulatorio estándar."
    },
    {
        id: "TC-002",
        title: "Acné Inflamatorio Grado II",
        short_clinical_summary: "Pápulas y pústulas en cara en adolescente, sin dolor extremo ni fiebre.",
        input: {
            age: 16,
            lesion_papula: true,
            lesion_pustula: true,
            topog_cabeza: true,
            topo_cara_centro: true,
            timing: "subacute"
        },
        expected_priority: 3,
        notes: "Condición común, sin riesgo vital."
    },
    {
        id: "TC-003",
        title: "Psoriasis en Placas Extensa",
        short_clinical_summary: "Placas eritemato-escamosas simétricas en codos, rodillas y tronco.",
        input: {
            age: 40,
            lesion_placa: true,
            lesion_escama: true,
            topog_tronco: true,
            topog_ext_inf: true,
            topo_rodillas: true,
            patron_simetrico: true,
            timing: "chronic"
        },
        expected_priority: 3,
        notes: "Aunque es extensa, la ausencia de eritrodermia o fiebre la mantiene en P3."
    },
    {
        id: "TC-004",
        title: "Rosácea Papulopustulosa",
        short_clinical_summary: "Eritema centrofacial persistente con pápulas inflamatorias.",
        input: {
            age: 35,
            lesion_eritema: true,
            lesion_papula: true,
            topog_cabeza: true,
            topo_cara_centro: true,
            patron_seborreica: true,
            timing: "chronic"
        },
        expected_priority: 3,
        notes: "Derivación estándar a dermatología."
    },
    {
        id: "TC-005",
        title: "Herpes Zóster Intercostal",
        short_clinical_summary: "Vesículas sobre base eritematosa en trayecto dermatomal, dolor intenso.",
        input: {
            age: 65,
            lesion_vesicula: true,
            lesion_eritema: true,
            signo_dolor: true,
            topog_tronco: true,
            patron_dermatomal: true,
            timing: "acute"
        },
        expected_priority: 2,
        notes: "Requiere tratamiento antiviral precoz por dolor y localización."
    },
    {
        id: "TC-006",
        title: "Celulitis en Miembro Inferior",
        short_clinical_summary: "Placa eritematosa, caliente y dolorosa en pierna con aumento progresivo.",
        input: {
            age: 50,
            lesion_eritema: true,
            signo_dolor: true,
            topog_ext_inf: true,
            topo_espinillas: true,
            timing: "acute"
        },
        expected_priority: 2,
        notes: "Evolución aguda con dolor, requiere evaluación presencial inmediata."
    },
    {
        id: "TC-007",
        title: "Exantema Medicamentoso Simple",
        short_clinical_summary: "Erupción morbiliforme tras inicio de antibiótico, sin fiebre ni ampollas.",
        input: {
            age: 28,
            lesion_macula: true,
            lesion_papula: true,
            patron_generalizado: true,
            timing: "acute"
        },
        expected_priority: 2,
        notes: "Reacción adversa a fármacos, requiere suspensión y vigilancia."
    },
    {
        id: "TC-008",
        title: "Carcinoma Basocelular Sospechoso",
        short_clinical_summary: "Nódulo perlado con telangiectasias en ala nasal de meses de evolución.",
        input: {
            age: 70,
            lesion_nodulo: true,
            lesion_telangiectasia: true,
            topog_cabeza: true,
            topo_cara_centro: true,
            timing: "chronic"
        },
        expected_priority: 2,
        notes: "Neoplasia maligna de crecimiento lento, requiere derivación prioritaria."
    },
    {
        id: "TC-009",
        title: "Síndrome de Stevens-Johnson (SJS)",
        short_clinical_summary: "Ampollas, desprendimiento epidérmico, compromiso de mucosas y fiebre tras fármaco.",
        input: {
            age: 45,
            farmacos_recientes: true,
            signo_fiebre: true,
            lesion_ampolla: true,
            lesion_macula: true,
            signo_mucosas: true,
            topog_mucosas: true,
            patron_generalizado: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "URGENCIA VITAL. Riesgo de muerte por falla multiorgánica."
    },
    {
        id: "TC-010",
        title: "Vasculitis Leucocitoclástica con Sistémica",
        short_clinical_summary: "Púrpura palpable en extremidades inferiores con fiebre y dolor articular.",
        input: {
            age: 55,
            lesion_purpura: true,
            signo_fiebre: true,
            signo_dolor: true,
            topog_ext_inf: true,
            topo_tobillos: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Púrpura + Fiebre es una bandera roja crítica."
    },
    {
        id: "TC-011",
        title: "Pénfigo Vulgar Agudo",
        short_clinical_summary: "Ampollas flácidas que dejan erosiones dolorosas, signo de Nikolsky +.",
        input: {
            age: 50,
            lesion_ampolla: true,
            lesion_erosion: true,
            signo_mucosas: true,
            signo_dolor: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Enfermedad ampollosa autoinmune grave."
    },
    {
        id: "TC-012",
        title: "Fascitis Necrotizante (Sospecha Early)",
        short_clinical_summary: "Dolor desproporcionado a la lesión física, edema tenso y fiebre.",
        input: {
            age: 60,
            signo_dolor: true,
            signo_fiebre: true,
            topog_ext_inf: true,
            lesion_eritema: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Dolor desproporcionado + Fiebre = Emergencia Quirúrgica."
    }
];
