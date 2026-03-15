/**
 * cardinal_feature_rules.js - Reglas de hallazgos cardinales patognomónicos
 * Fuente: NotebookLM / Guías clínicas dermatológicas
 * 
 * Estas reglas se aplican sobre los resultados de la ontología para 
 * priorizar diagnósticos específicos cuando existen "anclas" clínicas fuertes.
 */

export const CARDINAL_FEATURE_RULES = [
    {
        id: "comedones",
        label: "Comedones (Acné)",
        priority: "medium",
        conditions: (h) => h.has('lesion_comedon'),
        boost_differentials: ["Acne vulgaris", "Hidradenitis supurativa"],
        suppress_differentials: ["Rosacea"],
        rationale: "El comedón es la lesión patognomónica del acné. Su presencia descarta rosácea pura."
    },
    {
        id: "vesiculas_agrupadas_eritema",
        label: "Vesículas herpetiformes",
        priority: "high",
        conditions: (h) => h.has('lesion_vesicula') && (h.has('patron_dermatomal') || h.has('patron_localizado')),
        boost_differentials: ["Herpes simplex virus", "Herpes zoster"],
        suppress_differentials: ["Impetigo", "Contact dermatitis"],
        rationale: "La agrupación en racimos sobre base eritematosa sugiere fuertemente etiología viral (Herpes)."
    },
    {
        id: "ampollas_tensas",
        label: "Ampollas de techo firme",
        priority: "high",
        // Aproximación: Ampolla en paciente mayor (común en Penfigoide)
        conditions: (h) => (h.has('lesion_ampolla') || h.has('lesion_bula')) && h.get('edad') > 0.6,
        boost_differentials: ["Bullous pemphigoid"],
        suppress_differentials: ["Pemphigus vulgaris"],
        rationale: "La firmeza del techo y la epidemiología (edad avanzada) orientan a clivaje subepidérmico."
    },
    {
        id: "ampollas_flacidas_nikolsky",
        label: "Ampollas frágiles / Nikolsky (+)",
        priority: "high",
        // Aproximación: Ampolla con dolor o compromiso mucoso
        conditions: (h) => (h.has('lesion_ampolla') || h.has('lesion_bula')) && (h.has('signo_mucosas') || h.has('signo_dolor')),
        boost_differentials: ["Pemphigus vulgaris", "Stevens-Johnson syndrome"],
        suppress_differentials: ["Bullous pemphigoid"],
        rationale: "La fragilidad ampollosa y el compromiso mucoso sugieren acantólisis o necrosis intraepidérmica."
    },
    {
        id: "placa_anular_curacion_central",
        label: "Placa anular (Tiña)",
        priority: "medium",
        conditions: (h) => h.has('lesion_placa') && h.has('patron_localizado') && h.has('lesion_escama'),
        boost_differentials: ["Tinea corporis", "Tinea cruris", "Granuloma annulare"],
        suppress_differentials: ["Psoriasis (plaque)"],
        rationale: "El crecimiento centrífugo con aclaramiento central es altamente sugestivo de dermatofitosis."
    },
    {
        id: "pustulas_centrofaciales_sin_comedones",
        label: "Pústulas centrofaciales (Rosácea)",
        priority: "medium",
        conditions: (h) => h.has('lesion_pustula') && h.has('topo_cara_centro') && !h.has('lesion_comedon'),
        boost_differentials: ["Rosacea"],
        suppress_differentials: ["Acne vulgaris"],
        rationale: "La ausencia de comedones en un cuadro pustular facial diferencia la rosácea del acné."
    },
    {
        id: "placa_eritematoescamosa_nacarada",
        label: "Placa con escama nacarada",
        priority: "medium",
        conditions: (h) => h.has('lesion_placa') && h.has('lesion_escama') && (h.has('patron_extensor') || h.has('patron_extensoras')),
        boost_differentials: ["Psoriasis (plaque)"],
        suppress_differentials: ["Dermatitis seborreica", "Tinea corporis"],
        rationale: "La placa bien definida con escama gruesa en zonas extensoras es el sello de la psoriasis."
    },
    {
        id: "nodulo_perlado_telangiectasias",
        label: "Nódulo perlado (CBC)",
        priority: "high",
        conditions: (h) => h.has('lesion_nodulo') && h.has('lesion_telangiectasia') && (h.has('topo_cara_centro') || h.has('topog_cabeza')),
        boost_differentials: ["Basal cell carcinoma"],
        suppress_differentials: ["Melanocytic nevus"],
        rationale: "El aspecto perlado y telangiectasias en zonas fotoexpuestas sugieren carcinoma basocelular."
    },
    {
        id: "macula_pigmentada_abcde",
        label: "Lesión pigmentada asimétrica",
        priority: "high",
        conditions: (h) => (h.has('lesion_macula') || h.has('lesion_mancha')) && h.has('tiempo_cronico'),
        boost_differentials: ["Malignant melanoma"],
        suppress_differentials: ["Lentigo solar simple"],
        rationale: "Toda lesión pigmentada de evolución crónica requiere descartar melanoma bajo regla ABCDE."
    },
    {
        id: "costras_melicericas",
        label: "Costras mielicéricas (Impétigo)",
        priority: "medium",
        conditions: (h) => h.has('lesion_costra') && h.has('topo_cara_centro') && h.get('edad') < 0.2,
        boost_differentials: ["Impetigo"],
        suppress_differentials: ["Dermatitis atópica"],
        rationale: "Las costras color miel en rostro (especialmente niños) son patognomónicas de impétigo."
    }
];
