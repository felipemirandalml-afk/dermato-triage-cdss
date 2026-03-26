# Mantenimiento del Repositorio (v1.5.0) 🛠️

Este documento define el protocolo real para mantener la integridad técnica de DermatoTriage CDSS.

---

## 🏗️ Flujo de Trabajo (Workflows)

Cualquier cambio en la lógica clínica o los datos debe seguir este orden estricto:

### 1. Validación de Contrato (Schema)
Antes de cualquier otra prueba, asegúrese de que el cambio no rompa el mapeo de variables:
```bash
node tools/validate_case_schema.js
```
El éxito se define por `Total Unknown Inputs: 0`.

### 2. Validación de Rendimiento (Benchmark)
Ejecute el benchmark clínico completo para detectar regresiones:
```bash
npm run validate
```
**Meta Crítica**: La seguridad P1 (Under-triage) debe mantenerse siempre en **0%**. La exactitud sindrómica objetivo es **>60%** en el estado actual.

---

## 📂 Guía de Edición Segura

### A. Modificar Variables (Features)
1. **Definición**: Agregue el ID en `engine/constants.js` -> `FEATURE_INDEX`.
2. **Interfaz**: Cree el elemento en `index.html` con el ID coincidente.
3. **Mapeo**: Asegúrese de que el `concept_mapper.js` la reconozca si proviene de fuentes externas (Datasets).

### B. Ajustar Pesos del Modelo
- **No intente editar `engine/rf_model.json` manualmente**. Es un objeto serializado de Scikit-learn.
- **Acción**: Si necesita cambios de fondo, debe re-entrenar usando `tools/train_and_evaluate.py` ajustando los hiperparámetros o el dataset en `data/training_cases_v2.csv`.
- **Excepción**: Los ajustes finos de recalibración se realizan en `data/classwise_bias_corrections_v1.json`.

### C. Reglas Heurísticas (Seguridad)
- Modifique `engine/safety_modifiers.js` para alertas de vida (Red Flags).
- Modifique `engine/context_modifiers.js` para ajustes por perfil de paciente (Edad, Cronicidad).
- **Regla de Oro**: La heurística de seguridad prevalece sobre el modelo probabilístico en el orquestador `model.js`.

---

## 📜 Gobernanza del Estado
- **Runtime**: Contenido en la raíz y `/engine`. Es síncrono y portable.
- **Training**: Contenido en `/tools` y `/data`. Estos procesos son costosos y asíncronos.
- **Legacy**: Todo archivo marcado como obsoleto debe vivir en `archive/`. No borre archivos sin antes moverlos a esta zona de cuarentena.

---

## ⚠️ Nota Ética y de Seguridad
Cualquier modificación que degrade el rendimiento del triage P1 es motivo de bloqueo inmediato de la versión. La prioridad de este sistema es **la seguridad del paciente en APS**, no la sofisticación estadística.
