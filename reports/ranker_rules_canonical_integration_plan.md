# Plan Técnico: Integración Canónica de Reglas y Ranker

## 1. Contexto Actual
Actualmente, `cardinal_feature_rules.js` y `differential_ranker.js` dependen de IDs directos de `constants.js` o nombres crudos de `Derm1M`.
Con la introducción de `concept_mapper.js`, tenemos una capa de abstracción que permite independizar la lógica de los nombres de entrada.

## 2. Objetivos de Migración
- Eliminar la dependencia de prefijos (`lesion_`, `signo_`) en la definición de reglas.
- Permitir que las reglas usen términos universales (ej. `bulla` en lugar de `bula_ampolla`).
- Unificar el scoring del ranker usando frecuencias canónicas.

## 3. Estrategia de Implementación

### Fase A: Refactor de Cardinal Rules
**Estado:** `h.has('lesion_papula')`
**Propuesta:** Modificar el `FeatureHelper` (en `feature_encoder.js`) para que el método `.has()` use internamente `conceptMapper.resolve()`.
- **Impacto:** Las reglas se vuelven "agnósticas" al nombre. Se podrá escribir `h.has('Papule')` o `h.has('papula')` y ambas funcionarán.

### Fase B: Normalización por Lado de Datos (Ranker)
**Estado:** El ranker usa `SEMIOLOGY_PROFILES` crudos de Derm1M.
**Propuesta:** Pre-procesar los perfiles durante la carga para convertir las llaves de Derm1M a IDs canónicos.
- **Implementación:**
  ```javascript
  const CANONICAL_PROFILES = {};
  for (let disease in SEMIOLOGY_PROFILES) {
      CANONICAL_PROFILES[disease] = {};
      for (let concept in SEMIOLOGY_PROFILES[disease]) {
          const cid = conceptMapper.resolve(concept);
          if (cid) CANONICAL_PROFILES[disease][cid] = SEMIOLOGY_PROFILES[disease][concept];
      }
  }
  ```

### Fase C: Cleanup de Constants
Una vez que las reglas y el ranker usen la capa canónica, podremos limpiar `FEATURE_ALIASES` de `constants.js`, dejando solo el vector de entrada crudo y delegando toda la sinonimia al `concept_canonical_map.json`.

## 4. Cronograma Sugerido
1. **v1.2.0**: Migración de `FeatureHelper` (Realizado parcialmente en esta sesión).
2. **v1.2.1**: Refactor de `differential_ranker.js` para usar perfiles canónicos.
3. **v1.3.0**: Limpieza total de `constants.js`.
