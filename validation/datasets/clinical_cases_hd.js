/**
 * clinical_cases_hd.js - Benchmark de Alta Fidelidad Clínica v3.0
 * 
 * Reingeniería total del input para el modelo de 81 dimensiones.
 * 60 Casos Originales Reestructurados + 30 Casos Nuevos de Alta Densidad.
 */

export const CLINICAL_CASES_HD = [
    // --- BLOQUE 1: CASOS ORIGINALES REESTRUCTURADOS (1-30) ---
    {
        id: "TC-001", title: "Dermatitis Atópica",
        clinical_narrative: "Paciente con eccema crónico en pliegues, liquenificación marcada y antecedente de asma/rinitis.",
        input: { age: 25, escama: true, liquenificacion: true, prurito: true, atopia: true, topo_flexural_pliegues: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-002", title: "Psoriasis Guttata",
        clinical_narrative: "Múltiples pápulas eritemato-escamosas pequeñas tras faringitis. Escama nacarada sutil.",
        input: { age: 10, papula: true, escama: true, escama_nacarada: true, tronco: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "psoriasiform_dermatosis"
    },
    {
        id: "TC-003", title: "Psoriasis en Placas",
        clinical_narrative: "Placas simétricas en codos y rodillas con escama nacarada gruesa y engrosamiento ungueal.",
        input: { age: 40, lesion_placa: true, lesion_escama: true, escama_nacarada: true, engrosamiento_ungueal: true, topo_friccion_extensora: true, simetrico: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "psoriasiform_dermatosis"
    },
    {
        id: "TC-004", title: "Dermatitis Seborreica",
        clinical_narrative: "Escama untuosa amarillenta en cuero cabelludo y surcos nasogenianos. Prurito leve.",
        input: { age: 35, escama: true, escama_untuosa: true, cabeza: true, cara_centro: true, seborreica: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-005", title: "Herpes Zóster",
        clinical_narrative: "Vesículas en racimo sobre base eritematosa con dolor intenso dermatomal. Sin pródromo catarral.",
        input: { age: 65, vesicula: true, eritema: true, dolor: true, dermatomal: true, zosteriforme: true, prodromo_catarral: false, timing: "acute" },
        expected_priority: 2, expected_syndrome: "viral_skin_infection"
    },
    {
        id: "TC-006", title: "Erisipela Pierna",
        clinical_narrative: "Placa eritematosa brillante, caliente y dolorosa en pierna de 24h. Fiebre de 39C.",
        input: { age: 50, eritema: true, dolor: true, fiebre: true, extremidad_inferior: true, timing: "acute" },
        expected_priority: 2, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-007", title: "Farmacodermia Morbiliforme",
        clinical_narrative: "Exantema maculopapular prurignoso 10 días tras fármaco. Sin pródromo catarral.",
        input: { age: 28, farmacos_recientes: true, eritema: true, papula: true, prurito: true, generalizado: true, prodromo_catarral: false, timing: "acute" },
        expected_priority: 2, expected_syndrome: "drug_reaction"
    },
    {
        id: "TC-008", title: "Melanoma Nodular",
        clinical_narrative: "Nódulo negro asimétrico de crecimiento rápido con ulceración central.",
        input: { age: 55, nodulo: true, hiperpigmentacion: true, ulcera: true, tronco: true, timing: "chronic" },
        expected_priority: 1, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-009", title: "NET (High Fidelity)",
        clinical_narrative: "Despegamiento epidérmico masivo (Nikolsky+) y erosiones en mucosas tras fármaco. Fiebre alta.",
        input: { age: 45, farmacos_recientes: true, fiebre: true, erosion: true, despegamiento_epidermico: true, mucosas: true, generalizado: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "vesiculobullous_disease"
    },
    {
        id: "TC-010", title: "Vasculitis Leucocitoclástica",
        clinical_narrative: "Púrpura palpable simétrica en piernas, dolorosa, con fiebre y artralgias.",
        input: { age: 55, purpura: true, purpura_palpable: true, fiebre: true, extremidad_inferior: true, simetrico: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "vasculitic_purpuric_disease"
    },
    {
        id: "TC-011", title: "Pénfigo Vulgar",
        clinical_narrative: "Ampollas flácidas y erosiones dolorosas iniciales en mucosa oral. Nikolsky positivo.",
        input: { age: 50, bula_ampolla: true, erosion: true, despegamiento_epidermico: true, mucosas: true, tronco: true, timing: "subacute" },
        expected_priority: 1, expected_syndrome: "vesiculobullous_disease"
    },
    {
        id: "TC-012", title: "Celulitis Orbitaria",
        clinical_narrative: "Edema bipalpebral unilateral doloroso con fiebre y proptosis sutil.",
        input: { age: 10, eritema: true, dolor: true, fiebre: true, cabeza: true, cara_centro: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-013", title: "Fascitis Necrotizante",
        clinical_narrative: "Dolor exquisito en pierna, eritema con ampollas hemorrágicas y necrosis.",
        input: { age: 45, dolor: true, eritema: true, bula_ampolla: true, color_violaceo: true, extremidad_inferior: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-014", title: "Hidradenitis",
        clinical_narrative: "Nódulos inflamatorios y fístulas recurrentes en axilas con cicatrices.",
        input: { age: 30, nodulo: true, cicatriz: true, topo_flexural_pliegues: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-015", title: "Tiña de Cuerpo HD",
        clinical_narrative: "Placa anular con borde activo descamativo y aclaramiento central. Prurito.",
        input: { age: 12, placa: true, escama: true, borde_activo: true, curacion_central: true, anular: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-031", title: "Sífilis Secundaria",
        clinical_narrative: "Exantema papuloescamoso generalizado con compromiso palmoplantar.",
        input: { age: 29, papula: true, escama: true, acral: true, generalizado: true, timing: "subacute" },
        expected_priority: 2, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-039", title: "Tiña Incógnito",
        clinical_narrative: "Placa roja persistente tras corticoides con borde activo periférico sutil.",
        input: { age: 45, eritema: true, borde_activo: true, cabeza: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-055", title: "Celulitis del Pie",
        clinical_narrative: "Pie rojo, caliente y doloroso tras maceración interdigital por tiña pedis.",
        input: { age: 50, eritema: true, dolor: true, fiebre: true, pies: true, maceracion: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-056", title: "Urticaria Aguda",
        clinical_narrative: "Habones evanescentes generalizados, muy pruriginosos, duran <24h.",
        input: { age: 30, habon: true, prurito: true, generalizado: true, timing: "acute" },
        expected_priority: 2, expected_syndrome: "urticarial_dermatosis"
    },

    // --- BLOQUE 2: NUEVOS CASOS HD (TC-HD-001 to 030) ---
    {
        id: "TC-HD-001", title: "Eczema Numular",
        clinical_narrative: "Placa circular eritematosa en pierna sin borde activo ni aclaramiento central.",
        input: { age: 40, placa: true, escama: true, borde_activo: false, anular: true, extremidad_inferior: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-HD-002", title: "Melanoma Amelanótico Planta",
        clinical_narrative: "Tumoración eritematosa creciente en planta sin pigmento evidente. Friable.",
        input: { age: 65, nodulo: true, eritema: true, pies: true, acral: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HD-003", title: "Sarna Noruega",
        clinical_narrative: "Placas hiperqueratósicas masivas generalizadas en paciente con demencia/inmuno.",
        input: { age: 80, escama: true, generalizado: true, inmuno: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HD-004", title: "Tiña de uñas pura",
        clinical_narrative: "Engrosamiento ungueal amarillento quebradizo sin afectación de piel.",
        input: { age: 50, engrosamiento_ungueal: true, pies: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-HD-005", title: "Pitiriasis Versicolor",
        clinical_narrative: "Manchas hipoorcrómicas finamente descamativas en tronco posterior.",
        input: { age: 22, lesion_mancha: true, escama: true, tronco: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-HD-006", title: "Carcinoma Espinocelular",
        clinical_narrative: "Tumor queratósico ulcerado en dorso de mano fotoexpuesta.",
        input: { age: 75, nodulo: true, ulcera: true, extremidad_superior: true, fotoexpuesto: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HD-007", title: "Vesiculitis Aguda Palmo-Plantar",
        clinical_narrative: "Vesículas profundas en palmas y plantas, prurito severo (disidrosis).",
        input: { age: 30, vesicula: true, acral: true, pies: true, prurito: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-HD-008", title: "SJS Early Nikolsky+",
        clinical_narrative: "Fiebre alta, ardor ocular y Nikolsky positivo en zonas de piel roja.",
        input: { age: 40, farmacos_recientes: true, fiebre: true, despegamiento_epidermico: true, mucosas: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "vesiculobullous_disease"
    },
    {
        id: "TC-016", title: "Cándida Oral (Muguet)",
        clinical_narrative: "Placas blanquecinas 'en grumo' (requesón) en lengua y paladar que se desprenden al raspado dejando base eritematosa.",
        input: { age: 1, lesion_placa: true, color_blanco: true, mucosas: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-023", title: "Escabiosis Clásica",
        clinical_narrative: "Prurito nocturno familiar, pápulas y surcos en eminencia tenar y pliegues interdigitales.",
        input: { age: 25, prurito_nocturno: true, surco: true, papula: true, topo_friccion_extensora: false, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-027", title: "Impétigo Contagioso",
        clinical_narrative: "Costras mielicéricas peribucales de 3 días de evolución en preescolar.",
        input: { age: 4, costra: true, costra_mielicerica: true, cabeza: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-028", title: "Erisipela Pierna",
        clinical_narrative: "Placa eritematosa brillante, caliente y dolorosa en pierna derecha con fiebre.",
        input: { age: 58, eritema: true, dolor: true, fiebre: true, extremidad_inferior: true, timing: "acute" },
        expected_priority: 2, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-032", title: "Herpes labial",
        clinical_narrative: "Vesículas agrupadas en racimo en el borde del labio tras asolearse. Prurito inicial.",
        input: { age: 22, vesicula: true, cabeza: true, cara_centro: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "viral_skin_infection"
    },
    {
        id: "TC-034", title: "Celulitis Pierna",
        clinical_narrative: "Pierna roja, edematosa, caliente y dolorosa con fiebre. Puerta de entrada: fisura interdigital.",
        input: { age: 60, eritema: true, dolor: true, fiebre: true, extremidad_inferior: true, fisura: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-035", title: "Molusco Contagioso",
        clinical_narrative: "Pápulas cupuliformes umbilicadas de color piel en tronco de niño de 5 años.",
        input: { age: 5, papula: true, cupuliforme: true, umbilicacion: true, tronco: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "viral_skin_infection"
    },
    {
        id: "TC-040", title: "Urticaria Crónica",
        clinical_narrative: "Habones diarios de >6 semanas de evolución. Duran <24h. Muy pruriginosos.",
        input: { age: 45, habon: true, prurito: true, generalizado: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "urticarial_dermatosis"
    },
    {
        id: "TC-041", title: "Carcinoma Basocelular",
        clinical_narrative: "Nódulo perlado con telangiectasias y pequeña costra central en frente.",
        input: { age: 68, nodulo: true, telangiectasias: true, cabeza: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-042", title: "Queratosis Seborreica",
        clinical_narrative: "Lesión verrugosa de aspecto 'pegado' marrón en espalda de años de evolución.",
        input: { age: 70, papula: true, escama: true, tronco: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "benign_cutaneous_tumor"
    },
    {
        id: "TC-017", title: "Tiña de cabeza",
        clinical_narrative: "Placa alopécica descamativa en cuero cabelludo con pelos cortos.",
        input: { age: 6, escama: true, cabeza: true, borde_activo: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-043", title: "Queratosis Actínica",
        clinical_narrative: "Pápulas rugosas eritematosas en áreas fotoexpuestas (calva, frente).",
        input: { age: 72, papula: true, escama: true, cabeza: true, fotoexpuesto: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-044", title: "Léntigo Solar",
        clinical_narrative: "Manchas marrones uniformes en dorso de manos en anciano.",
        input: { age: 75, lesion_mancha: true, hiperpigmentacion: true, extremidad_superior: true, acral: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "benign_cutaneous_tumor"
    },
    {
        id: "TC-045", title: "Melanoma Acral",
        clinical_narrative: "Mancha negra irregular en planta del pie de crecimiento reciente.",
        input: { age: 60, lesion_mancha: true, hiperpigmentacion: true, pies: true, acral: true, timing: "chronic" },
        expected_priority: 1, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-046", title: "Angioma Senil",
        clinical_narrative: "Pápulas rojas brillantes cupuliformes en tronco, asintomáticas.",
        input: { age: 50, papula: true, eritema: true, tronco: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "benign_cutaneous_tumor"
    },
    {
        id: "TC-047", title: "Dermatofibroma",
        clinical_narrative: "Nódulo firme marrón en pierna que se deprime al pellizco (signo del hoyuelo).",
        input: { age: 35, nodulo: true, hiperpigmentacion: true, extremidad_inferior: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "benign_cutaneous_tumor"
    },
    {
        id: "TC-048", title: "Carcinoma Basocelular Pigmentado",
        clinical_narrative: "Nódulo perlado con zonas pigmentadas negras y telangiectasias.",
        input: { age: 65, nodulo: true, hiperpigmentacion: true, telangiectasias: true, cabeza: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-049", title: "Dermatitis Seborreica Severa",
        clinical_narrative: "Placas eritemato-escamosas untuosas en pecho y cara.",
        input: { age: 40, placa: true, escama_untuosa: true, seborreica: true, tronco: true, cabeza: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-050", title: "Tiña de cara",
        clinical_narrative: "Placa anular descamativa en mejilla, empeora con sol.",
        input: { age: 28, anular: true, borde_activo: true, cabeza: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-051", title: "Candidiasis Submamaria",
        clinical_narrative: "Eritema en pliegue con lesiones satélites pápulo-pustulosas.",
        input: { age: 55, eritema: true, papula: true, pustula: true, topo_flexural_pliegues: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-052", title: "Psoriasis Inversa",
        clinical_narrative: "Placas rojas espejo en ingles sin escama.",
        input: { age: 45, placa: true, eritema: true, topo_flexural_pliegues: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "psoriasiform_dermatosis"
    },
    {
        id: "TC-053", title: "Farmacodermia Aguda",
        clinical_narrative: "Erupción maculopapular tras 7 días de fármaco nuevo.",
        input: { age: 30, farmacos_recientes: true, eritema: true, papula: true, generalizado: true, timing: "acute" },
        expected_priority: 2, expected_syndrome: "drug_reaction"
    },
    {
        id: "TC-054", title: "Verruga Plantar",
        clinical_narrative: "Pápula queratósica dolorosa en punto de apoyo con puntos negros.",
        input: { age: 20, papula: true, color_negro: true, pies: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "benign_cutaneous_tumor"
    },
    {
        id: "TC-057", title: "Liquen Escleroso",
        clinical_narrative: "Placa blanquecina atrófica en área genital con picor.",
        input: { age: 55, placa: true, color_blanco: true, atrofia: true, mucosas: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-058", title: "Pitiriasis Rosada",
        clinical_narrative: "Erupción en 'árbol de navidad' en tronco tras placa heraldo.",
        input: { age: 24, eritema: true, placa: true, tronco: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-059", title: "Vitíligo Agudo",
        clinical_narrative: "Manchas acrómicas (blanco tiza) simétricas en manos y cara.",
        input: { age: 18, lesion_mancha: true, color_blanco: true, acromia: true, acral: true, simetrico: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-060", title: "Melanoma Amelanótico",
        clinical_narrative: "Pápula roja creciente en zona fotoexpuesta de crecimiento rápido.",
        input: { age: 70, papula: true, eritema: true, fotoexpuesto: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HD-009", title: "Vasculitis por IgA",
        clinical_narrative: "Púrpura palpable en nalgas y piernas en niño tras amigdalitis.",
        input: { age: 7, purpura: true, purpura_palpable: true, extremidad_inferior: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "vasculitic_purpuric_disease"
    },
    {
        id: "TC-HD-010", title: "Psoriasis Inversa",
        clinical_narrative: "Placas rojas brillantes bien delimitadas en axilas e ingles sin escama.",
        input: { age: 50, eritema: true, placa: true, topo_flexural_pliegues: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "psoriasiform_dermatosis"
    },
    {
        id: "TC-HD-011", title: "Exantema Súbito",
        clinical_narrative: "Lactante con fiebre alta y pródromo catarral, seguido de erupción maculopapular.",
        input: { age: 1, eritema: true, fiebre: true, prodromo_catarral: true, generalizado: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "viral_skin_infection"
    },
    {
        id: "TC-HD-012", title: "Impétigo Melicérico",
        clinical_narrative: "Costras amarillentas color miel en peribucal en niño de 5 años.",
        input: { age: 5, costra: true, costra_mielicerica: true, cabeza: true, cara_centro: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-HD-013", title: "Lupus Eritematoso Discoide",
        clinical_narrative: "Placas atróficas cicatrizales en cabeza con escama adherente.",
        input: { age: 35, atrofia: true, placa: true, escama: true, cabeza: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HD-014", title: "Queratosis Actínica",
        clinical_narrative: "Pápulas ásperas lijosas en cuero cabelludo de anciano calvo fotoexpuesto.",
        input: { age: 70, papula: true, escama: true, cabeza: true, fotoexpuesto: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HD-015", title: "Liquen Plano Genital",
        clinical_narrative: "Placas violáceas en glande con estrías, muy pruriginosas.",
        input: { age: 40, color_violaceo: true, placa: true, mucosas: true, prurito: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HD-016", title: "NET post-Amoxicilina",
        clinical_narrative: "Eritema doloroso generalizado con Nikolsky positivo y desprendimiento masivo.",
        input: { age: 30, farmacos_recientes: true, eritema: true, dolor: true, despegamiento_epidermico: true, generalizado: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "vesiculobullous_disease"
    },
    {
        id: "TC-HD-017", title: "Tinea Faciei",
        clinical_narrative: "Placa anular en cara con borde activo descamativo.",
        input: { age: 25, anular: true, borde_activo: true, cabeza: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },
    {
        id: "TC-HD-018", title: "Escabiosis Familiar",
        clinical_narrative: "Prurito nocturno severo con surcos acarinos en espacios interdigitales.",
        input: { age: 28, prurito_nocturno: true, surco: true, extremidad_superior: true, timing: "subacute" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HD-019", title: "Pénfigo Foliáceo Seborreico",
        clinical_narrative: "Erosiones costrosas en pecho y espalda, Nikolsky positivo, sin mucosas.",
        input: { age: 45, erosion: true, costra: true, despegamiento_epidermico: true, seborreica: true, tronco: true, timing: "chronic" },
        expected_priority: 1, expected_syndrome: "vesiculobullous_disease"
    },
    {
        id: "TC-HD-020", title: "Dermatitis de Pañal con Cándida",
        clinical_narrative: "Eritema intenso en área genitourinaria con lesiones satélites periféricas.",
        input: { age: 0, eritema: true, papula: true, topo_flexural_pliegues: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "fungal_skin_infection"
    },

    // --- BLOQUE 3: CASOS DE FRONTERA (70-90) ---
    {
        id: "TC-HB-001", title: "Urticaria Vasculitis",
        clinical_narrative: "Habones dolorosos que duran >24h y dejan púrpura residual.",
        input: { age: 40, habon: true, purpura: true, purpura_palpable: true, dolor: true, timing: "subacute" },
        expected_priority: 2, expected_syndrome: "vasculitic_purpuric_disease"
    },
    {
        id: "TC-HB-002", title: "Paling Psoriasis (No ungueal)",
        clinical_narrative: "Placas en codos pero sin onicopatía ni escama nacarada clásica.",
        input: { age: 35, placa: true, eritema: true, topo_friccion_extensora: true, engrosamiento_ungueal: false, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "psoriasiform_dermatosis"
    },
    {
        id: "TC-HB-003", title: "Melanoma Subungueal",
        clinical_narrative: "Banda negra en uña que ensancha y afecta el pliegue (signo de Hutchinson).",
        input: { age: 50, color_negro: true, hiperpigmentacion: true, acral: true, timing: "chronic" },
        expected_priority: 1, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HB-004", title: "Poroqueratosis Diseminada",
        clinical_narrative: "Múltiples placas con borde nítido hiperqueratósico en extremidades.",
        input: { age: 55, placa: true, escama: true, atrofia: true, extremidad_inferior: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HB-005", title: "Sarna Impetiginizada",
        clinical_narrative: "Surcos y costras mielicéricas con fiebre leve.",
        input: { age: 10, surco: true, costra_mielicerica: true, fiebre: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    },
    {
        id: "TC-HB-006", title: "Prúrigo Actínico",
        clinical_narrative: "Pápulas y costras en zonas fotoexpuestas, muy pruriginosas.",
        input: { age: 15, papula: true, costra: true, prurito: true, fotoexpuesto: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HB-007", title: "Carcinoma Basocelular Nodular",
        clinical_narrative: "Nódulo perlado con telangiectasias en la nariz.",
        input: { age: 60, nodulo: true, telangiectasias: true, cabeza: true, cara_centro: true, timing: "chronic" },
        expected_priority: 2, expected_syndrome: "cutaneous_tumor_suspected"
    },
    {
        id: "TC-HB-008", title: "Rosácea Papulopustular",
        clinical_narrative: "Eritema persistente y pústulas en mejillas, sin comedones.",
        input: { age: 40, eritema: true, pustula: true, cara_centro: true, timing: "chronic" },
        expected_priority: 3, expected_syndrome: "inflammatory_dermatosis_other"
    },
    {
        id: "TC-HB-009", title: "Dermatofitide (Id Reaction)",
        clinical_narrative: "Vesículas pruriginosas en manos tras tiña pedis inflamatoria.",
        input: { age: 30, vesicula: true, prurito: true, acral: true, timing: "acute" },
        expected_priority: 3, expected_syndrome: "eczema_dermatitis"
    },
    {
        id: "TC-HB-010", title: "Erisipela con Ampollas",
        clinical_narrative: "Placa roja caliente con ampollas superficiales y fiebre de 40C.",
        input: { age: 70, eritema: true, bula_ampolla: true, fiebre: true, extremidad_inferior: true, timing: "acute" },
        expected_priority: 1, expected_syndrome: "bacterial_skin_infection"
    }
];

export const HARDENING_CASES_HD = CLINICAL_CASES_HD.filter(c => c.id.includes("HD") || c.id.includes("HB"));
