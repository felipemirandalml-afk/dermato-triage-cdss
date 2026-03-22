# Auditoría de Datos: Epidemiología Semiológica Masiva (Fase 12)

## 1. Inventario de Fuentes Analíticas
- **Derm1M (Profiles)**: Fuente principal de frecuencias morfológicas filtradas. 4,426 perfiles únicos con proporciones de descriptores (0.0 a 1.0).
- **Syndrome Map (Engine)**: Pegamento entre diagnósticos específicos y las 11 familias sindrómicas del CDSS.
- **Canonic Map**: Normalizador de descriptores para cálculo de redundancia y agrupamiento.
- **SkinCon**: Útil para validación cruzada de descriptores de textura y color.

## 2. Métricas Calculables vs. Prohibidas

| Métrica | Factibilidad | Razón Médica/Técnica |
| :--- | :---: | :--- |
| **Frecuencia Condicional** | ✅ | Podemos calcular P(Hallazgo | Enfermedad) desde los perfiles. |
| **Poder de Separación** | ✅ | Podemos medir cuántos síndromes comparten un descriptor (Redundancia). |
| **Co-ocurrencia** | ⚠️ (Parcial) | Al ser perfiles agregados, la co-ocurrencia es una inferencia estadística (f1 * f2) y no una observación directa de casos individuales. |
| **Incidencia Real** | ❌ | Los datasets no reflejan la frecuencia de las enfermedades en la población general de APS (Sesgo de Selección). |

## 3. Estrategia de Interpretación
Toda métrica calculada en esta fase se interpretará como **Epidemiología Semiológica Interna (ESI)**. Su utilidad no es predecir la enfermedad en el vacío, sino cuantificar cuánta **señal clínica** aporta un diagnóstico dentro del universo conocido por el CDSS.

## 4. Limitaciones Críticas
- **Ruido Heredado**: Los perfiles de Derm1M contienen ruido estadístico (ej: eritema presente en casi todo cuadro inflamatorio), lo que dificultará la detección de "anclas" puras.
- **Topografía**: Muy subrepresentada en los perfiles agregados. Se requiere una capa de inferencia manual o habitat-lore para compensar.
