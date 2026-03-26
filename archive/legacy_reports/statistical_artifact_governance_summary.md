# Resumen de Gobernanza de Artefactos (Fase 18)

Este documento cierra la fase de re-normalización sindrómica v18. Se ha logrado una **limpieza y organización total** del estado estadístico del proyecto.

## 1. Estado de Gobernanza Operativa
- **Arquitectura de Datos**: Se ha eliminado la coexistencia ambigua entre v1 (contaminada) y v2 (normalizada RPR) en el plano de ejecución.
- **Archivado Histórico**: Todos los activos de la Fase 1 (v1) han sido encapsulados en los directorios `data/legacy_v1/` y `reports/legacy_v1/`.
- **Integridad del Motor**: Se han actualizado las dependencias del motor clínico (`recalibration_engine.js`) para consumir estrictamente los artefactos v2 generados tras la normalización.

## 2. Inventario Maestro de Activos Vigentes (Active v2)
Los siguientes archivos son los **únicos vigentes** para alimentar la lógica diagnóstica por peso estadístico:
1. `data/statistical_base_weights_v2.json`
2. `data/contextual_pair_modulators_v2.json`
3. `data/contextual_triplet_modulators_v2.json`
4. `data/syndrome_boosters_v2.json`
5. `data/feature_discriminative_scores_v2.json`

## 3. Conclusiones y Próximos Pasos
La **"Gobernanza de Artefactos"** ha sido completada con éxito. El repositorio cuenta con una trazabilidad clara de qué evidencia fue reemplazada y por qué. 

**Próximo Hito**: Una vez la base de datos está limpia y normalizada (v2), el proyecto queda listo para la **Recalibración v2 de Pesos Clínicos**, donde se ajustará el motor para aprovechar al máximo la nueva potencia de separación sindrómica lograda mediante RPR.

**Estado del Repo: LIMPIO - NORMALIZADO - GOBERNADO.**
