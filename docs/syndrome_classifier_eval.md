# Clasificador sindrómico — evaluación y diseño del híbrido bayesiano

> Estado: diseño. Acompaña a METHODS §5.2. La parte morfológica ya está construida
> (`frontend-v2/src/data/syndrome_feature_profiles.json`); falta la tabla de
> verosimilitudes clínicas (vía guías) y la fusión.

---

## 1. Evaluación: por qué NO un clasificador puramente de imágenes

Se evaluó reemplazar el Random Forest (entrenado con datos sintéticos) por un
**Naive Bayes calculado directamente desde Derm1M** — sin datos sintéticos, citable,
y capaz de emitir los 14 síndromes.

| Clasificador | Accuracy sindrómica (benchmark, 65 casos) |
| :--- | :---: |
| RF actual (sintético, 12 clases) | **70.8%** |
| Naive Bayes puro de morfología (Derm1M, 14 clases) | **38.5%** |

**Resultado negativo, pero informativo.** El Bayes morfológico acierta en casos
"de libro" (ampolloso, urticaria, pigmentario) con alta confianza, pero se desploma
en el benchmark completo: confunde cuadros morfológicamente parecidos
(bacteriana↔eczema, vasculitis↔viral) que **solo se distinguen por lo no-morfológico**
(fiebre, temporalidad, distribución). Las variantes de calibración (prior uniforme,
present-only) no superaron el ~38% → el límite es estructural, no de ajuste.

Confirma empíricamente la medición de METHODS §4.1: ~40-60% de la señal diagnóstica
**no está en las imágenes**. Un clasificador solo-Derm1M es insuficiente.

Herramientas de esta evaluación (reproducibles):
`training/scripts/build_syndrome_profiles.py`, `prototype_bayesian_syndrome.py`,
`validation/scripts/compare_bayes_vs_rf.js`.

### Sonda de factibilidad del híbrido

Antes de invertir en la tabla clínica citada, se probó el híbrido con verosimilitudes
clínicas **toscas y provisionales** (`validation/scripts/probe_hybrid_bayes.js`):

| Clasificador | Accuracy |
| :--- | :---: |
| RF actual | 70.8% |
| Bayes solo-morfología | 38.5% |
| **Híbrido (morfología + clínica tosca)** | **64.6%** |

El salto de 38.5% → 64.6% (**+26 pts**) con estimaciones a ojo confirma que el enfoque
es viable: la señal clínica era lo que faltaba. Quedó a ~6 pts del RF, gap plausible de
cerrar con la tabla citada + tuning. Incluso un empate técnico justifica adoptarlo
(mata circularidad, cubre 14 síndromes, transparente).

---

## 2. Diseño: Naive Bayes HÍBRIDO (Opción B)

La solución es un único clasificador bayesiano que **fusiona dos fuentes de
verosimilitud** — exactamente la arquitectura de dos fuentes de METHODS §4:

```
P(síndrome | features) ∝ P(síndrome)
   × Π  P(feature_morfológica | síndrome)        ← Derm1M (DATOS)
   × Π  P(feature_no_morfológica | síndrome)      ← guías clínicas (CITADO)
```

Ambos factores son `P(feature | síndrome)`; uno se **cuenta de imágenes**, el otro se
**estima de la clínica con cita**. La multiplicación bayesiana los combina de forma
natural y transparente.

### 2.1 Factor morfológico — DATOS (hecho)
`syndrome_feature_profiles.json`: P(feature|síndrome) para las 39 features morfológicas,
contado de Derm1M (134.194 filas). Recomputable con `build_syndrome_profiles.py`.

### 2.2 Factor clínico — GUÍAS (a construir)
Tabla `clinical_likelihoods` con P(feature|síndrome) para las features **no-morfológicas
discriminativas**. Se llena con guías (vía NotebookLM, mismo flujo que la tabla de triage),
con cita por celda. Para que sea tratable, escala ordinal con default neutro:

| Nivel | Valor | Significado |
| :--- | :---: | :--- |
| típico | 0.85 | el síndrome característicamente presenta esta feature |
| frecuente | 0.60 | aparece a menudo |
| (default) | 0.40 | no informativo / sin dato → no altera el resultado |
| ocasional | 0.20 | poco frecuente |
| raro | 0.05 | prácticamente lo excluye |

Solo se completan las celdas **no-neutras** (las que discriminan), reduciendo mucho el trabajo.

**Features no-morfológicas a tabular** (~25, las de mayor poder discriminativo):
- Temporalidad: `agudo`, `subagudo`, `cronico`
- Síntomas: `prurito`, `prurito_nocturno`, `dolor`, `ardor_quemazon`, `asintomatico`
- Historia/sistémico: `fiebre`, `farmacos_recientes`, `inmunosupresion`, `diabetes`,
  `hepatopatia`, `atopia`, `embarazo`, `contagio_familiar`
- Distribución: `generalizado`, `localizado`, `fotoexpuesto`, `acral`,
  `topo_flexural_pliegues`, `topo_friccion_extensora`, `simetrico`, `dermatomal`
- Otros: `mucosas`

*(Edad y fototipo se pueden incorporar luego como factores aparte si aportan.)*

### 2.3 Fusión e inferencia
Naive Bayes Bernoulli sobre la unión de ambos conjuntos de features. Salida con el
mismo shape que hoy (`top_syndrome`, `top_probability`, `top_candidates`,
`confidence_level`, `feature_importance`, `syndrome_probabilities`) para no romper
`model.js`. La explicabilidad mejora: se puede mostrar qué features (morfológicas y
clínicas) más empujaron a cada síndrome.

### 2.4 Validación (criterio de adopción)
Correr el híbrido contra el benchmark (`compare_bayes_vs_rf.js` extendido). **Se adopta
solo si iguala o supera el 70.8% del RF** (y de paso: cubre los 14 síndromes, es
transparente, y elimina la circularidad sintética). Calibrar la confianza si resulta
sobre-segura (el Bayes morfológico daba 97%).

---

## 3. Qué gana el paper con la Opción B

- **Mata la circularidad**: cero pacientes sintéticos; morfología de datos reales +
  clínica de guías citadas.
- **Cubre los 14 síndromes** (el RF solo emite 12).
- **Transparente y explicable** (no caja negra) — un plus para CDSS.
- **Cada verosimilitud tiene fuente** (Derm1M o guía citada) → cumple la regla rectora.

## 4. Pasos

1. **[hecho]** Factor morfológico desde Derm1M (`syndrome_feature_profiles.json`).
2. Construir `clinical_likelihoods` (no-morfológicas) con guías vía NotebookLM, citado.
3. Implementar el Naive Bayes híbrido en JS (nuevo `probabilistic_model.js`), mismo shape.
4. Validar contra el benchmark; adoptar solo si ≥ RF. Calibrar confianza.
5. Si se adopta: retirar `rf_model.json` (5.9 MB) y la cadena sintética
   (`curate_and_augment_fase5.py`).
