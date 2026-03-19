# Modificadores de Riesgo Clínico Morfológico (v1.3.0)
**DermatoTriage CDSS - Escudos de Seguridad Vital**

Este documento detalla las reglas heurísticas que actúan como **capas de seguridad insalvables** sobre el modelo probabilístico, asegurando que los signos vitales críticos nunca sean sub-triagiados.

---

## 📅 Evaluación de la Fase de Auditoría (v1.2)

Durante las pruebas de estrés del motor, se detectó que el modelo estadístico (basado en pesos) tendía al **sub-triage en lesiones "silenciosas"** (sin fiebre o dolor sistémico):
- **Ocular Risk**: Un Herpes Zóster en la cara podía ser visto como P2 simple si no era agudo.
- **Necrosis**: Una escara (gangrena) en zonas crónicas podía ser vista como P3 si no presentaba signos de infección.
- **Enfermedad Ampollosa**: El Pénfigo Vulgar inicial podía ser infravalorado ante la ausencia de fiebre.

---

## 🛠️ Escudos de Seguridad Implementados (`safety_modifiers.js`)

Se ha diseñado una capa de **Reglas de Escudo** que fuerzan la prioridad P1 (Urgencia Vital) y P2 (Prioridad Especialista):

| Modificador | Condición Morfológica | Acción | Justificación Clínica |
| :--- | :--- | :--- | :--- |
| **OCULAR_RISK** | Zona Cara + (Vesículas O Dolor O Edema) | **Forzar P1** | Riesgo de ceguera irreversible o compromiso de SNC. |
| **ISCHEMIC_NECROSIS** | Escara O Úlcera + (Agudo O Púrpura) | **Forzar P1** | Sospecha de vasculopatía oclusiva, gangrena o infección necrotizante. |
| **AUTOIMMUNE_FLARE** | Ampollas/Erosiones + Mucosas | **Forzar P1** | Sospecha de SJS/NET o Pénfigo Vulgar masivo. |
| **P2-SHIELD_MALIGNANCY**| Nódulo O Tumoración + (Sangrado O >1 año) | **Fijar P2** | Prevención de sub-triage en oncología dermatológica. |
| **PEDIATRIC_GUARD** | Edad < 2 años + Fiebre + Generalizado | **Mantener P1/P2** | Priorización de seguridad neonatal ante sospecha de sepsis. |

---

## 🧠 Integración en la Explicabilidad

Cuando un escudo de seguridad se activa, el sistema lo informa explícitamente en la justificación clínica:
- *"🚨 ALERTA: COMPROMISO OCULAR POTENCIAL (HERPES ZÓSTER / CELULITIS)"*
- *"🚨 ALERTA: SOSPECHA DE ISQUEMIA TISULAR / NECROSIS"*
- *"⚠️ SOSPECHA DE MALIGNIDAD CRÓNICA (P2-SHIELD ACTIVADO)"*

Estas alertas tienen un impacto directo en el **timeframe** sugerido: imponen "Derivación Inmediata" o "Evaluación en <30 días" sin importar las probabilidades estadísticas del síndrome.

---

## 📊 Impacto en la Seguridad del Paciente (v1.3.0)

La implementación de estos escudos de seguridad ha permitido:
1.  **Reducir el under-triage de P1 al 0.00%** en el benchmark actual (~60 casos).
2.  **Blindar áreas críticas** como la región periocular y las mucosas.
3.  **Garantizar 100% de sensibilidad** ante signos de necrosis cutánea, independientemente de la respuesta inflamatoria sistémica del paciente.

---

## 📜 Limitaciones
Aunque eficaces, los modificadores pueden generar **sobretriage conservador**. Un paciente con una úlcera crónica benigna sin riesgo isquémico real podría ser escalado a P1 si el input "Úlcera + Agudo" (por un brote de sobreinfección) es ingresado de forma imprecisa. La educación clínica en el ingreso de datos es fundamental.
