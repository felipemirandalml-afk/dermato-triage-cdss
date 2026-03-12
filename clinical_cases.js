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
            farmacos_recientes: true,
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
    },
    {
        id: "TC-013",
        title: "Urticaria Aguda Extensa",
        short_clinical_summary: "Habones generalizados evanescentes, muy pruriginosos, sin angioedema ni disnea.",
        input: {
            age: 30,
            lesion_habon: true,
            patron_generalizado: true,
            timing: "acute"
        },
        expected_priority: 2,
        notes: "Aunque es generalizada, la falta de compromiso sistémico la mantiene en P2."
    },
    {
        id: "TC-014",
        title: "Pitiriasis Rosada (Gibert)",
        short_clinical_summary: "Placa heráldica seguida de exantema en árbol de navidad en tronco.",
        input: {
            age: 22,
            lesion_placa: true,
            lesion_escama: true,
            topog_tronco: true,
            patron_seborreica: true, // A veces se confunde en topografía
            timing: "subacute"
        },
        expected_priority: 3,
        notes: "Cuadro autolimitado benigno."
    },
    {
        id: "TC-015",
        title: "Tiña Corporis Extensa",
        short_clinical_summary: "Múltiples placas anulares con borde activo descamativo en tronco y extremidades.",
        input: {
            age: 12,
            lesion_placa: true,
            lesion_escama: true,
            topog_tronco: true,
            topog_ext_inf: true,
            timing: "chronic"
        },
        expected_priority: 3,
        notes: "Uso de antifúngicos tópicos/orales, no requiere urgencia."
    },
    {
        id: "TC-016",
        title: "Impétigo Melicérico Localizado",
        short_clinical_summary: "Costras mielicéricas periorificiales en paciente pediátrico.",
        input: {
            age: 5,
            lesion_costra: true,
            lesion_eritema: true,
            topog_cabeza: true,
            topo_cara_centro: true,
            timing: "acute"
        },
        expected_priority: 3,
        notes: "Tratamiento antibiótico local, manejo por pediatría/APS."
    },
    {
        id: "TC-017",
        title: "Eccema Herpético",
        short_clinical_summary: "Vesículas umbilicadas sobre áreas de dermatitis atópica previa, paciente febril.",
        input: {
            age: 3,
            lesion_vesicula: true,
            lesion_erosion: true,
            signo_fiebre: true,
            topog_cabeza: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "URGENCIA PEDIÁTRICA. Riesgo de diseminación sistémica."
    },
    {
        id: "TC-018",
        title: "Sospecha de DRESS (Incompleto)",
        short_clinical_summary: "Edema facial, exantema generalizado y fiebre tras inicio de anticonvulsivante.",
        input: {
            age: 40,
            farmacos_recientes: true,
            signo_fiebre: true,
            lesion_eritema: true,
            patron_generalizado: true,
            topog_cabeza: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Reacción adversa grave con riesgo de compromiso multiorgánico."
    },
    {
        id: "TC-019",
        title: "Pénfigo Foliáceo (Inicial)",
        short_clinical_summary: "Erosiones costrosas en áreas seborreicas (pecho/espalda), sin compromiso mucoso.",
        input: {
            age: 45,
            lesion_erosion: true,
            lesion_costra: true,
            topog_tronco: true,
            topo_pecho: true,
            topo_espalda: true,
            patron_seborreica: true,
            timing: "subacute"
        },
        expected_priority: 1,
        notes: "Enfermedad ampollosa (aunque superficial) requiere manejo experto rápido."
    },
    {
        id: "TC-020",
        title: "Melanoma Amelánico Sospechoso",
        short_clinical_summary: "Nódulo eritematoso de crecimiento rápido en pierna, asimétrico.",
        input: {
            age: 55,
            lesion_nodulo: true,
            lesion_eritema: true,
            topog_ext_inf: true,
            timing: "subacute"
        },
        expected_priority: 2,
        notes: "Variante agresiva de melanoma, derivación inmediata."
    },
    {
        id: "TC-021",
        title: "Eritrodermia Exfoliativa",
        short_clinical_summary: "Eritema y descamación en >90% de superficie corporal, escalofríos.",
        input: {
            age: 62,
            lesion_eritema: true,
            lesion_escama: true,
            patron_generalizado: true,
            signo_fiebre: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "URGENCIA. Riesgo de falla de barrera, hiponatremia e infección."
    },
    {
        id: "TC-022",
        title: "Celulitis Periorbitaria",
        short_clinical_summary: "Edema, eritema y calor en párpados, fiebre, dolor al mover el ojo.",
        input: {
            age: 10,
            lesion_eritema: true,
            signo_fiebre: true,
            signo_dolor: true,
            topog_cabeza: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "URGENCIA. Riesgo de celulitis orbitaria y compromiso del SNC."
    },
    {
        id: "TC-023",
        title: "Púrpura Retiforme",
        short_clinical_summary: "Placas purpúricas de patrón ramificado (livedo) con necrosis central.",
        input: {
            age: 58,
            lesion_purpura: true,
            lesion_escara: true,
            lesion_erosion: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Signo de oclusión vascular severa (vasculopatía livedoide o trombótica)."
    },
    {
        id: "TC-024",
        title: "Herpes Zóster Oftálmico",
        short_clinical_summary: "Vesículas en frente y punta de la nariz (signo de Hutchinson), dolor ocular.",
        input: {
            age: 72,
            lesion_vesicula: true,
            topog_cabeza: true,
            topo_cara_centro: true,
            signo_dolor: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "URGENCIA. Riesgo de queratitis y pérdida de visión."
    },
    {
        id: "TC-025",
        title: "Eritema Multiforme Menor",
        short_clinical_summary: "Lesiones en diana (target) en palmas y dorso de manos, sin fiebre.",
        input: {
            age: 19,
            lesion_papula: true,
            patron_acral: true,
            timing: "acute"
        },
        expected_priority: 2,
        notes: "Reacción inmunológica, requiere estudio de gatillante (ej: HSV)."
    },
    {
        id: "TC-026",
        title: "Exantema Súbito",
        short_clinical_summary: "Lactante con fiebre alta que cede al aparecer exantema rosado.",
        input: {
            age: 1,
            lesion_macula: true,
            signo_fiebre: true,
            timing: "acute"
        },
        expected_priority: 3,
        notes: "Cuadro viral benigno frecuente en lactantes."
    },
    {
        id: "TC-027",
        title: "Necrosis Tisular (S. Antifosfolípido)",
        short_clinical_summary: "Placas necróticas extensas en extremidades inferiores tras cuadro agudo.",
        input: {
            age: 38,
            lesion_escara: true,
            topog_ext_inf: true,
            timing: "acute"
        },
        expected_priority: 1,
        notes: "Oclusión vascular masiva, emergencia médica."
    },
    {
        id: "TC-028",
        title: "Carcinoma Espinocelular Ulcerado",
        short_clinical_summary: "Tumoración exofítica friable con núcleo ulcerado en dorso de mano.",
        input: {
            age: 75,
            lesion_tumor: true,
            lesion_ulcera: true,
            topog_ext_inf: false, // Digamos que es extremidad
            timing: "chronic"
        },
        expected_priority: 2,
        notes: "Neoplasia maligna invasora, requiere cirugía prioritaria."
    },
    {
        id: "TC-029",
        title: "Escabiosis Complicada",
        short_clinical_summary: "Pápulas y surcos generalizados con signos de sobreinfección y pústulas.",
        input: {
            age: 15,
            lesion_papula: true,
            lesion_pustula: true,
            patron_generalizado: true,
            timing: "subacute"
        },
        expected_priority: 3,
        notes: "Manejo ambulatorio con tratamiento para ácaro y antibiótico oral."
    },
    {
        id: "TC-030",
        title: "Dermatitis de Contacto Aguda",
        short_clinical_summary: "Eritema, edema y vesiculación intensa tras uso de crema nueva.",
        input: {
            age: 42,
            lesion_eritema: true,
            lesion_vesicula: true,
            timing: "acute"
        },
        expected_priority: 3,
        notes: "Reacción local inflamatoria, no compromete la vida."
    }
];
