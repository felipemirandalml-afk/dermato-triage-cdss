# Context-Aware Modifiers - DermatoTriage CDSS v2.1

## 1. Análisis de Fallos por "Ceguera de Contexto"

En la fase anterior, se detectaron casos donde la morfología aislada sugería una prioridad baja (P3), pero el contexto clínico del paciente elevaba el riesgo a P2 o P1.

### Casos Críticos Analizados:
- **TC-034 (Pie Diabético Isquémico)**: Una úlcera en un paciente diabético (`riesgo_metabolico`) en el pie es P1 por riesgo de pérdida de extremidad, incluso sin fiebre. El modelo base lo veía como P2.
- **TC-031 (Sífilis Secundaria)**: Un exantema con compromiso acral (`patron_acral`) sugiere ITS sistémica. El modelo base lo veía como P3 (estable).
- **TC-032 (VIH + Moluscos Gigantes)**: La `inmunosupresion` hace que lesiones benignas (pápulas) requieran evaluación experta (P2). El modelo base lo veía como P3.
- **TC-037 (Melanoma Subungueal)**: Mancha crónica en zona acral/subungueal. El modelo base ignoraba el riesgo por ser "crónico" y no "tumoral".

---

## 2. Modificadores Contextuales Implementados

Se han añadido reglas que consideran el **binomio Lesión + Huésped**:

| Modificador | Condición Contextual | Acción | Justificación Clínica |
| :--- | :--- | :--- | :--- |
| **IMMUNOSUPPRESSION_CONTEXT** | Inmunosupresión + (Lesión Extensa O Cabeza O Aguda) | Escalar a P2 | Mayor riesgo de infecciones oportunistas y progresión atípica. |
| **DIABETIC_ISCHEMIC_CONTEXT** | Riesgo Metabólico + Úlcera/Escara en Extremidad Inferior | Escalar a P1 | Prevención de amputación y control de isquemia crítica. |
| **ACRAL_MALIGNANCY_CONTEXT** | Localización Acral/Pies + Evolución Crónica + Mancha/Nódulo | Escalar a P2 | Alta sospecha de Melanoma Lentiginoso Acral (común en fototipos altos). |
| **STI_SYSTEMIC_CONTEXT** | Patrón Acral + Patrón Generalizado + Evolución Subaguda | Escalar a P2 | Sospecha de Sífilis Secundaria u otra ITS con expresión sistémica. |

---

## 3. Impacto en la Explicabilidad
Cada vez que un modificador contextual se activa, se incluye en la narrativa clínica generada por el sistema:
- *"[Ajuste Clínico] Riesgo por Contexto Diabético e Isquémico en extremidad..."*
- *"[Ajuste Clínico] Evaluación prioritaria por estado de Inmunocompromiso..."*

## 4. Limitaciones y Riesgos
- **Sobreajuste**: Estas reglas están diseñadas para corregir fallos específicos del dataset. En la práctica real, podrían causar sobretriage si los datos de entrada (ej: marcar "diabetes" por cualquier mancha) no son precisos.
- **Falsos Positivos**: Un paciente con VIH y una dermatitis seborreica simple podría escalar a P2 innecesariamente si no se calibra bien la extensión de la lesión.
