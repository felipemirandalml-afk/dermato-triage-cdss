/**
 * syndrome_to_ontology_map.js - Mapeo estático de síndromes a la ontología Derm1M
 * Refinado para coherencia clínica y visualización en Triage (APS).
 */

export const SYNDROME_TO_ONTOLOGY_MAP = {
  "eczema_dermatitis": {
    "macro_group": "Inflamatorio",
    "subgroup": "Dermatitis / Eczema",
    "ontology_reference": "Eczema",
    "differentials": [
      "Atopic dermatitis",
      "Contact dermatitis",
      "Seborrheic dermatitis",
      "Nummular eczema",
      "Dyshidrosiform eczema",
      "Lichen simplex chronicus"
    ]
  },
  "psoriasiform_dermatosis": {
    "macro_group": "Inflamatorio",
    "subgroup": "Dermatosis Psoriasiforme",
    "ontology_reference": "Psoriasis",
    "differentials": [
      "Psoriasis (plaque)",
      "Guttate psoriasis",
      "Inverse psoriasis",
      "Pustular psoriasis",
      "Pityriasis rubra pilaris"
    ]
  },
  "bacterial_skin_infection": {
    "macro_group": "Infeccioso",
    "subgroup": "Bacteriano",
    "ontology_reference": "Infección bacteriana",
    "differentials": [
      "Cellulitis",
      "Impetigo",
      "Abscess",
      "Folliculitis",
      "Furuncle",
      "Pyoderma"
    ]
  },
  "viral_skin_infection": {
    "macro_group": "Infeccioso",
    "subgroup": "Viral",
    "ontology_reference": "Infección viral",
    "differentials": [
      "Herpes simplex virus",
      "Herpes zoster",
      "Molluscum contagiosum",
      "Varicella",
      "Viral exanthem",
      "Hand foot and mouth disease",
      "Warts",
      "Verruca",
      "Monkeypox"
    ]
  },
  "fungal_skin_infection": {
    "macro_group": "Infeccioso",
    "subgroup": "Fúngico / Micótico",
    "ontology_reference": "Infección fúngica",
    "differentials": [
      "Tinea corporis",
      "Tinea pedis",
      "Tinea cruris",
      "Tinea versicolor",
      "Candidiasis",
      "Tinea capitis"
    ]
  },
  "drug_reaction": {
    "macro_group": "Inflamatorio",
    "subgroup": "Reacción a Fármacos",
    "ontology_reference": "Toxicodermia",
    "differentials": [
      "Fixed drug eruption",
      "Acute generalized exanthematous pustulosis",
      "Stevens-Johnson syndrome",
      "Erythema multiforme"
    ]
  },
  "urticarial_dermatosis": {
    "macro_group": "Patrón de Reacción",
    "subgroup": "Hipersensibilidad",
    "ontology_reference": "Urticaria",
    "differentials": [
      "Urticaria",
      "Urticarial vasculitis",
      "Insect bite",
      "PUPPP (Pruritic urticarial papules and plaques of pregnancy)"
    ]
  },
  "vesiculobullous_disease": {
    "macro_group": "Inflamatorio",
    "subgroup": "Ampolloso Autoinmune",
    "ontology_reference": "Enfermedad ampollosa",
    "differentials": [
      "Bullous pemphigoid",
      "Pemphigus vulgaris",
      "Dermatitis herpetiformis",
      "Transient acantholytic dermatosis",
      "Bullous disease",
      "Epidermolysis bullosa"
    ]
  },
  "vasculitic_purpuric_disease": {
    "macro_group": "Vascular",
    "subgroup": "Vasculitis / Púrpura",
    "ontology_reference": "Vasculitis cutánea",
    "differentials": [
      "Leukocytoclastic vasculitis",
      "Pigmented purpuric eruption",
      "Urticarial vasculitis",
      "Erythema elevatum diutinum"
    ]
  },
  "cutaneous_tumor_suspected": {
    "macro_group": "Proliferativo",
    "subgroup": "Malignidad Sospechada",
    "ontology_reference": "Neoplasia maligna",
    "differentials": [
      "Basal cell carcinoma",
      "Squamous cell carcinoma",
      "Malignant melanoma",
      "Bowen's disease",
      "Keratoacanthoma",
      "Kaposi sarcoma",
      "Mycosis fungoides",
      "Cutaneous T-cell lymphoma",
      "Lymphoma",
      "Actinic keratosis",
      "Actinic solar damage"
    ]
  },
  "benign_cutaneous_tumor": {
    "macro_group": "Proliferativo",
    "subgroup": "Benigno",
    "ontology_reference": "Tumoración benigna",
    "differentials": [
      "Seborrheic keratosis",
      "Dermatofibroma",
      "Melanocytic nevus",
      "Lipoma",
      "Angioma / Hemangioma",
      "Pyogenic granuloma",
      "Keloid",
      "Epidermoid cyst"
    ]
  },
  "inflammatory_dermatosis_other": {
    "macro_group": "Inflamatorio",
    "subgroup": "Otras Dermatosis",
    "ontology_reference": "Dermatitis inespecífica",
    "differentials": [
      "Acne vulgaris",
      "Rosacea",
      "Pityriasis rosea",
      "Granuloma annulare",
      "Lichen planus",
      "Scabies",
      "Syphilis (Secondary)",
      "Sarcoidosis",
      "Pityriasis lichenoides",
      "Hidradenitis suppurativa"
    ]
  },
  "pigmentary_disorder": {
    "macro_group": "Pigmentario",
    "subgroup": "Discromía / Trastorno Pigmentario",
    "ontology_reference": "Trastorno de la pigmentación",
    "differentials": [
      "Vitiligo",
      "Melasma",
      "Post inflammatory hyperpigmentation",
      "Hyperpigmentation",
      "Hypopigmentation",
      "Lentigo",
      "Acanthosis nigricans"
    ]
  },
  "connective_tissue_disease": {
    "macro_group": "Autoinmune / Conectivo",
    "subgroup": "Conectivopatía",
    "ontology_reference": "Enfermedad del tejido conectivo",
    "differentials": [
      "Lupus erythematosus",
      "Cutaneous lupus",
      "Connective tissue diseases",
      "Dermatomyositis",
      "Scleroderma",
      "Morphea",
      "Lichen sclerosis et atrophicus"
    ]
  }
};
