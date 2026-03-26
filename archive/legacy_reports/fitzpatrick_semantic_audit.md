# Fitzpatrick Semantic Audit Report

## 1. Distribución del Dataset de Entrenamiento

- **Light Skin (I-II/III-IV/V-VI):** 607 muestras.
- **Medium Skin (I-II/III-IV/V-VI):** 578 muestras.
- **Dark Skin (I-II/III-IV/V-VI):** 446 muestras.

## 2. Hallazgos: Dependencia del Tono de Piel

| Concepto | Prevalencia Light | Prevalencia Dark | Delta | Estado |
| :--- | :---: | :---: | :---: | :--- |
| eritema | 0.3 | 0.399 | 0.099 | Potentially Unstable |
| purpura | 0.082 | 0.087 | 0.005 | Stable |
| hiperpigmentacion | 0.069 | 0.072 | 0.003 | Stable |
| hipopigmentacion | 0.023 | 0.063 | 0.04 | Stable |
| costra | 0.068 | 0.076 | 0.009 | Stable |
| escama | 0.12 | 0.173 | 0.052 | Potentially Unstable |
| pustula | 0.021 | 0.011 | -0.01 | Stable |
| vesicula | 0.02 | 0.018 | -0.002 | Stable |
| papula | 0.219 | 0.316 | 0.097 | Potentially Unstable |
| placa | 0.433 | 0.426 | -0.007 | Stable |
| nodulo | 0.092 | 0.043 | -0.05 | Stable |

## 3. Análisis de Riesgos para el CDSS

## 4. Conclusiones y Recomendaciones
- **Robustos:** Conceptos como `papula`, `placa` y `vesicula` muestran estabilidad relativa (Delta < 0.05).
- **Vulnerables:** Los descriptores de color (`eritema`, `hiperpigmentacion`) son los más dependientes del tono.
- **Acción:** Se recomienda implementar una capa de 'Color-Neutral Semantic Anchor' en la fase 2.1 para compensar la invisibilidad del eritema en tonos V-VI.
