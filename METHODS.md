# METHODS — Arquitectura de Evidencia y Razonamiento de DermatoTriage CDSS

> **Propósito de este documento.** Es la *estrella polar* del proyecto: define de
> dónde viene la "inteligencia" del sistema hoy, a dónde queremos llevarla, y la
> regla que toda decisión clínica del motor debe cumplir. Sirve para dos cosas:
> (1) mantener el desarrollo con rumbo, sin volver a perdernos en bucles, y
> (2) ser el esqueleto de la sección *Methods* de la eventual publicación.
>
> Estado: borrador vivo. Versión 0.2 (jun 2026) — triage en 3 capas (se añade la capa
> de severidad/extensión) y protocolo SSMSO como fuente clínica primaria.

---

## 1. Qué decide el sistema y para quién

DermatoTriage es un CDSS para **médicos de APS** que enfrentan una dermatosis con
duda diagnóstica y deben decidir **si derivar a teledermatología** (y con qué
urgencia). Entrega dos salidas:

1. **Prioridad de triage** operacional: P1 (derivación inmediata), P2 (prioritaria),
   P3 (ambulatorio).
2. **Orientación sindrómica** + diagnósticos diferenciales (apoyo, no diagnóstico).

La prioridad de triage es la salida crítica de seguridad; la orientación sindrómica
es apoyo cognitivo.

---

## 2. La regla rectora (no negociable)

> **Cada valor que influye en una decisión clínica debe ser, o bien (a) un estadístico
> derivado de datos reales y recomputable, o bien (b) un umbral respaldado por una guía
> o referencia clínica citable. No se admiten "números mágicos".**

Todo lo que hoy no cumpla esta regla es deuda explícita y está listado en §6.

---

## 3. De dónde viene la inteligencia HOY (diagnóstico honesto)

El motor combina cinco capas. Su procedencia y estatus de evidencia:

| Capa | Archivo | Origen actual | Estatus |
| :--- | :--- | :--- | :--- |
| Perfiles semiológicos P(feature\|síndrome) | `semiology_profiles.json` | Derm1M + SkinCon (reales) | ✅ Citable |
| Clasificador sindrómico (Random Forest) | `rf_model.json` | Entrenado sobre **pacientes sintéticos** generados desde los perfiles | ⚠️ Circular |
| Pesos discriminativos / recalibración | `*_fit_v2.json` | **Fiteados** contra los datos sintéticos | ❌ No defendible |
| Matriz de triage (feature→prioridad) | `baseline_model.js` `WEIGHT_MATRIX` | Números puestos **a mano** | ❌ Sin respaldo |
| Reglas de seguridad (red flags) | `safety_modifiers.js` | Heurísticas clínicas a mano | 🟡 Defendibles si se citan |

### 3.1 El problema central: circularidad sintética

La cadena actual es:

```
Derm1M/SkinCon (real) → perfiles P(feature|síndrome)
   → curate_and_augment_fase5.py genera ~2051 "pacientes" SINTÉTICOS
      (random.seed(42); muestreo de los perfiles)
   → entrena el Random Forest
```

El RF aprende a **reconstruir los perfiles de los que fue generado**. No añade
conocimiento clínico nuevo; el "accuracy" (~71%) se mide contra casos curados/sintéticos,
no contra pacientes reales. (Evidencia: 1278 de 2051 filas comparten patrón de features.)

### 3.2 Evidencia cuantitativa de que los pesos fiteados no son defendibles

Al derivar los pesos discriminativos directamente de Derm1M (log-odds, ver §5.1),
los pesos fiteados resultan **contradecir la epidemiología**:

| Feature → síndrome | Derivado de datos (log-odds) | Fiteado actual |
| :--- | :---: | :---: |
| `bula_ampolla` → vesiculobullous | **3.74** | 0.01 |
| `vesicula` → viral | **3.20** | 0.01 |
| `nodulo` → tumor | **2.08** | 0.01 |

Features clínicamente obvias estaban fiteadas a ~0 mientras los datos las muestran
entre las más discriminativas.

---

## 4. Arquitectura OBJETIVO: dos fuentes de evidencia

La medición (§4.1) muestra que el sistema necesita **dos fuentes distintas**, y
está bien que así sea — cada una respalda lo que legítimamente puede:

```
┌─────────────────────────────────────────────────────────────────┐
│  FUENTE 1 — DATOS (Derm1M / SkinCon)                              │
│  Morfología → síndrome                                            │
│  · 30 de 81 features (mácula, costra, ampolla, nódulo…)           │
│  · Pesos por log-odds / PMI de co-ocurrencia (citable)            │
│  · Decide ~60% de los casos                                       │
├─────────────────────────────────────────────────────────────────┤
│  FUENTE 2 — GUÍAS / LITERATURA CLÍNICA                            │
│  Historia + síntomas + temporalidad + edad → síndrome Y urgencia  │
│  · 51 de 81 features (edad, fiebre, fármacos, prurito, timing…)   │
│  · NO existen en datasets de imágenes                             │
│  · Cada peso/umbral respaldado por una guía citada                │
│  · Decisiva en ~40% de los casos (los más difíciles)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
   Síndrome (orientación)  +  Prioridad de triage en 3 capas (§5.3):
     Capa 0 urgencia basal por síndrome
   → Capa 1 modificadores de severidad/extensión (P3→P2)
   → Capa 2 red flags de seguridad (→P1)
```

