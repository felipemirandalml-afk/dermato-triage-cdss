# Reporte: Migración de Reglas Cardinales (Fase 7A)

## 1. Reglas Migradas a Capa Canónica
Se han actualizado quirúrgicamente las reglas cardinales en `engine/cardinal_feature_rules.js` para utilizar descriptores de alta especificidad clínica.

| ID Regla | Concepto Canónico | Diagnóstico Target | Impacto Clínico |
| :--- | :--- | :--- | :--- |
| `umbilicacion_central` | `umbilicacion` | Molusco Contagioso | Patognomónico (Boost Viral) |
| `vesiculas_agrupadas` | `zosteriforme` | Herpes Zóster | Diferenciación Viral vs Bacteriana |
| `configuracion_anular` | `anular` | Tiña Corporal | Diferenciación Micótica vs Placa sólida |
| `forma_cupuliforme` | `cupuliforme` | Queratoacantoma / CBC | Orientación Tumoral exofítica |

## 2. Refinamiento del Pipeline (Fixes)
Durante esta fase se identificaron y corrigieron dos limitaciones críticas:
- **FeatureHelper Extendido:** Se actualizó `engine/feature_encoder.js` para que el método `has()` consulte tanto el vector `X` como el `featureMap`. Esto permite usar conceptos canónicos en reglas aunque no estén en el modelo LR.
- **Sincronización de Síndromes:** Se añadieron `boost_syndromes` y `suppress_syndromes` a las reglas para asegurar que el motor probabilístico deje espacio al diferencial correcto.
- **Re-ordenamiento de Síndromes:** Se corrigió un bug en `model.js` donde el refinamiento de probabilidades no actualizaba el ranking de candidatos.

## 3. Comportamiento Clínico
Las nuevas reglas actúan como **Anclas de Certidumbre**. En presencia de umbilicación, el sistema ahora es capaz de ignorar sesgos estadísticos (ej: confundir papulas de niño con dermatitis) y priorizar la sospecha viral.

## 4. Próximos Pasos
La Fase 7A demuestra que la capa canónica es estable para reglas de negocio. Se recomienda proceder a la Fase 7B (Migración Masiva) una vez auditado el impacto en fototipos oscuros del descriptor "Color Violáceo".
