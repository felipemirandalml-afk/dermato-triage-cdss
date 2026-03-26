# Inventario de Reglas Cardinales: DermatoTriage v7B

## 1. Clasificación de Reglas Actuales

| ID Regla | Estado Canónico | Dependencias Legacy | Riesgo Migración |
| :--- | :--- | :--- | :--- |
| `comedones` | **Total** | Ninguna (`comedon`) | Nulo |
| `vesiculas_agrupadas_eritema` | **Total (7A)** | Ninguna (`zosteriforme`) | Nulo |
| `ampollas_tensas` | **Parcial** | `bula_ampolla` | Bajo |
| `ampollas_flacidas_nikolsky` | **Parcial** | `bula_ampolla`, `signo_mucosas` | Bajo |
| `placa_anular_curacion_central` | **Total (7A)** | Ninguna (`anular`) | Nulo |
| `pustulas_centrofaciales...` | **Parcial** | `topo_cara_centro` | Moderado |
| `placa_eritematoescamosa...` | **Parcial** | `extensor` | Bajo |
| `umbilicacion_central` | **Total (7A)** | Ninguna (`umbilicacion`) | Nulo |
| `forma_cupuliforme` | **Total (7A)** | Ninguna (`cupuliforme`) | Nulo |
| `nodulo_perlado_telangiectasias` | **Parcial** | **DUPLICADA (IDs 116, 135)** | Nulo (Cleanup) |
| `macula_pigmentada_abcde` | **Total** | `hiperpigmentacion` | Nulo |
| `lues_acral` | **Mínimo** | `patron_acral`, `topo_palmas...` | Moderado |
| `melanoma_amelanotic` | **Mínimo** | `topog_ext_inf` | Moderado |
| `eczema_flexural` | **Parcial** | `flexural` | Bajo |
| `costras_melicericas` | **Parcial** | `topo_cara_centro` | Moderado |
| `pitiriasis_rosada` | **Parcial** | `topog_tronco` | Moderado |

## 2. Hallazgos Críticos

### A. Duplicidad de Reglas (Bug)
Se detectó que la regla para **Carcinoma Basocelular (CBC)** está definida dos veces con el mismo ID (`nodulo_perlado_telangiectasias`) en las líneas 116 y 135. La segunda versión incluye `boost_syndromes`, lo que sugiere que la primera es obsoleta.

### B. Heterogeneidad en Topografía
La mayoría de las reglas todavía dependen de prefijos `topo_` o `topog_`. Aunque el `FeatureHelper` resuelve esto, genera inconsistencia con las reglas nuevas (7A) que ya no usan prefijos.

### C. Desacople de Diagnósticos
Algunas reglas (ej: `lues_acral`) tienen condiciones un poco laxas (`papula` o `escama`) que podrían beneficiarse de una mayor especificidad ahora que el sistema soporta descriptores más finos.

## 3. Estrategia de Normalización
1. **Unificación de Topografía**: Reemplazar en las reglas `topog_tronco` por `tronco`, etc. (Asegurando que el mapa canónico soporte estos términos o que el mapper actúe de salvaguarda).
2. **Eliminar Duplicados**: Consolidar la regla de CBC en una sola versión robusta.
3. **Refinar Anclajes**: Ajustar reglas de Tiña e Impétigo para usar configuraciones espaciales en lugar de solo topografía.
