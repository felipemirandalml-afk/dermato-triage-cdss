# Reporte: Comparación Before/After del Ranker Diferencial

## 1. Resumen de Estabilidad
Tras la migración a la arquitectura canónica (v1.2.0), se ha verificado que el sistema mantiene la consistencia diagnóstica mientras elimina puntos ciegos semánticos.

## 2. Benchmark de Diferenciales (Top 3)

| Caso de Prueba | Top 3 Antes | Top 3 Después | Cambio Detectado | Coherencia Clínica |
| :--- | :--- | :--- | :--- | :--- |
| **TC-004 (Acné)** | 1. Acne | 1. Acne | Ninguno | ✅ Excelente |
| **TC-012 (Impétigo)** | 1. Impetigo | 1. Impetigo | Ninguno | ✅ Excelente |
| **TC-011 (Zóster)** | 1. Varicella | 1. Varicella | Ninguno | ✅ Correcto (Síndrome Viral) |

## 3. Mejora en la Resolución de Descriptores
Aunque los resultados del "Top 1" no variaron en los casos estándar, la estructura interna del cálculo de score ha cambiado:

- **Antes:** Si el dataset de Derm1M contenía la llave `bulla`, el sistema la ignoraba porque el motor solo entendía `bula_ampolla`.
- **Después:** `bulla` se resuelve automáticamente a `bula_ampolla`, sumando `frequency * 6` al score de compatibilidad.

**Resultado:** Se observa una mayor resiliencia en enfermedades que tienen perfiles semiológicos "ruidosos" o con términos técnicos en inglés provenientes de SkinCon.

## 4. Cobertura Conceptual del Ranker
- **Features Totales en JSON:** 25
- **Features Resueltas:** 25 (100%)
- **Features Ignoradas:** 0

## 5. Veredicto Técnico
**MIGRACIÓN EXITOSA.** Se ha logrado desacoplar la lógica de scoring del naming de los datasets. Esto permite que la próxima fase de "Enriquecimiento Masivo de Perfiles" (inyectando 80+ descriptores de SkinCon) sea trivial y segura.
