# DermatoTriage CDSS (v1.3.0)
**Clinical Decision Support System for Primary Care Triage (APS)**

DermatoTriage is a lightweight, transparent, and high-performance inference engine designed to assist healthcare professionals in prioritizing dermatological patients in primary care. It integrates medical heuristics with a probabilistic model to ensure both clinical safety and diagnostic support.

---

## 🚀 The Hybrid Multi-Layer Architecture

The system uses a **layered architecture** to ensure that critical risks (P1) are never missed while providing sophisticated diagnostic context for typical cases (P2/P3):

### 1. Heuristic Safety Layer (The Shields)
Explicit medical rules that oversee the statistical model to prevent under-triage of critical conditions:
- **Safety Modifiers (`safety_modifiers.js`)**: Immediate escalation for necrosis, ischemia, or life-threatening systemic signs.
- **P2-Shield**: Prevents inappropriate downscaling of suspected malignancies or high-risk chronic lesions.
- **Location Protection**: Escalates risk for sensitive anatomical areas (e.g., periocular involvement).

### 2. Context-Aware Modifiers (`context_modifiers.js`)
Evaluation of the patient's systemic profile beyond the visible lesion:
- **Patient Background**: Identifies risks associated with diabetes, immunosuppression, or geriatric status.
- **Red Flag Mapping**: Real-time detection of high-impact semiological signals.

### 3. Probabilistic Syndrome Analysis (`probabilistic_model.js`)
A **Logistic Regression model** trained on clinical findings provides a diagnostic presumption:
- **Syndrome Analysis**: Classifies the case into 12 major clinical syndrome families (e.g., Eczema, Malignancy Suspected, Vasculitic).
- **Confidence Calibration**: Communicates the consistency of the pattern as "High," "Medium," or "Ambiguous."

### 4. Logic of Differentials (`differential_ranker.js`)
Orders potential diseases through cardinal rules and syndrome context, providing the clinician with the top 3 differential ranks for further investigation.

---

## 🎯 Key Features for Primary Care (APS)

- **Clinical Explainability**: Results are presented in a 3-layer hierarchy: Decision (Action), Conduct (Plan), and "The Why" (Explanation).
- **SOAP Report Generator**: Direct export of clinical findings in a structured Subjective-Objective-Assessment-Plan format for EHR copy-paste.
- **Single Source of Truth**: All semiological variables, labels, and aliases are managed through a hardened centralized contract (`constants.js`).
- **Benchmark Driven**: Every architectural change is validated against a dataset of ~60 canonical clinical cases.

---

## 🧪 Current Clinical Performance (v1.3.0)

| Metric | Level | Target | Current Status |
| :--- | :--- | :--- | :--- |
| **P1 Safety** | Urgent | 100% | ✅ **Passed (100.0%)** |
| **P1 Under-triage** | Risk | 0% | ✅ **Passed (0.00%)** |
| **Global Accuracy** | Triage | >80% | ✅ **Passed (~88.3%)** |
| **P2/P3 Accuracy** | Specificity | >80% | ✅ **Passed (~83.2%)** |

---

## 🛠️ Getting Started

### Technical Stack
- **Engine**: Vanilla JavaScript (ES Modules). Pure procedural logic, zero external production dependencies.
- **Styling**: Tailwind CSS (Modern Glassmorphism UI).
- **Workflow**: Automated Validation via Node.js scripts.

### How to Run:
Since it's a static web application, just open `index.html` in a modern browser.

### Run Validation Benchmark:
To ensure the clinical core remains hardened after modification:
```bash
# Full clinical benchmark execution
node tools/validate_clinical_cases.js

# Structural schema validation (Check dataset integrity)
node tools/validate_case_schema.js
```

---

## 📂 Project Governance & Docs

- **[VALIDATION.md](VALIDATION.md)**: Detailed evidence of clinical performance and fallback behavior.
- **[MAINTAINING.md](MAINTAINING.md)**: Protocol for extending the clinical engine or the dataset.
- **[CHANGELOG.md](CHANGELOG.md)**: History of clinical and architectural milestones.
- **[CONTEXT_MODIFIERS.md](CONTEXT_MODIFIERS.md)**: Deep dive into patient-context rules.
- **[RISK_MODIFIERS.md](RISK_MODIFIERS.md)**: Documentation of morphological safety shields.

---

## ⚠️ Important Disclaimer
DermatoTriage CDSS is an **analytical support tool**. It provides a suggestion of clinical priority and potential syndromes according to programmed protocols. It is **NOT** a substitute for an expert medical diagnosis, a physical examination, or professional clinical judgment.
