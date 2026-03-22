# Auditoría de Factibilidad: Tríadas y Gestalts Clínicos (Fase 14)

## 1. Soporte de Datos para Tríadas
- **Tríadas Morfológicas (M+M+M)**: Alta factibilidad. 1,240 enfermedades en el dataset tienen 3 o más descriptores con frecuencia >15%.
- **Tríadas Topográficas (M+M+T)**: Factibilidad media. Requiere combinar los perfiles de Derm1M con un "Inferred Habitat Map" basado en el nombre de la enfermedad (ej: Acne -> Cara, Zóster -> Tronco).
- **Tríadas de Patrón (M+P+T)**: Baja/Media. Solo viable en diagnósticos con patrones muy definidos (anular, lineal, zosteriforme).

## 2. Definición de "Gestalt" en este Contexto
En DermatoTriage, un **Gestalt** es un clúster de rasgos que, al aparecer juntos, eliminan la ambigüedad residual de los pares. 
- **Par**: Vesícula + Zosteriforme (Probable Viral).
- **Gestalt**: Vesícula + Zosteriforme + Tronco/Dolor (Casi determinístico para Herpes Zóster).

## 3. Limitaciones Identificadas
- **Falta de Síntomas en Perfiles**: Los perfiles de Derm1M son mayoritariamente visuales. El "Dolor" y la "Fiebre" deben integrarse desde la capa de `Lore` para que el análisis de gestalts sea útil clínicamente.
- **Redundancia**: Muchas tríadas son simplemente una extensión ruidosa de un par fuerte. El análisis debe centrarse en la **Ganancia Incremental**.

## 4. Conclusión
El análisis de tríadas permitirá pasar de una visión de "puntos aislados" a una visión de **"cuadros clínicos"**. Se priorizarán gestalts de alto valor: Acneiforme, Psoriasiforme, Viral-Dermatómico y Ampolloso.
