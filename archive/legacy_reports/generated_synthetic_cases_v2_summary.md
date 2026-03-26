# Resumen Dataset Sintético Masivo v2.0 (Phase 10)

## 1. Métricas Globales
- **Total de Casos Sintéticos**: 18,397.
- **Entidades Diagnósticas Cubiertas**: 4,426 (Derm1M completo).
- **Variantes por Diagnóstico**: Promedio de 4.1.

## 2. Distribución por Variante Clínica
| Variante | Descripción | Cantidad | % |
| :--- | :--- | :---: | :---: |
| **CORE** | Fenotipo más frecuente según frecuencia estadística. | 4,426 | 24% |
| **SPARSE** | Entrada mínima (un solo descriptor morfológico). | 4,426 | 24% |
| **ATYPICAL** | Uso de descriptores menos frecuentes (5-25%). | 2,120 | 11% |
| **BORDERLINE**| Fenotipo core + ruidos semiológicos comunes (eritema/escama). | 4,426 | 24% |
| **STRESS** | Fenotipo core + disparadores de seguridad P1 (fiebre/dolor). | 2,999 | 16% |

## 3. Cobertura Sindrómica (Heurística)
- **Infeccioso (Viral/Bacteriano)**: ~1,500 casos.
- **Inflamatorio (Eczema/Psoriasis)**: ~4,000 casos.
- **Proliferativo (Tumores)**: ~3,200 casos.
- **Inespecífico (Other)**: ~9,200 casos (Abarca entidades raras o no mapeadas).

## 4. Limitaciones del Dataset v2
- **Prevalencia Artificial**: Todas las enfermedades generan ~4 casos, independientemente de su incidencia real (ej: Melanoma tiene igual peso que una milaria rara).
- **Inferencia Heurística**: Los síndromes fuera del `SYNDROME_TO_ONTOLOGY_MAP` se infieren por nombre, lo que puede inducir a errores en diagnósticos con nombres ambiguos.
- **Sintomatología Estática**: No se modela la evolución temporal de los síntomas.

## 5. Concluclión
Este dataset constituye el **Stress-Test más exhaustivo** realizado sobre DermatoTriage hasta la fecha, permitiendo detectar no solo errores de lógica, sino también **áreas de inestabilidad estadística** en el motor probabilístico.
