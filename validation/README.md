# Suite de Validación — DermatoTriage CDSS

Scripts Node que ejercitan el motor clínico (`frontend-v2/src/engine/`) fuera de
React, para validar el contrato de datos y medir el rendimiento clínico.

> Todos los scripts importan el engine real (`../../frontend-v2/src/engine/`) y
> derivan la raíz del repo desde `import.meta.url`, por lo que son portables: se
> pueden correr desde cualquier directorio.

## Comandos (desde la raíz del repo)

| Comando | Qué hace | Resultado esperado |
| :--- | :--- | :--- |
| `npm run validate` | Compuertas estructurales: integridad del mapa de conceptos + schema de casos + contrato del modelo RF | Debe pasar (exit 0) |
| `npm run validate:integrity` | Features de `constants.js` presentes en `concept_canonical_map.json` | 0 faltantes |
| `npm run validate:schema` | El dataset de casos respeta el contrato clínico vigente | SCHEMA OK |
| `npm run validate:contract` | Las features del Random Forest existen en `FEATURE_INDEX` y los árboles referencian índices válidos | Contrato validado |
| `npm run validate:bench` | Benchmark clínico sobre casos curados (triage + síndrome) | **Puede fallar (exit 1)** si la accuracy está bajo umbral — es una señal del modelo, no del harness |

## Scripts individuales (`validation/scripts/`)

- **Compuertas de contrato**: `validate_case_schema.js`, `validate_probabilistic_contract.js`, `validate_clinical_cases.js`, `validate_clinical_cases_hd.js`
- **Benchmarks sintéticos** (generan reportes en `reports/`): `run_easy_case_benchmark.js`, `run_synthetic_case_benchmark.js`, `run_synthetic_case_benchmark_v2.js`, `run_syndromic_audit_v2.js`, `fase8_validation_reporter.js`
- **Verificación de resiliencia**: `verify_v2_1_engine.js`

## Nota sobre los benchmarks

`validate:bench` reporta el desempeño real del motor y actualmente **falla el
umbral** (accuracy sindrómica ~71% vs meta 85%, y casos de under-triage P1
detectados). Eso es esperado: el harness está para **exponer** esas debilidades,
no para ocultarlas. Mejorar esas métricas es trabajo clínico/de modelo, separado
del mantenimiento del harness.
