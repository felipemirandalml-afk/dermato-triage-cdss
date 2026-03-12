# Maintaining DermatoTriage CDSS

This document outlines the procedures for maintaining and extending the Clinical Decision Support System.

## 1. Running Validation
Before any merge to `master`, you must run the automated clinical validation harness:
```bash
npm run validate
```
**Goal**: 100% concordance (40/40 PASS). If a regression occurs, analyze the failing case in `clinical_cases.js`.

## 2. Adding Clinical Cases
To add a new case for validation or regression testing:
1. Open `clinical_cases.js`.
2. Add a new object to `CLINICAL_CASES` with `id`, `title`, `short_clinical_summary`, `input`, and `expected_priority`.
3. Document the clinical rationale in the `notes` field.

## 3. Modifying the Engine (`model.js`)
The engine uses a three-layer approach:
1. **Statistical Score**: Adjust `MODEL_WEIGHTS` for fine-tuning baseline probabilities.
2. **Morphological Modifiers**: Add rules in `applyClinicalModifiers` for visual red flags (e.g., necrosis).
3. **Context-Aware Modifiers**: Add rules for patient-specific risks (e.g., immunosuppression).

**Rule of thumb**: Prefer modifiers for "Binary/Safety" logic (Yes/No flags) and weights for "Spectral/Probability" logic (Common vs. Rare).

## 4. Documentation Strategy
- **`RISK_MODIFIERS.md`**: Tracks morphological safety rules.
- **`CONTEXT_MODIFIERS.md`**: Tracks patient-context rules.
- **`CALIBRATION_NOTES.md`**: Historical record of weight adjustments.
- **`GENERALIZATION_AUDIT.md`**: Analysis of model performance across clinical families.

## 5. Merging Protocol
1. Create a feature branch.
2. Implement changes.
3. Run `npm run validate`.
4. Ensure documentation is updated if new modifiers are added.
5. Merge only if validation passes.
