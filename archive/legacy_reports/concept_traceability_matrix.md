# Matriz de Trazabilidad Conceptual: DermatoTriage CDSS (Fase 8)

Esta matriz documenta el soporte de los conceptos clínicos clave a través de todas las capas del sistema, asegurando que los hallazgos de alto valor tengan una ruta clara desde la captura (UI) hasta la inferencia (Ranker).

## 1. Trazabilidad de Conceptos Clave

| Concepto | UI (ID) | Canónico (ID) | Encoder | Rules (Heur.) | Ranker | Risk (Bias) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Umbilicación** | `umbilicacion` | `umbilicacion` | ✅ | ✅ | ✅ | Bajo |
| **Zosteriforme** | `dermatomal` | `zosteriforme` | ✅ | ✅ | ✅ | Bajo |
| **Patrón Anular** | `patron_anular` | `anular` | ✅ | ✅ | ✅ | Bajo |
| **Cupuliforme** | `cupuliforme` | `cupuliforme` | ✅ | ✅ | ✅ | Bajo |
| **Vesícula** | `lesion_vesicula`| `vesicula` | ✅ | ✅ | ✅ | Bajo |
| **Bula/Ampolla** | `lesion_ampolla` | `bula_ampolla` | ✅ | ✅ | ✅ | Bajo |
| **Costra** | `lesion_costra` | `costra` | ✅ | ✅ | ✅ | Medio (Infecc.) |
| **Escama** | `lesion_escama` | `escama` | ✅ | ✅ | ✅ | Bajo |
| **Eritema** | `lesion_eritema` | `eritema` | ✅ | ✅ | ✅ | **Alto (FP)** |
| **Púrpura** | `lesion_purpura` | `purpura` | ✅ | ✅ | ✅ | Medio |
| **Color Violáceo** | `violaceo` | `color_violaceo`| ✅ | **EXCLUIDO** | ✅ | **Extremo (FP)** |

## 2. Definiciones de Riesgo Fitzpatrick
- **Bajo**: Conceptos geométricos o morfológicos estables (ej: umbilicación).
- **Medio**: Conceptos que dependen de la observación de detritos (ej: costra melicérica). Pueden variar pero mantienen su utilidad.
- **Alto (Alto)**: El **Eritema** en pieles tipo IV-VI puede presentarse como tonos oscuros o grisáceos en lugar de rojo brillante, lo que confunde a evaluadores noveles y a sistemas de IA sin entrenamiento diverso.
- **Extremo (Sesgo)**: El **Color Violáceo** se ha excluido de las reglas cardinales (Phases 7A/B) porque en pieles muy pigmentadas, la inflamación aguda puede imitar el color violáceo, induciendo a errores de diagnóstico en liquen plano vs dermatitis atópica.

## 3. Estado de Consolidación
El sistema ha logrado un **95% de trazabilidad canónica** para los descriptores morfológicos. La topografía ha sido normalizada mediante la expansión del mapa canónico en la Fase 7B, cerrando la brecha entre la captura legacy y la inferencia unificada.
