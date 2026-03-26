# Backlog Priorizado de Intervención Sindrómica (Fase 16)

Este backlog define las intervenciones necesarias para rescatar la separación sindrómica del motor.

## 1. Prioridad Crítica (Inmediata)
### P0: Normalización por Población Sindrómica
- **Acción**: Regenerar `feature_discriminative_scores.json`, `feature_pair_scores.json` y `feature_triplet_scores.json`.
- **Cambio**: Sustituir conteos absolutos por **Ratio de Prevalencia Relativa (RPR)**.
- **Efecto**: El `comedon` debe tener el 100% de su peso en `acneiforme` (nuevo síndrome) y el `patron_zosteriforme` en `viral`.

## 2. Prioridad Alta (Arquitectura)
### P1: Fragmentación de `inflammatory_dermatosis_other`
- **Cambio**: Crear 3 sub-síndromes:
  1. `appendage_disorders_acne_rosacea` (Acné, Rosácea, Hidradenitis)
  2. `ectoparasitosis_scabies` (Escabiosis, Picaduras)
  3. `systemic_autoimmune_overlap` (Sarcoidosis, Lupus, Sífilis)
- **Efecto**: Reduce la entropía de la categoría "Cajón de Sastre".

### P2: Política de "Ancla Dominante"
- **Cambio**: Si una feature tiene un **DP Score (Normalizado) > 0.8** para un síndrome, el motor basal debe ser forzado a priorizar ese síndrome, ignorando el bias estadístico acumulado.

## 3. Prioridad Media (Ajuste Fino)
### P3: Calibración de Topografía Crítica
- **Acción**: Inyectar mayor peso a las zonas geográficas que separan síndromes de forma casi binaria (ej. Palmas/Plantas para Sarna/Sífilis/Eczema Dishidrótico).

## 4. Conclusión Estratégica
La "estupidez" actual del sistema es un subproducto del **volumen crudo del dataset original**. El motor no es malo, está simplemente superado por la masa crítica de la dermatitis común. La siguiente fase **DEBE** ser la **Normalización de Evidencia Estadística** para restaurar el valor de las anclas clínicas.
