# Changelog - DermatoTriage CDSS

## [1.5.0] - 2026-03-26
### Added
- **Repository Saneamiento**: Eliminated 70+ legacy files and archived redundant research reports.
- **Architectural Cleanup**: Formal separation of Runtime Core vs. Training Support.
- **Documentation Alignment**: Full rewrite of README, MAINTAINING, and VALIDATION to reflect the real clinical accuracy (63.1%) and the Random Forest engine.
- **Git Hygiene**: Merged cleanup branch into master for stable baseline creation.

## [1.4.0] - 2026-03-25
### Added
- **UI Premium Phase**: Clinical Progress Bar and Step Indicators.
- **Silver Bullets**: High-definition clinical features (Nikolsky, Mieliceric crust, active border) for syndrome differentiation.
- **Global Inference Fix**: Triage calculation available from search/any tab (Sticky Action Bar).

## [1.3.0] - 2026-03-18

### Added
- **UI Explainability Framework**: Redesigned results panel with multi-layer reasoning (Decision -> Conduct -> Why).
- **Clinical SOAP Export**: Structured clinical note generator (Subjective, Objective, Assessment, Plan) for EHR integration.
- **Feature Categorization**: Automated grouping of semiological findings (Morphology, Symptoms, Anatomy) for intuitive reading.
- **P2-Shield (Anti-Downscale)**: Hardened the transition from Oncology/Systemic suspects (P2) to Stable (P3) to prevent inappropriate triage of malignancies.

## [1.2.0] - 2026-03-17

### Added
- **Core Hardening & Benchmarking**: Introduced structural schema validation for the clinical dataset to prevent regression.
- **Explicit Feature Contract**: Hardened the relationship between `constants.js` and `feature_encoder.js` with alias support and unknown input detection.
- **Dataset Alignment**: Refactored `clinical_cases.js` to use the canonical vocabulary of the inference engine.

## [1.1.0] - 2026-03-15

### Added
- **Probabilistic Syndrome Model**: Integrated a Logistic Regression-based analysis for 12 syndrome classes.
- **Confidence Layer**: Added confidence-level estimation (High, Medium, Ambiguous) to support clinician trust.
- **Differential Ranker**: Algorithm to prioritize top 3 clinical differentials based on cardinal rules and syndrome context.

## [1.0.0] - 2026-03-12

### Added
- **Hybrid Inference Engine v2.1**: Combined statistical scoring with explicit clinical and context-aware modifiers.
- **Context-Aware Modifiers**: Specific logic for Immunosuppression, Metabolic Risk, STI suspicion, and Geriatric vulnerability.
- **Clinical Validation Harness**: Automated test suite with 40 canonical and boundary cases (100% concordance).
- **Interpretability Layer**: Justification narrative and actionable clinical conduct for each triage result.
- **Extended Documentation**: Detailed technical notes on calibration, risk modifiers, and generalization audits.
- **UX Hardening**: Improved result panel clarity, reset functionality, and clinical demo loading.

### Fixed
- Feature mapping bug for `age` and `fitzpatrick` variables.
- Sub-triage of silent necrosis and ocular risk through dedicated morphological modifiers.
- Over-triage of benign pediatric febrile rashes via safety downscaling.

---

## [0.6.0] - 2026-03-11
### Added
- Single Source of Truth architecture.
- Modular `model.js` and `ui.js`.
- Base statistical scoring model.
- Initial validation harness with 12 cases.
