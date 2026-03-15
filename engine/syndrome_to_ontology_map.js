/**
 * syndrome_to_ontology_map.js - Mapeo estático de síndromes a la ontología Derm1M
 */

export const SYNDROME_TO_ONTOLOGY_MAP = {
  "eczema_dermatitis": {
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
    "ontology_reference": "Eczema",
    "differentials": [
      "Atopic dermatitis",
      "Contact dermatitis",
      "Seborrheic dermatitis",
      "Nummular eczema",
      "Dyshidrosiform eczema",
      "Lichen simplex chronicus, "
    ]
  },
  "psoriasiform_dermatosis": {
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
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
    "macro_group": "inflammatory",
    "subgroup": "infectious",
    "ontology_reference": "bacterial",
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
    "macro_group": "inflammatory",
    "subgroup": "infectious",
    "ontology_reference": "viral",
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
    "macro_group": "inflammatory",
    "subgroup": "infectious",
    "ontology_reference": "fungal",
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
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
    "ontology_reference": "Drug eruption, Drug eruptions & reactions",
    "differentials": [
      "Fixed drug eruption",
      "Acute generalized exanthematous pustulosis",
      "Stevens-Johnson syndrome",
      "Riehl melanosis"
    ]
  },
  "urticarial_dermatosis": {
    "macro_group": "reaction patterns and descriptive terms",
    "subgroup": "Hypersensitivity, allergic reaction",
    "ontology_reference": "Urticaria",
    "differentials": [
      "Urticaria",
      "Urticarial vasculitis",
      "Pruritic urticarial papules and plaques of pregnancy, PUPPP",
      "Insect bite"
    ]
  },
  "vesiculobullous_disease": {
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
    "ontology_reference": "Bullous disease",
    "differentials": [
      "Bullous pemphigoid",
      "Pemphigus vulgaris",
      "Dermatitis herpetiformis",
      "acquired autoimmune bullous diseaseherpes gestationis",
      "Transient acantholytic dermatosis, Grover's disease, Transient acantholytic dermatosis"
    ]
  },
  "vasculitic_purpuric_disease": {
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
    "ontology_reference": "Localized cutaneous vasculitis",
    "differentials": [
      "Leukocytoclastic vasculitis",
      "Pigmented purpuric eruption, Pigmented progressive purpuric dermatosis",
      "Urticarial vasculitis",
      "Erythema elevatum diutinum",
      "Actinic solar damage(solar purpura)"
    ]
  },
  "cutaneous_tumor_suspected": {
    "macro_group": "proliferations",
    "subgroup": "malignant",
    "ontology_reference": "malignant",
    "differentials": [
      "Basal cell carcinoma",
      "Squamous cell carcinoma",
      "Malignant melanoma, melanoma",
      "Bowen's disease",
      "Keratoacanthoma",
      "Merkel cell carcinoma"
    ]
  },
  "benign_cutaneous_tumor": {
    "macro_group": "proliferations",
    "subgroup": "benign",
    "ontology_reference": "benign",
    "differentials": [
      "Seborrheic keratosis",
      "Dermatofibroma",
      "Melanocytic nevus",
      "Lipoma",
      "Fibroma molle",
      "Angioma, Hemangioma"
    ]
  },
  "inflammatory_dermatosis_other": {
    "macro_group": "inflammatory",
    "subgroup": "non-infectious",
    "ontology_reference": "Inflammatory dermatosis",
    "differentials": [
      "Rosacea",
      "Pityriasis rosea",
      "Granuloma annulare",
      "Lichen planus",
      "Sarcoidosis, Cutaneous sarcoidosis",
      "Pityriasis lichenoides"
    ]
  }
};