### 4.1 Por qué dos fuentes (medido, no asumido)

De las 81 features del RF, **solo 30 están en Derm1M**; las otras 51 (edad, síntomas,
temporalidad, fototipo, historia) **no pueden salir de una imagen**. Cuánto pesan:

- **Estructural:** 59.6% de los splits del RF usan features no-Derm1M (`edad` sola = 13.7%).
- **Conductual (ablación):** quitar las features no-Derm1M cambia el síndrome top en
  **40%** de los casos de validación.

→ Un clasificador entrenado **solo** con datos reales de imágenes perdería ~40-60%
de la señal clínica. Por eso la arquitectura es híbrida, no "todo datos reales".

---

## 5. Metodología por capa (cómo se construye cada pieza)

### 5.1 Pesos discriminativos morfológicos (Fuente 1) — DERIVADOS DE DATOS

Se computan directamente de la co-ocurrencia cruda de Derm1M (`concept.csv`,
209.613 filas `disease_label × skin_concept`):

```
log_odds(f, s) = ln( P(f | s) / P(f | ¬s) )
```

- `skin_concept → feature`: `concept_canonical_map.json` (aliases + source_mappings).
- `disease_label → síndrome`: `syndrome_to_ontology_map.js` (differentials).
- Conteos crudos guardados para auditoría.
- Script: `training/scripts/derive_discriminative_weights.py`.
- Cobertura actual: **64.0%** de Derm1M (73.6% sobre filas diagnosticables; el resto
  es "no definitive diagnosis" o entidades fuera de la taxonomía).

### 5.2 Clasificación sindrómica — NAIVE BAYES HÍBRIDO

Reemplaza el Random Forest (entrenado con datos sintéticos → circular, solo 12 clases)
por un Naive Bayes que fusiona dos verosimilitudes — la arquitectura de dos fuentes
hecha clasificador. Detalle y evaluación en [`docs/syndrome_classifier_eval.md`].

```
P(síndrome | features) ∝ P(síndrome)
   × Π P(feature_morfológica | síndrome)     ← Derm1M (DATOS, hecho)
   × Π P(feature_no_morfológica | síndrome)   ← guías clínicas (CITADO, a construir)
```

- **Evaluación previa:** un Naive Bayes **solo de morfología** (Derm1M) rinde 38.5% vs
  70.8% del RF — insuficiente, porque ~40-60% de la señal no está en imágenes (§4.1).
  Por eso el clasificador debe ser híbrido, no solo-imágenes.
- **Factor morfológico (hecho):** `syndrome_feature_profiles.json`, contado de Derm1M.
- **Factor clínico (a construir):** tabla de P(feature|síndrome) para las features
  no-morfológicas (fiebre, timing, distribución…), estimada de guías con cita por celda.
- **Adopción condicionada:** se reemplaza el RF solo si el híbrido iguala o supera el
  70.8% en el benchmark; entonces se retira `rf_model.json` y la cadena sintética.

### 5.3 Triage / urgencia (Fuente 2) — DE GUÍAS, en TRES CAPAS

La urgencia **no está en los datasets de imágenes**. Se **elimina** `WEIGHT_MATRIX`
(feature→prioridad, hand-tuned) y se reemplaza por una composición transparente en
tres capas; cada valor con su fuente:

- **Capa 0 — Urgencia basal por síndrome.** Cada uno de los 14 síndromes tiene una
  prioridad piso (P1/P2/P3) con justificación y fuente. Es solo el *piso*, no la
  urgencia final.
- **Capa 1 — Modificadores de severidad / extensión.** Dentro de un síndrome,
  criterios clínicos escalan **P3→P2** — esta es la decisión central de la app
  ("¿derivar a teledermatología?"). Ejemplos: psoriasis con **BSA >10%**, acné
  **severo o con cicatrices**, **onicomicosis**, refractariedad a tratamiento,
  sitio especial (cara/genital/palmoplantar). Cada regla = `condición(features) →
  escala`, con cita. *(Esta capa faltaba en el diseño v0.1; es la que evita la
  generalización gruesa de "todo el síndrome = una urgencia".)*
- **Capa 2 — Red flags de seguridad.** Escalan a **P1** por amenaza vital/funcional,
  son feature-based e independientes del síndrome (§5.4).

> **Fuente clínica primaria:** protocolo de derivación de patología dermatológica del
> **Servicio de Salud Metropolitano Sur Oriente (SSMSO), Santiago de Chile** — el
> contexto real de APS donde opera la herramienta. Se complementa con guías
> internacionales solo donde el protocolo no cubra una entidad. Usar el protocolo del
> propio servicio como base hace que los umbrales de derivación sean directamente
> defendibles en ese contexto.

