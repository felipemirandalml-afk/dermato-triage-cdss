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
      "Hand foot and mouth disease"
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
      "Stevens-Johnson syndrome"
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
      "Transient acantholytic dermatosis"
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
      "Keratoacanthoma"
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
      "Angioma / Hemangioma"
    ]
  },
  "inflammatory_dermatosis_other": {
    "macro_group": "Inflamatorio",
    "subgroup": "Otras Dermatosis",
    "ontology_reference": "Dermatitis inespecífica",
    "differentials": [
      "Rosacea",
      "Pityriasis rosea",
      "Granuloma annulare",
      "Lichen planus",
      "Sarcoidosis",
      "Pityriasis lichenoides"
    ]
  }
};
