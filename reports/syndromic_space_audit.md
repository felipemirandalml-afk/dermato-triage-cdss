# Auditoría del Espacio Sindrómico (Fase 16)

Este reporte analiza la estructura y límites del universo clínico actual de DermatoTriage CDSS.

## 1. Composición del Universo Sindrómico
El sistema opera sobre **12 síndromes** divididos en **6 Macro-grupos**.

| Macro-grupo | Síndromes | Población de Diagnósticos | Densidad |
| :--- | :--- | :---: | :--- |
| **Inflamatorio** | 6 | ~45 diagnósticos | **Extrema**. Domina el 50% del espacio. |
| **Infeccioso** | 3 | ~18 diagnósticos | Media. Separación clara (Viral/Bac/Fun). |
| **Proliferativo**| 2 | ~10 diagnósticos | Media. Separación difícil (Benigno/Mal). |
| **Vascular** | 1 | ~4 diagnósticos | Baja. |
| **Hipersens.** | 1 | ~4 diagnósticos | Baja. |

## 2. Puntos de Falla Arquitectónica Identificados

### A. El Agujero Negro: `inflammatory_dermatosis_other`
- **Diagnósticos**: Acné, Rosácea, Escabiosis, Sífilis, Liquen Plano, etc.
- **Problema**: Es demasiado heterogéneo. El Acné (folicular/pustuloso) compite contra la Escabiosis (prurito/lineal) bajo el mismo paraguas sindrómico. Esto diluye la especificidad de las anclas.

### B. Redundancia de Etiquetas (Cross-talk)
- **Urticarial Vasculitis**: Aparece tanto en `urticarial_dermatosis` como en `vasculitic_purpuric_disease`.
- **Efecto**: Induce una ambigüedad intrínseca en el modelo basal que el ranker no puede resolver si la probabilidad se divide equitativamente.

### C. Colapso de Vesículas y Ampollas
- **Síndromes**: `viral_skin_infection` vs `vesiculobullous_disease`.
- **Confusión**: La "Vesícula" es morfológicamente el rasgo dominante en ambos. Sin contexto de "Zosteriforme" o "Mucosa", el sistema tiende a colapsar por azar estadístico.

## 3. Conclusión de Fase 1
El espacio sindrómico está **sobre-saturado en el espectro inflamatorio** y tiene definiciones demasiado amplias en la categoría "Otras". La confusión no es solo de los datos, sino de la **ontología de agrupación**.
