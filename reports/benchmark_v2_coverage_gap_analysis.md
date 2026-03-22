# Análisis de Brechas de Cobertura: Benchmark Masivo v2.0 (Phase 10)

## 1. Auditoría del Estado Actual (v1.0)
- **Diagnósticos Cubiertos**: 64 (Derivados exclusivamente de `SYNDROME_TO_ONTOLOGY_MAP`).
- **Casos Generados**: 192 (Ratio de 3:1).
- **Universo de Derm1M**: ~4,400 entidades clínicas (aprox. 1,500 únicas tras normalización).
- **Cobertura Real**: **< 2%** del conocimiento semiológico disponible en el repositorio.

## 2. Brechas Semiológicas Detectadas
- **Topografía**: La v1 dependía de un "Habitat Map" estático muy pequeño. La mayoría de los casos se asignaban a "tronco", perdiendo la especificidad de zonas críticas (caras, manos, pies).
- **Entidades Raras**: Muchas enfermedades del Derm1M con perfiles ricos (ej. Pityriasis Rubra Pilaris, Sarcoidosis) no estaban en la lista de diferenciales del mapa de síndromes.
- **Variantes de Stress**: La v1 solo contemplaba `core`, `sparse` y `atypical`. Faltan variantes de **"Confusión Cruzada"** (donde se mezclan hallazgos de dos enfermedades).
- **Inconsistencias Morfológicas**: Algunos perfiles de Derm1M tienen "ruido" (ej: tumores con `eritema`). El generador v1 no filtraba estas colas estadísticas de forma robusta.

## 3. Metas de Expansión v2.0
- **Volumen**: 2,000 - 5,000 casos sintéticos.
- **Diagnósticos**: Expandir a **TODAS** las entradas del `semiology_profiles.json` que tengan al menos 3 descriptores significativos.
- **Diversidad**: Integrar múltiples topografías plausibles por entidad.
- **Stress-Test**: Inclusión de combinaciones deliberadamente ruidosas y casos con "input contradictorio".

## 4. Conclusión
La v1.0 fue una prueba de concepto exitosa. La v2.0 debe ser el **benchmark de estrés definitivo** antes de la auditoría final de seguridad clínica.
