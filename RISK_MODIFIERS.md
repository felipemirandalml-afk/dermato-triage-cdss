# Clinical Risk Modifiers - Análisis y Diseño v2.0

## 1. Análisis de Patrones de Error (Baseline Stress Test)

La validación de 30 casos mostró una concordancia inicial de **73.3%**. Los fallos se agrupan en tres categorías críticas:

### A. Subtriage Peligroso (Falso Negativo de Prioridad)
- **Necrosis/Isquemia (TC-027)**: La presencia de `escara` (tejido necrótico) de aparición aguda es P1, pero el modelo la ve como P3 si no hay fiebre.
- **Riesgo Ocular (TC-024)**: El compromiso de la rama oftálmica del trigémino es una emergencia por riesgo de ceguera. El modelo lo clasifica como P2 (especialista estándar).
- **Enfermedad Ampollosa (TC-019)**: El pénfigo inicial puede ser "paucisintomático" (sin fiebre), pero requiere manejo experto inmediato para evitar progresión masiva.

### B. Sobretriage Conservador (Falso Positivo de Prioridad)
- **Fiebre Pediátrica (TC-026)**: Un lactante con fiebre y exantema dispara P1. Clínicamente es prudente, pero para triaje de "Dermato" puede saturar si es un cuadro viral benigno (Exantema Súbito).
- **Cuadros Inflamatorios Agudos (TC-030, TC-029)**: La dermatitis de contacto o escabiosis con pústulas disparan P2 por la intensidad de la señal "aguda + generalizada", cuando son manejables en APS (P3).

### C. Ambigüedad de Diagnóstico Diferencial
- **Eritema Multiforme (TC-025)**: Cuadros acrales agudos que requieren estudio pero no son urgencias vitales.

---

## 2. Risk Modifiers Implementados

Se ha diseñado una capa de **Reglas Heurísticas de Seguridad** que actúan sobre la predicción del modelo:

| Modificador | Condición Clínica | Acción | Justificación |
| :--- | :--- | :--- | :--- |
| **OCULAR_RISK** | Topografía Cara + (Vesículas O Dolor Intenso O Edema) | Escalar a P1 | Riesgo de pérdida de visión o compromiso de SNC. |
| **ISCHEMIC_NECROSIS** | Presencia de Escara/Ulcera + Evolución Aguda | Escalar a P1 | Sospecha de vasculopatía oclusiva, infección necrotizante o infarto tisular. |
| **AUTOIMMUNE_SUSPICION**| Ampollas/Erosiones + Mucosas (incluso sin fiebre) | Escalar a P1 | Sospecha de SJS/NET o Pénfigo Vulgar. |
| **PEDIATRIC_SAFE_MODE** | Edad < 2 años + Fiebre + Solo Máculas | Mantener P2/P3 | Evitar alerta de sepsis si el cuadro es sugerente de virosis benigna (opcional, se prioriza seguridad). |

---

## 3. Impacto Esperado
Se espera que la concordancia suba al **85-90%**, corrigiendo los fallos de seguridad (subtriage) y refinando los casos de sobretriage innecesario.
