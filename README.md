# DermatoTriage CDSS (v1.5.0 - Sentinel)
**Clinical Decision Support System for Dermatological Triage & Primary Care**

DermatoTriage is a state-of-the-art Clinical Decision Support System (CDSS) designed for medical professionals in Primary Care (APS). It provides a high-confidence triage layer by combining expert clinical heuristics with a probabilistic inference engine calibrated against large-scale dermatological datasets.

---

## 🏛️ System Architecture: The Multi-Layer Hybrid Engine

The core of DermatoTriage is a **Hybrid Inference Engine** that operates across four distinct levels of analytical depth:

### 1. Safety & Heuristic Layer (The "Shields")
Ensures clinical safety by overriding statistical predictions when critical patterns are detected:
- **Immediate Escalation (P1)**: Detection of necrosis, ischemia, or life-threatening systemic signs.
- **Malignancy Guards**: Prevents down-scaling of suspected neoplastic lesions (BCC, SCC, Melanoma).
- **Cardinal Feature Rules**: Expert-curated rules for high-specificity findings (Umbilication, Acral pattern, Scabies burrow) now fully migrated to the **Canonical Layer**.

### 2. Probabilistic Syndrome Engine (`probabilistic_model.js`)
A logistic regression core translates clinical findings into 12 major dermatological syndrome families (Eczema, Viral, Bacterial, Papulosquamous, etc.), providing a robust statistical baseline.

### 3. Canonical Concept Layer (`concept_mapper.js`)
The **"Semantic Backbone"** of the system. It uses a canonical mapping strategy to unify concepts from diverse sources:
- **UI Interaction**: Maps user inputs (e.g., *umbilicación*) to internal logic IDs.
- **Scientific Datasets**: Translates raw labels from **Derm1M** and **SkinCon** into a unified clinical language.
- **Topography Normalization**: Consolidated IDs for facial, truncal, and acral areas.

### 4. Differential Ranker (`differential_ranker.js`)
Utilizes enriched semiology profiles to provide the clinician with a Top-3 differential diagnosis. This layer is now powered by **Canonical Profiles (v1.2.0)**, allowing for high-specificity matching using advanced descriptors (Anular, Zosteriform, Dome-shaped).

---

## 🧬 Scientific Foundation & Datasets

DermatoTriage is not a "black box". Its knowledge base is derived from peer-reviewed datasets and clinical guidelines:

- **Derm1M Integration**: Used for disease-specific semiological frequencies (~4,400+ clinical profiles).
- **SkinCon (v2.0) Alignment**: Taxonomy and descriptors for fine morphology and diverse skin tones.
- **Expert Rules**: Hand-curated heuristic rules for high-impact cardinal findings.

---

## ✨ Key Features

- **Advanced Clinical Descriptors**: Dedicated section for high-specificity findings (Umbilication, Dome-shaped, Spatial Patterns) for expert-level triage.
- **Fitzpatrick-Aware Analysis**: Specifically audited to mitigate bias in pigmentary and vascular signals across different skin phenotypes (Audit-v8.0).
- **Explainable AI (XAI)**: Every decision provides a "Why" (Heuristic justification) and a "Suggest" (Actionable plan).
- **SOAP Export**: Generates structured medical notes.
- **Offline First**: Pure Vanilla JS architecture.

---

## 🚀 Technical Insights for Developers

### Folder Structure
- `/engine`: The clinical brain (logic, rules, models).
- `/data`: Datasets, canonical maps, and semiology profiles.
- `/tools`: Audit, validation, and group-reporting scripts.
- `/tests`: Clinical regression packs (Sentinel Suite).
- `/reports`: Live evidence of system performance and audit logs.

### Validation & Stress Testing
The system remains hardened through constant benchmarking:
```bash
# Run the full clinical validation suite
npm run validate

# Run structured validation by diagnostic groups (v1.5.0)
node tools/fase8_validation_reporter.js

# Review the conceptual traceability matrix
cat reports/concept_traceability_matrix.md
```

---

## 📅 Roadmap: Current Status & Future
- [x] **v1.1.0-1.3.0**: Heuristic layers, Probabilistic core, SOAP Export.
- [x] **v1.4.0**: Canonical Mapping, SkinCon/Derm1M Integration, Advanced UI findings.
- [x] **v1.5.0**: Cardinal Rule migration to Canonical Layer, Sentinel Regression Pack, Group Validation.
- [ ] **v1.6.0 (Upcoming)**: Fairness-aware re-weighting for Fitzpatrick extreme types.
- [ ] **Long Term**: Prospective clinical validation in real APS settings.

---

## ⚠️ Important Clinical Disclaimer
DermatoTriage CDSS is an **access-to-decision tool** for medical professionals. It is **NOT** a diagnostic device. The outputs are clinical suggestions based on programmed protocols and statistical probabilities. Final responsibility for diagnosis and management lies solely with the attending physician. 

*Designed with ❤️ by the Google Deepmind Advanced Agentic Coding Team.*
