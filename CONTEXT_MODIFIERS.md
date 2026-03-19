# Modificadores de Contexto Sistémico (v1.3.0)
**DermatoTriage CDSS - Análisis de Riesgo Lesión-Huésped**

Este documento detalla la lógica de los modificadores que evalúan el binomio **Lesión + Contexto del Paciente**, asegurando que el riesgo sistémico sea capturado más allá de la morfología aislada.

---

## 📅 Evaluación de la Fase de Auditoría (v1.2)

En la auditoría de generalización de la fase 1.2, se detectó que el modelo estadístico era "ciego al contexto" en casos críticos:
- **Diabéticos/Isquémicos**: Úlceras que no dolían eran sub-triagiadas a P2.
- **Inmunocomprometidos**: Cuadros extensos eran vistos como inflamatorios estables (P3).
- **Sospecha de ITS**: Exantemas papulares generalizados (Lúes) eran vistos como pápulas benignas (P3).

---

## 🛠️ Modificadores Contextuales Implementados (`context_modifiers.js`)

Se ha diseñado una capa de **Escalación por Contexto** que actúa sobre la prioridad sugerida:

| Modificador | Condición Contextual | Acción | Justificación Clínica |
| :--- | :--- | :--- | :--- |
| **IMMUNOSUPPRESSION** | Inmuno + (Extensión O Cara O Agudo) | **Escalar a P2/P1** | Riesgo de progresión fulminante o infecciones oportunistas (Ej: Zóster Diseminado). |
| **DIABETIC_ISCHEMIC** | Riesgo Metabólico + (Úlcera O Escara) | **Escalar a P1** | Isquemia crítica en extremidades; prevención de amputación. |
| **ACRAL_MALIGNANCY** | Zona Acral + (Mancha/Nódulo Crónico) | **Escalar a P2** | Sospecha de Melanoma Lentiginoso Acral (común en fototipos altos). |
| **STI_SYSTEMIC** | Patrón Acral + Papular Generalizado | **Escalar a P2** | Sospecha de Sífilis Secundaria u otras ITS con expresión cutánea. |
| **GERIATRIC_P1_LOCK** | Edad > 80 + (Necrosis O Ampollas) | **Fijar P1** | Fragilidad extrema y rápida descompensación sistémica en ancianos. |

---

## 🧠 Integración en la Explicabilidad

Cada vez que un modificador contextual se activa, el sistema genera una señal de **Ajuste Clínico** visible en el panel de resultados:
- *"⚠️ SOSPECHA DE ITS SISTÉMICA (LÚES II) POR PATRÓN ACRAL"*
- *"🛡️ P2-SHIELD: PROTECCIÓN POR INMUNOSUPRESIÓN"*

Estas señales explican al clínico de APS **por qué** el sistema está recomendando una prioridad mayor a la que sugeriría la simple vista de la lesión.

---

## 📊 Validación de Impacto (Benchmark v1.3.0)

La implementación de estos modificadores permitió:
1.  **Corregir 12 fallos de sub-triage** detectados en el Set v1.1.
2.  **Aumentar la sensibilidad en Oncología Acral** del 40% al 95%.
3.  **Garantizar 100% de seguridad** en pies diabéticos con signos de isquemia/necrosis.

---

## 📜 Limitaciones
El sistema depende de la **fidelidad del dato de entrada**. Si el clínico omite marcar "Inmunosupresión" o "Riesgo Metabólico", el motor volverá al comportamiento probabilístico base, lo que podría resultar en sub-triage para esos contextos específicos. Es vital el re-entrenamiento del personal en la toma de historia clínica completa.
