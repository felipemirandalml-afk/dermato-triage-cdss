# Estado de Validación y Benchmark (v1.5.0) 📊

Este documento detalle el estado de validación técnica y clínica de DermatoTriage CDSS tras el último benchmark automatizado.

---

## ⚖️ Informe de Rendimiento (Audit v2.2)

- **Fecha**: 26 de Marzo, 2026
- **Comando**: `npm run validate`
- **Total de Casos**: 60 (Base) + 5 (Hardening)
- **Estado Global**: 🟡 **EN DESARROLLO / ESTANCADO**

### Métricas de Rendimiento Real:

| Indicador | Valor Actual | Meta (Threshold) | Estado |
| :--- | :--- | :--- | :--- |
| **Accuracy Triage (Prioridad)** | **81.7%** | 85.0% | 🟡 Estable |
| **Accuracy Sindrómica** | **63.1%** | 85.0% | 🔴 **TECHO DE CRISTAL** |
| **Bajo-Triage P1 (Under-triage)** | **0.00%** | 0% | ✅ **CRÍTICO / SEGURO** |
| **Integridad de Contrato** | **Pasado** | 0 Unknowns | ✅ Integrado |

---

## 🧪 Metodología de Validación Técnica

El sistema se somete a un **Harness de Regresión Sincronizado** que evalúa 3 dimensiones:

### 1. Validación Estructural (Schema)
Mediante `validation/scripts/validate_case_schema.js`, se asegura que cada caso en el benchmark cumple con el vector de 81 dimensiones del modelo actual. Garantiza 0 "Unknown Keys" en el flujo de inferencia.

### 2. Seguridad Crítica (P1 Safety)
Se estresa el motor con señales cardinales de emergencia (Necrosis, Nikolsky +, Dolor desproporcionado). El éxito se define por la inmediatez del triage P1, independientemente de la clase sugerida por el modelo estadístico.

### 3. Precisión Probabilística (Sindrómica)
Se evalúa la capacidad del Random Forest para asignar correctamente el síndrome macro (ej: Eczema vs Viral). 
- **Hallazgo**: El 63.1% actual representa el límite del modelo ante la ambigüedad morfológica. La confusión principal ocurre entre `drug_reaction` y `viral_skin_infection`.

---

## ⚠️ Análisis de Limitaciones e Inconsistencias

- **Ambigüedad Clínica**: El modelo confunde casos de Psoriasis con Reacciones a Drogas debido a perfiles semiológicos solapados. Esto no afecta la seguridad del triage (ambos suelen ser P2/P3), pero impacta la precisión de la sugerencia diagnóstica.
- **Necesidad de Features HD**: Se ha identificado que para superar el 63.1% de exactitud sindrómica, es imprescindible la captura de variables de alta definición (`micropustulosis`, `borde_activo`, `telangiectasias arboriformes`) en el input del clínico.

---

## 📜 Conclusión de Auditoría
El sistema es **clínicamente seguro para triage de prioridades (P1/P2/P3)**, alcanzando un 81.7% de concordancia con expertos. Sin embargo, su capacidad diagnóstica diferencial (Síndromes) se encuentra limitada por el "ruido" estadístico de las patologías exantemáticas, recomendándose su uso siempre bajo supervisión médica directa.

---

*Nota: DermatoTriage CDSS no es una herramienta de diagnóstico formal. Sus resultados son sugerencias probabilísticas basadas en protocolos de APS.*
