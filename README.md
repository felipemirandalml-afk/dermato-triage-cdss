# DermatoTriage CDSS (v1.0.0)
**Clinical Decision Support System for Primary Care Triage**

DermatoTriage is a lightweight, transparent, and high-performance inference engine designed to assist healthcare professionals in prioritizing dermatological patients. It focuses on identifying critical risks and ensuring safe referral practices.

---

## 🚀 How It Works: The Hybrid Engine Logic

The system follows a **Three-Layer Hybrid Architecture** to ensure both statistical flexibility and clinical safety:

### 1. Statistical Scoring Layer
The engine processes over 120 semiological variables (morphology, timing, topography, red flags). 
- **Base Score**: Each finding contributes a weight to a priority vector (P1, P2, P3).
- **Softmax Inference**: Probabilities are computed to find the most likely baseline priority.

### 2. Morphological Risk Modifiers
Explicit heuristic rules that oversee the statistical model to prevent under-triage of "silent" but deadly signs:
- **Necrosis/Ischemia**: Forces P1 if eschar or acute purpura is detected.
- **Ocular Risk**: Forces P1 for periocular involvement with pain or vesicles.
- **Malignancy**: Ensures P2 for chronic nodules or tumors.

### 3. Context-Aware Modifiers (Systemic)
The engine evaluates the **Patient Context** beyond the visible lesion:
- **Immunosuppression**: Scales priority for opportunistic suspicions.
- **Metabolic Risk**: Escalates ulcers in diabetic patients (Prevention of amputation).
- **STI Suspicion**: Identifies patterns like palmar-plantar rashes for systemic referral.

---

## 🎯 Clinical Demo: Key Scenarios
Use the "Cargar Demo" button to test these high-impact scenarios:

1. **The Silent Emergency**: [TC-027] Necrosis Tisular. (Shows Morphological Modifiers in action).
2. **The High-Risk Guest**: [TC-032] VIH + Moluscos. (Shows Context-Aware scaling).
3. **The Benign Mimicker**: [TC-026] Exantema Súbito. (Shows safety downscaling in pediatrics).
4. **The Critical Location**: [TC-024] Herpes Zóster Oftálmico. (Shows ocular protection).
5. **The Oncology Case**: [TC-008] Carcinoma Basocelular. (Ensures chronic lesions aren't ignored).

---

## 🛠️ Technical Stack
- **Engine**: Vanilla JavaScript (ES Modules). No dependencies.
- **UI**: HTML5 / CSS3 / Tailwind CSS (Modern Glassmorphism).
- **Validation**: Custom Node.js harness for clinical concordance.

## 🧪 Validation & Quality
Current concordance: **100.0%** (40/40 Cases PASS).
To run validation:
```bash
npm run validate
```

---

## 📂 Project Documentation
- [MAINTAINING.md](file:///c:/Users/hp/.gemini/antigravity/playground/aphelion-gravity/MAINTAINING.md): How to extend and maintain the system.
- [CHANGELOG.md](file:///c:/Users/hp/.gemini/antigravity/playground/aphelion-gravity/CHANGELOG.md): History of clinical milestones.
- [GENERALIZATION_AUDIT.md](file:///c:/Users/hp/.gemini/antigravity/playground/aphelion-gravity/GENERALIZATION_AUDIT.md): Coverage and clinical bias analysis.
- [RISK_MODIFIERS.md](file:///c:/Users/hp/.gemini/antigravity/playground/aphelion-gravity/RISK_MODIFIERS.md): Technical details on safety rules.
- [CONTEXT_MODIFIERS.md](file:///c:/Users/hp/.gemini/antigravity/playground/aphelion-gravity/CONTEXT_MODIFIERS.md): Details on context-aware logic.

---
**Disclaimer**: This tool is a decision support system for professionals. It does not replace clinical judgment.
