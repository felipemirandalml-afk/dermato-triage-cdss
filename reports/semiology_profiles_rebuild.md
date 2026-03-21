# Reporte: Reconstrucción Canónica de Perfiles de Semiología (v1.2.0)

## 1. Resumen de la Operación
Se ha regenerado el archivo `engine/semiology_profiles.json` utilizando una arquitectura de "Ontology-First Bootstrapping". Este cambio desacopla el conocimiento clínico de Derm1M de sus etiquetas originales, permitiendo una expansión semántica masiva.

## 2. Métricas de Expansión
| Métrica | Base v1.1 | Enriquecido v1.2 | Delta |
| :--- | :---: | :---: | :---: |
| **Enfermedades Perfiladas** | 4174 | 4426 | **+252** |
| **Descriptores Activos** | 25 | 32 | **+7** |
| **Resolución Canónica** | Parcial | Total | 🚀 |

## 3. Nuevos Conceptos Explotados por el Ranker
Gracias a la expansión del `concept_canonical_map.json`, el motor ahora puntúa activamente:
- **Configuraciones:** `patron_anular`, `patron_lineal`, `patron_zosteriforme`.
- **Morfología Avanzada:** `umbilicacion` (Mollusco), `cupuliforme` (Nevos/Tumores).
- **Matices Cromáticos:** `color_violaceo`.

## 4. Trazabilidad de Fuentes
- **Derm1M:** Fuente primaria de frecuencias por enfermedad.
- **SkinCon:** Aportó la taxonomía para descriptores morfológicos finos (Dome-shaped -> Cupuliforme) que ahora están mapeados en el builder.

## 5. Conclusión
El sistema ha ganado profundidad diagnóstica especialmente en cuadros con configuraciones espaciales características (ej. Herpes Zóster y Tiñas), manteniendo una estabilidad absoluta en el benchmark de seguridad P1.
