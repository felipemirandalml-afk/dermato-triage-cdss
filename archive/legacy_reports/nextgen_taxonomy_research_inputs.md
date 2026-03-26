# Investigación de Entradas Taxonómicas de Próxima Generación (Phase 23)

Este documento detalla los pilares de evidencia para la transición hacia una taxonomía jerárquica masiva.

## 1. Fuentes de Evidencia Utilizadas

- **Firma Clínica Masiva**: `semiology_profiles.json` (4,426 enfermedades). Proporciona la similitud semiológica natural ("closeness") entre diagnósticos.
- **Evidencia v2 (RPR)**: `feature_discriminative_scores_v2.json`. Define qué anclas realmente separan a las familias biológicas.
- **Matriz de Confusión v2 (Runtime)**: `syndromic_confusion_matrix_runtime_v2.json`. Muestra dónde la taxonomía actual colapsa estructuralmente.
- **Mapeo Ontológico Actual**: `syndrome_to_ontology_map.js`. Línea base del diseño inicial.

## 2. Hallazgo Clave: El Conflicto de la Homogeneidad
La auditoría revela que **todos los síndromes actuales están fragmentados**.
- **Ejemplo Bacteriano**: El sistema agrupa "Abscesos" (Nódulos profundos) con "Impetigo" (Vesículas superficiales). Esta unión obliga al modelo a diluir su señal de peso, restando capacidad discriminativa ante infecciones virales.
- **Ejemplo Eczema**: Se mezclan dermatitis seborreicas (cara/oleosas) con dermatitis atópicas (flexuras/secas), generando un vector central ineficiente.

## 3. Conclusión de la Investigación
La taxonomía de 12 clases planas es el **principal factor de Plateau**. Para alcanzar precisiones > 85%, el sistema debe migrar hacia una **Arquitectura en Cascada** que respete los Clusters Naturales detectados en la Fase 24.
