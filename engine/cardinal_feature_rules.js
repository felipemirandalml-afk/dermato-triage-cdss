/**
 * cardinal_feature_rules.js - Reglas de hallazgos cardinales patognomónicos
 * Fuente: NotebookLM / Guías clínicas dermatológicas
 * 
 * Estas reglas se aplican sobre los resultados de la ontología para 
 * priorizar diagnósticos específicos cuando existen "anclas" clínicas fuertes.
 */

// Umbrales etarios para anclaje epidemiológico (años reales)
const AGE_THRESHOLD_ELDERLY_BP = 60;        // Penfigoide Ampolloso (habitual > 60 años)
const AGE_THRESHOLD_PEDIATRIC_IMPETIGO = 12; // Impétigo (población infantil y escolar)

export const CARDINAL_FEATURE_RULES = [
    {
        id: "comedones",
        label: "Comedones (Acné)",
        priority: "medium",
        conditions: (h) => h.has('comedon'),
        boost_differentials: ["Acne vulgaris", "Hidradenitis supurativa"],
        suppress_differentials: ["Rosacea"],
        rationale: "El comedón es la lesión patognomónica del acné. Su presencia descarta rosácea pura."
    },
    {
        id: "vesiculas_agrupadas_eritema",
        label: "Vesículas herpetiformes / zosteriformes",
        priority: "high",
        conditions: (h) => (h.has('vesicula') || (h.has('dermatomal') && h.has('dolor'))) && (h.has('zosteriforme') || h.has('dermatomal') || h.has('localizado')),
        boost_differentials: ["Herpes simplex virus", "Herpes zoster"],
        boost_syndromes: ["viral_skin_infection"],
        suppress_syndromes: ["eczema_dermatitis", "bacterial_skin_infection", "vesiculobullous_disease"],
        suppress_differentials: ["Impetigo", "Contact dermatitis", "Bullous pemphigoid"],
        rationale: "La agrupación en racimos (zosteriforme) o dermatomal sobre base eritematosa sugiere etiología viral y desplaza ampollas autoinmunes."
    },



    {
        id: "ampollas_tensas",
        label: "Ampollas de techo firme",
        priority: "high",
        // Aproximación: Ampolla en paciente mayor (común en Penfigoide)
        conditions: (h) => h.has('bula_ampolla') && h.get('edad') >= AGE_THRESHOLD_ELDERLY_BP,
        boost_differentials: ["Bullous pemphigoid"],
        suppress_differentials: ["Pemphigus vulgaris"],
        rationale: "La firmeza del techo y la epidemiología (edad avanzada) orientan a clivaje subepidérmico."
    },
    {
        id: "ampollas_flacidas_nikolsky",
        label: "Ampollas frágiles / Nikolsky (+)",
        priority: "high",
        // Aproximación: Ampolla con dolor o compromiso mucoso
        conditions: (h) => h.has('bula_ampolla') && (h.has('mucosas') || h.has('dolor')),
        boost_differentials: ["Pemphigus vulgaris", "Stevens-Johnson syndrome"],
        suppress_differentials: ["Bullous pemphigoid"],
        rationale: "La fragilidad ampollosa y el compromiso mucoso sugieren acantólisis o necrosis intraepidérmica."
    },
    {
        id: "placa_anular_curacion_central",
        label: "Configuración anular (Tiña)",
        priority: "medium",
        conditions: (h) => (h.has('placa') || h.has('macula')) && h.has('anular'),
        boost_differentials: ["Tinea corporis", "Tinea cruris", "Granuloma annulare"],
        boost_syndromes: ["fungal_skin_infection"],
        suppress_syndromes: ["inflammatory_dermatosis_other", "psoriasiform_dermatosis"],
        suppress_differentials: ["Psoriasis (plaque)"],
        rationale: "La configuración anular (crecimiento centrífugo) es altamente sugestiva de dermatofitosis y desplaza placas sólidas e inflamatorias."
    },



    {
        id: "pustulas_centrofaciales_sin_comedones",
        label: "Pústulas centrofaciales (Rosácea)",
        priority: "medium",
        conditions: (h) => h.has('pustula') && h.has('cara_centro') && !h.has('comedon'),
        boost_differentials: ["Rosacea"],
        suppress_differentials: ["Acne vulgaris"],
        rationale: "La ausencia de comedones en un cuadro pustular centrofacial diferencia la rosácea del acné."
    },

    {
        id: "placa_eritematoescamosa_nacarada",
        label: "Placa con escama nacarada",
        priority: "medium",
        conditions: (h) => h.has('placa') && h.has('escama') && h.has('extensor'),
        boost_differentials: ["Psoriasis (plaque)"],
        boost_syndromes: ["psoriasiform_dermatosis"],
        suppress_differentials: ["Dermatitis seborreica", "Tinea corporis"],
        rationale: "La placa bien definida con escama gruesa en zonas extensoras es el sello de la psoriasis."
    },
    {
        id: "umbilicacion_central",
        label: "Pápula umbilicada (Molluscum)",
        priority: "high",
        conditions: (h) => h.has('papula') && h.has('umbilicacion'),
        boost_differentials: ["Molluscum contagiosum"],
        boost_syndromes: ["viral_skin_infection"],
        suppress_syndromes: ["inflammatory_dermatosis_other", "eczema_dermatitis"],
        suppress_differentials: ["Verruca vulgaris", "Varicella"],
        rationale: "La umbilicación central en una pápula perlada es el sello del molusco y desplaza diagnósticos inflamatorios."
    },

    {
        id: "forma_cupuliforme",
        label: "Nódulo/Pápula cupuliforme",
        priority: "medium",
        conditions: (h) => (h.has('nodulo') || h.has('papula')) && h.has('cupuliforme'),
        boost_differentials: ["Keratoacanthoma", "Nodular basal cell carcinoma", "Pyogenic granuloma"],
        boost_syndromes: ["cutaneous_tumor_suspected"],
        suppress_syndromes: ["inflammatory_dermatosis_other", "benign_cutaneous_tumor"],
        rationale: "La forma en domo o cúpula orienta a crecimientos exofíticos sólidos tumorales."
    },



    {
        id: "nodulo_perlado_telangiectasias",
        label: "Nódulo perlado (CBC)",
        priority: "high",
        conditions: (h) => h.has('nodulo') && h.has('telangiectasias') && (h.has('cara_centro') || h.has('cabeza')),
        boost_differentials: ["Basal cell carcinoma"],
        boost_syndromes: ["cutaneous_tumor_suspected"],
        suppress_syndromes: ["inflammatory_dermatosis_other", "benign_cutaneous_tumor", "eczema_dermatitis"],
        suppress_differentials: ["Melanocytic nevus"],
        rationale: "El aspecto perlado y telangiectasias en zonas fotoexpuestas (cara/cabeza) sugieren carcinoma basocelular."
    },


    {
        id: "macula_pigmentada_abcde",
        label: "Lesión pigmentada asimétrica",
        priority: "high",
        conditions: (h) => (h.has('macula') || h.has('mancha') || h.has('hiperpigmentacion')) && h.has('cronico'),
        boost_differentials: ["Malignant melanoma"],
        boost_syndromes: ["cutaneous_tumor_suspected"],
        suppress_differentials: ["Lentigo solar simple"],
        rationale: "Toda lesión pigmentada de evolución crónica requiere descartar melanoma bajo regla ABCDE."
    },
    {
        id: "lues_acral",
        label: "Patrón Acral Generalizado (Lúes II)",
        priority: "high",
        conditions: (h) => (h.has('acral') || h.has('palmas') || h.has('plantas')) && (h.has('papula') || h.has('escama')) && h.has('generalizado'),
        boost_differentials: ["Syphilis (Secondary)", "Hand-foot-mouth disease", "Lichen planus"],
        boost_syndromes: ["inflammatory_dermatosis_other"],
        suppress_syndromes: ["eczema_dermatitis", "psoriasiform_dermatosis"],
        rationale: "La afectación palmoplantar en cuadros papuloescamosos generalizados es el signo cardinal de la Sífilis Secundaria."
    },

    {
        id: "melanoma_amelanotic",
        label: "Nódulo amelanótico sospechoso",
        priority: "high",
        conditions: (h) => h.has('nodulo') && h.has('extremidad_inferior') && h.get('edad') > 50 && !h.has('comedon') && !h.has('quiste'),
        boost_differentials: ["Malignant melanoma (Amelanotic)", "Merkel cell carcinoma", "Pyogenic granuloma"],
        boost_syndromes: ["cutaneous_tumor_suspected"],
        rationale: "Nódulos eritematosos de reciente aparición en extremidades de adultos deben descartar variantes amelanóticas de Melanoma."
    },

    {
        id: "eczema_flexural",
        label: "Patrón Flexural (Dermatitis)",
        priority: "medium",
        conditions: (h) => h.has('flexural') && (h.has('escama') || h.has('liquenificacion')),
        boost_differentials: ["Atopic dermatitis", "Intertrigo"],
        boost_syndromes: ["eczema_dermatitis"],
        suppress_syndromes: ["psoriasiform_dermatosis"],
        suppress_differentials: ["Psoriasis (plaque)"],
        rationale: "La localización en flexuras es típica de procesos eczematosos y orienta contra la psoriasis clásica."
    },
    {
        id: "costras_melicericas",
        label: "Costras mielicéricas (Impétigo)",
        priority: "medium",
        conditions: (h) => h.has('costra') && (h.has('cara_centro') || h.get('edad') <= AGE_THRESHOLD_PEDIATRIC_IMPETIGO),
        boost_differentials: ["Impetigo"],
        boost_syndromes: ["bacterial_skin_infection"],
        suppress_syndromes: ["eczema_dermatitis", "inflammatory_dermatosis_other"],
        suppress_differentials: ["Dermatitis atópica"],
        rationale: "Las costras color miel en rostro (especialmente niños) sugieren impétigo primario o secundario."
    },


    {
        id: "pitiriasis_rosada",
        label: "Placa Heraldo / Distribución en Árbol (PR)",
        priority: "medium",
        conditions: (h) => h.has('placa') && h.has('tronco') && h.has('subagudo'),
        boost_differentials: ["Pityriasis rosea"],
        boost_syndromes: ["inflammatory_dermatosis_other"],
        suppress_syndromes: ["psoriasiform_dermatosis"],
        rationale: "La placa inicial en tronco seguida de exantema subagudo sugiere Pitiriasis Rosada."
    },
    {
        id: "surco_acarino",
        label: "Surco acarino (Escabiosis)",
        priority: "high",
        conditions: (h) => h.has('surco') || (h.has('axilas') && h.has('inguinal') && h.has('prurito')),
        boost_differentials: ["Scabies"],
        boost_syndromes: ["inflammatory_dermatosis_other"],
        rationale: "El surco es el signo patognomónico de la escabiosis. La afectación simétrica de pliegues con prurito nocturno es altamente sugestiva."
    },
    {
        id: "habon_roncha",
        label: "Habón / Roncha (Urticaria)",
        priority: "high",
        conditions: (h) => h.has('habon'),
        boost_differentials: ["Urticaria"],
        boost_syndromes: ["urticarial_dermatosis"],
        suppress_syndromes: ["inflammatory_dermatosis_other", "eczema_dermatitis"],
        rationale: "El habón es la lesión característica de la urticaria. Su carácter evanescente es definitorio frente a otras pápulas."
    }
];
