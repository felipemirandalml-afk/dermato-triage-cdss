# Auditoría de Viabilidad: Generación Masiva de Casos Sintéticos (Fase 9)

## 1. Mapeo de Fuentes de Datos
- **Derm1M (Profiles)**: Proporciona frecuencias morfológicas (ej: pápula en herpes zóster = 0.42). 
- **SkinCon (Metadata)**: Útil para validación cruzada de descriptores y diversidad Fitzpatrick.
- **Ontología Canónica**: Provee el pegamento semántico para traducir descriptores a los IDs que entiende el `feature_encoder.js`.
- **Reasoning Map (Engine)**: Proporciona las reglas para asignar síntomas (dolor, fiebre) basándose en la enfermedad o síndrome.

## 2. Variables Mapeables y Brechas

| Variable | Estado en Dataset | Estrategia Generador |
| :--- | :---: | :--- |
| **Morfología** | ✅ (Full) | Muestreo probabilístico según `semiology_profiles.json`. |
| **Topografía** | ⚠️ (Parcial) | Inferencia por "Habitat Map" derivado de guías clínicas. |
| **Tiempo (Timing)**| ❌ (Casi Nulo) | Asociación determinística por etiología (Viral=Agudo, Tumor=Crónico). |
| **Síntomas** | ❌ (Casi Nulo) | Asociación heurística (Infecto-contagioso=Fiebre, Inflamatorio=Prurito). |
| **Fitzpatrick** | ⚠️ (Parcial) | Distribución sintética equilibrada para evaluación de bias. |

## 3. Limitaciones Identificadas
- **Ausencia de Dinámicas**: Los datasets son mayormente estáticos; no capturan bien la evolución de los síntomas (ej. "empezó con dolor y luego vesículas").
- **Sub-reporte de Hallazgos Negativos**: Los datasets tienden a reportar solo lo positivo. Se requiere una capa de "ruido clínico" (negative sampling) para simular casos reales (ruidosos e incompletos).
- **Inferencia de Prioridad Triage**: La fuente de datos no tiene la "verdad de prioridad clínico-técnica". Se usará la prioridad teórica del `regression_pack_sentinel` para validar grupos conocidos.

## 4. Conclusión de Viabilidad
Es **ALTAMENTE VIABLE** construir un generador que combine la evidencia estadística de Derm1M con una capa de "Aumento Epidemiológico" (Age map, Context map) para producir miles de casos plausibles compatibles con el pipeline de DermatoTriage.
