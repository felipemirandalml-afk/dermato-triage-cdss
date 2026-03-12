# Changelog - DermatoTriage CDSS

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