> **Prerrequisito de datos (Capa 1):** algunos criterios de severidad requieren inputs
> que el formulario hoy **no captura** (% de superficie corporal, refractariedad a
> tratamiento, sitio especial). La Capa 1 solo puede escalar sobre lo que el formulario
> permite registrar — ver §6 (deuda 6).

### 5.4 Reglas de seguridad (red flags) — DE GUÍAS

Cada regla de `safety_modifiers.js` debe mapearse a una guía o criterio clínico
publicado (p. ej. SJS/NET, fascitis necrotizante, riesgo ocular en zóster).
Las reglas prevalecen siempre sobre la estadística (principio de seguridad).

### 5.5 Taxonomía sindrómica

14 síndromes (12 originales + `pigmentary_disorder` y `connective_tissue_disease`,
agregados para cerrar puntos ciegos clínicos). Fuente: `syndrome_to_ontology_map.js`.

---

## 6. Deuda explícita (lo que viola la regla rectora hoy)

1. `WEIGHT_MATRIX` (triage) — números a mano → migrar a §5.3.
2. `*_fit_v2.json` — fiteados contra sintético → reemplazar por derivados (§5.1).
3. RF entrenado sobre sintético → migrar a híbrido (§5.2).
4. Reglas de seguridad sin cita → mapear a guías (§5.4).
5. Validación sobre casos sintéticos/curados → migrar a casos reales (§7).
6. Formulario sin campos de severidad/extensión (BSA %, refractariedad, sitio
   especial) → la Capa 1 de severidad (§5.3) los necesita; agregar inputs.

---

## 7. Validación

- **Hoy:** suite interna (`validation/`) sobre casos curados/sintéticos. Reporta
  ~71% accuracy sindrómica y detecta 1 under-triage P1. Es validación **técnica**,
  no clínica.
- **Objetivo:** validar contra una serie de **casos reales etiquetados por clínicos**.
  Distinguir siempre validación técnica interna de desempeño clínico en terreno.
- La meta de seguridad (under-triage P1 = 0%) es bloqueante y prevalece sobre la
  precisión sindrómica.

---

## 8. Límites declarados (para honestidad de publicación)

- No es diagnóstico; es apoyo a la decisión y priorización.
- La mitad de historia/síntomas depende de la calidad del input del clínico.
- Derm1M/SkinCon son anotaciones de imágenes; no aportan historia ni urgencia.
- Sin validación prospectiva externa ni multicéntrica a la fecha.

---

## 9. Roadmap de migración (orden sugerido, para no entrar en bucles)

1. **[hecho]** Derivar pesos morfológicos por log-odds desde Derm1M (§5.1).
2. **[hecho]** Ampliar taxonomía a 14 síndromes y cobertura a 64%.
3. **[en curso]** Tipo B / triage en 3 capas (§5.3):
   - 3a. **[hecho, 14/14 síndromes]** Tabla de triage de 3 capas por síndrome en
     [`docs/ssmso_triage_map.md`], cada criterio citado: 8 síndromes ambulatorios
     desde el protocolo SSMSO + 6 agudos/de especialidad (drug_reaction, urticaria,
     ampolloso, vasculitis, conectivo, bacteriano) desde guías nac/internacionales.
   - 3b. **[hecho]** Inputs de severidad en el formulario: refractariedad, BSA %,
     sitio especial, tamaño, conteo de lesiones. Pendientes menores: dificultad
     respiratoria/angioedema, recurrencia, crepitación (gaps de los síndromes agudos).
   - 3c. Reemplazar `WEIGHT_MATRIX` por las 3 capas en el orquestador; reordenar
     `runTriage` para que el síndrome se calcule antes de la urgencia.
4. Mapear cada safety rule a su guía (§5.4).
5. Integrar los pesos derivados al motor (reescalar log-odds, re-validar).
6. Retrain híbrido del RF (morfología real + historia respaldada por guías) (§5.2).
7. Validación con casos reales etiquetados (§7).

> Regla de proceso: ningún paso que introduzca un número nuevo se da por cerrado
> hasta que ese número tenga fuente (dato o guía) registrada aquí o en el código.

---

## 10. Estado actual vs objetivo

| Pieza | Hoy | Objetivo |
| :--- | :--- | :--- |
| Pesos morfológicos | fiteados | log-odds de Derm1M (citable) |
| Triage | softmax feature→prioridad (a mano) | 3 capas: síndrome→base + severidad + red flags (SSMSO) |
| Captura de severidad | solo generalizado/localizado | inputs BSA %, refractariedad, sitio especial |
| Clasificador | sintético | híbrido (morfología real + historia por guías) |
| Safety rules | sin cita | mapeadas a guías |
| Validación | sintética/curada | casos reales |
| Taxonomía | 14 síndromes | 14 síndromes ✅ |
