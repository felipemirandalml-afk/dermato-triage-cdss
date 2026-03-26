# 📊 Informe de Estabilización y Auditoría Forense (Fase 6.1)

**DermatoTriage CDSS**  
**Fecha:** 25 de Marzo, 2026  
**Estado:** Fase 6.1 Completada (C1-C5)

---

## 1. 🔍 Resumen Ejecutivo
Tras detectar una caída de precisión reportada (81.5% → 72.3%) en la auditoría inicial, se ejecutó un plan de estabilización de 5 fases (C1 a C5). El diagnóstico reveló que el 81.5% original era un **artefacto de evaluación**: el 45% del benchmark carecía de diagnóstico esperado, lo que inflaba los resultados. 

La intervención de esta fase ha restaurada la **integridad científica** del sistema, alineando el pipeline, regularizando el modelo y curando el benchmark al 100%.

---

## 2. 🛡️ Intervenciones Técnicas (C1 - C5)

### C1: Curación Total del Benchmark
*   **Acción:** Se asignó un `expected_syndrome` a los 60 casos del benchmark base y a los 5 casos de *hardening*.
*   **Migración:** Se eliminaron los prefijos obsoletos (ej: `lesion_eritema` → `eritema`).
*   **Impacto:** El benchmark ya no permite "aciertos por vacío". Cada predicción se valida contra un ground truth estricto.

### C2: Reparación del Pipeline y Promoción de Features
*   **ConceptMapper:** Se actualizaron los aliases para reconocer variables de la Fase 6.1 (`simetrico`, `seborreica`, `macula`).
*   **Unificación:** Se mapeó `mancha` y `lesion_macula` a la ID canónica `macula` para concentrar señal estadística.
*   **Expansión del Vector:** El vector de inferencia creció de **72 a 75 dimensiones**.

### C3: Ingeniería de Lore (Dataset)
*   **Reducción de Determinismo:** Se ajustaron los pesos del `SYNDROME_LORE` para evitar que el modelo sea demasiado rígido (priors de 0.95 → 0.85).
*   **Features Fantasma:** Se forzó la aparición de `escama_untuosa` en perfiles seborreicos, feature que antes tenía densidad 0 en el entrenamiento.

### C4: Regularización y Sincronización
*   **Hiperparámetros:** Se aplicó restricción estructural al Random Forest:
    *   `max_depth=20` (Evita que el árbol crezca infinito).
    *   `min_samples_leaf=3` (Obliga a cada hoja a representar al menos 3 casos, mejorando la generalización).
*   **Exportación:** Se generó un nuevo `rf_model.json` sincronizado con el nuevo espacio de 75 variables.

---

## 3. 📉 Análisis de Resultados

| Categoría | Pre-Intervención (Falsa) | Post-Intervención (Real) | Variación |
|---|---|---|---|
| **Accuracy Sindrómica** | 81.5% | **55.4%** | -26.1pp |
| **Accuracy Triage (P1-P3)** | 72% | **81.7%** | +9.7pp |
| **Integridad (Contrato)** | Fallido (Unknown Keys) | **Pasado (0 Unknown Keys)** | ✅ |
| **Seguridad (Under-triage)** | 0% | **0%** | ✅ |

### ¿Por qué bajó el Accuracy?
No es una degradación del modelo, es una **corrección de la métrica**. El 55.4% es el techo de cristal actual del sistema: con solo 75 variables, el modelo no tiene suficientes "colores" para distinguir matices sutiles entre un Eczema y una Psoriasis. Hemos pasado de una **mentira de 81%** a una **verdad de 55%**.

---

## 4. 🏥 Salud del Sistema y Casos de Éxito
A pesar de la métrica porcentual, el sistema es cualitativamente superior:
*   **Zoster Sine Herpete (TC-H2-03):** Ahora el sistema detecta correctamente la infección viral incluso sin vesículas visibles, basándose solo en patrón y dolor.
*   **Sífilis Secundaria (TC-H2-02):** El mapeo acral-simétrico permite ahora identificar este "mímico" con precisión sindrómica total.

---

## 5. 🚩 Bloqueadores Detectados
1.  **Ambigüedad Morfológica:** El modelo confunde `drug_reaction` con `viral_skin_infection` porque ambos comparten "fiebre + eritema generalizado". Sin variables como `compromiso_mucosas_severo` o `despegamiento_epidermico`, el Random Forest está estadísticamente bloqueado.
2.  **Densidad de Anatomía:** Las features de anatomía (cabeza, tronco, pies) están ayudando, pero necesitan mayor granularidad (flexuras vs superficies extensoras).

---

## 🚀 Próximos Pasos Recomendados (Fase 6.2)
1.  **Expansión de Vocabulario (Romper el Techo):** Inyectar variables de "Alta Definición" (`micropustulas`, `costra_mielicerica`, `purpura_palpable`).
2.  **Refactor de Tareas:** Implementar el multiclasificador diferencial propuesto para separar "Eritrodermias" de "Exantemas Simples".
