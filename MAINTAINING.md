# Mantenimiento y Extensión de DermatoTriage CDSS (v1.3.0)

Este documento describe el protocolo técnico y clínico para mantener, extender y escalar la plataforma.

---

## 🏗️ Protocolo de Desarrollo (CI-Manual)

Cualquier cambio en la lógica clínica o los datos debe seguir este flujo obligatorio antes de ser integrado a `master`:

### 1. Validación Estructural (Schema)
Antes de ejecutar el benchmark clínico, asegúrese de que el dataset no tenga errores de sintaxis o keys inexistentes:
```bash
node tools/validate_case_schema.js
```
**Resultado Esperado**: `Total Unknown Inputs: 0`.

### 2. Validación Clínica (Benchmark)
Ejecute el set completo de casos para detectar regresiones en la prioridad de triage:
```bash
node tools/validate_clinical_cases.js
```
**Meta de Seguridad**: P1 Safety debe mantenerse en **100%**.

---

## 🧩 Cómo Extender el Sistema

### A. Agregar el Soporte para una Nueva Feature (Variable)
1. **Definición en `constants.js`**: Agregue la nueva variable en `FEATURE_INDEX` y su etiqueta legibles en `FEATURE_MAP_LABELS`.
2. **Aliases en `feature_encoder.js`**: Si la variable viene de un formulario con nombres de ID distintos, agréguelo al mapeo de `aliases`.
3. **Mapeo en `index.html`**: Agregue el checkbox o radio con el ID correspondiente.

### B. Ajustar el Modelo Probabilístico (Pesos)
Si un síndrome está siendo infravalorado:
- **No modifique `probabilistic_model.js` directamente**.
- **Acción**: Identifique el coeficiente en `engine/model_coefficients.json` y realice ajustes finos (v1.x) o re-entrene (v2.x).
- **Justificación**: Todo cambio en pesos debe ser documentado en `CALIBRATION_NOTES.md`.

### C. Refinar el Triage (Modifiers)
- **Heurística de Red Flags**: Use `engine/safety_modifiers.js` para reglas de "Punto de Alarma" (Ej: SJS/NET, Necrosis).
- **Heurística de Contexto**: Use `engine/context_modifiers.js` para factores sistémicos (Ej: Inmunosupresión).
- **Regla Oro**: El modifier **siempre** prevalece sobre el modelo estadístico por razones de seguridad vital.

---

## 📈 Gobernanza de Datos (`clinical_cases.js`)

Para agregar un nuevo caso clínico al benchmark:
1. **ID Único**: Siga la secuencia `TC-XXX`.
2. **Input Crudo**: Proporcione un objeto `input` que contenga solo las variables semiológicas activas.
3. **Expected Priority**: Ingrese la prioridad P1/P2/P3 consensuada clínicamente.
4. **Expected Syndrome**: Ingrese el síndrome probabilístico esperado para evaluar consistencia (opcional).

---

## 📂 Inventario de Control
- **`CALIBRATION_NOTES.md`**: Registro histórico de afinamiento de pesos.
- **`GENERALIZATION_AUDIT.md`**: Reporte de sesgos y cobertura diagnóstica.
- **`CHANGELOG.md`**: Hitos de desarrollo clínico.

### Nota sobre Seguridad
DermatoTriage CDSS es una **Single Source of Truth** (SSoT). Nunca duplique etiquetas ni IDs de variables; centralícelos siempre en `engine/constants.js`.
