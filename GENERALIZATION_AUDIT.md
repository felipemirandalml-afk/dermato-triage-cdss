# Generalization Audit - DermatoTriage CDSS (Fase Auditoría)

## 1. Clasificación por Familia Clínica (Dataset v1.1 - 30 casos)

| Familia Clínica | Casos | Distribución Prioridad | Tipos Representativos | Proporción |
| :--- | :---: | :--- | :--- | :---: |
| **Infecciosas (Bact/Parasit)** | 6 | P2: 1, P3: 5 | Celulitis, Impétigo, Escabiosis, Tiña corpori | 20% |
| **Infecciosas (Virales)** | 5 | P1: 3, P2: 1, P3: 1 | Herpes Zóster (Oft/Int), Eccema Herpético, Exantema Súbito | 16.7% |
| **Farmacodermias** | 3 | P1: 2, P2: 1 | SJS, DRESS, Exantema Morbiliforme | 10% |
| **Inflamatorias Benignas** | 6 | P2: 1, P3: 5 | Atópica, Acné, Psoriasis, Rosácea, Pitiriasis | 20% |
| **Autoinmunes/Ampollosas** | 3 | P1: 3 | Pénfigo Vulgar, Pénfigo Foliáceo | 10% |
| **Neoplásicas** | 4 | P2: 4 | CBC, Melanoma, CEC | 13.3% |
| **Vasculíticas/Isquémicas** | 3 | P1: 3 | Vasculitis Sistémica, Necrosis Tisular, Púrpura Retiforme | 10% |

---

## 2. Reporte de Cobertura y Sesgos Detectados

### Cobertura por Prioridad
- **P1 (Urgencia)**: 12 casos (40%). Cobertura excelente en fallas de barrera y riesgo vital.
- **P2 (Prioritario)**: 8 casos (26.7%). Enfoque en oncología y reacciones moderadas.
- **P3 (Estable)**: 10 casos (33.3%). Cubre patología dermatológica más frecuente en APS.

### Dependencia de Modifiers (Audit v2.0)
- **Casos que requieren Modifiers para PASS**: 8/30 (26.7%).
- **Modifiers más activos**:
    1. `ISCHEMIC_NECROSIS` (Púrpura retiforme, Necrosis tisular).
    2. `OCULAR_RISK` (Zóster oftálmico, Celulitis periorbitaria).
    3. `MALIGNANCY_SUSPICION` (CBC, Melanoma, CEC).
- **Sesgo Detectado**: El modelo estadístico base (score) tiende al subtriage en lesiones crónicas aunque sean malignas, dependiendo críticamente del modificador heuístico para llegar a P2.

---

## 3. Fortalezas y Puntos Ciegos

### Fortalezas
- **Alta sensibilidad en Banderas Rojas**: La combinación de Fiebre + Dolor + Ampollas/Púrpura es prácticamente infalible para P1.
- **Diferenciación Pediátrica**: Se logró aislar exantemas víricos simples (P3) de urgencias.

### Puntos Ciegos / Riesgos Remanentes
- **Mimickers Ambulatorios**: Cuadros como la sífilis secundaria (no representada) podrían confundirse con pitiriasis rosada (P3).
- **Inmunosupresión**: Aunque la variable existe, hay pocos casos que prueben si un cuadro leve en un paciente con VIH/Transplante escala correctamente a P2/P1 por su contexto.
- **Zonas Acrales**: Falta de casos de isquemia distal leve o fenómeno de Raynaud crítico.

---

## 4. Análisis de Generalización (Set v1.2 - 40 casos)

La expansión a 40 casos redujo la concordancia al **87.5%**, revelando debilidades en el modelo estadístico base ante contextos sistémicos complejos:

### Fallos Críticos Detectados (Nuevos)

| ID | Caso | Fallo | Causa Raíz | Gravedad |
| :--- | :--- | :--- | :--- | :--- |
| **TC-034** | Pie Diabético Isquémico | P2 en vez de P1 | El score por `riesgo_metabolico` no es suficiente para P1 ante una úlcera si no hay dolor/fiebre. | **ALTA** |
| **TC-031** | Sífilis Secundaria | P3 en vez de P2 | El patrón acral + papular generalizado es visto como una dermatitis inflamatoria estable por el motor. | MEDIA |
| **TC-032** | VIH + Moluscos Gigantes | P3 en vez de P2 | La señal `inmunosupresion` no tiene peso suficiente para escalar pápulas crónicas a prioridad especialista. | MEDIA |
| **TC-037** | Melanoma Subungueal | P3 en vez de P2 | Una mancha crónica en zona acral no dispara señales de alarma para el motor base. | **ALTA** |

### Conclusiones de Auditoría
1. **Invisibilidad del Contexto**: El motor ignora casi totalmente el impacto de la Inmunosupresión y el Riesgo Metabólico en la severidad potencial de un cuadro "estable".
2. **Dependencia de la Morfología**: Si la lesión no es "tumoral" u "oncogénica clara", el motor la clasifica como P3, perdiendo mimickers sistémicos (Lúes) o variantes malignas sutiles (Melanoma lentiginoso).
3. **Recomendación**: Se requiere una nueva capa de `Modifier` por Contexto Sistémico para la v2.1.
