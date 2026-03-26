# Resumen: Selección de Features y Riesgo Semántico (v1.2.0)

## 1. Criterios de Selección (Active Schema)
Para evitar "ruido clínico", se aplicó un filtro estricto por `Group Priority` del Mapa Canónico:

| Grupo Semántico | Prioridad | Ejemplo en el Ranker | Acción Real v1.2 |
| :--- | :---: | :--- | :--- |
| `lesion_primaria` | **Alta** | Pápula, Vesícula | **Incluido** (Core del Scoring) |
| `geometria_forma` | **Media** | Anular, Cupuliforme | **Incluido** (Refinamiento diagnóstico) |
| `color_vascular` | **Alta** | Eritema | **Incluido** |
| `color_pigmentario` | **Media** | Azul, Violáceo | **Incluido** (Ayuda a diferencial fino) |
| `textura_consistencia`| **Baja** | Rugosidad | **Excluido** (Poco discriminante estadístico en Derm1M) |

## 2. Conceptos No Resueltos (Pendientes)
De los 98 conceptos de Derm1M que no se mapearon, destacamos los siguientes como críticos para la **Fase 3**:

1.  **Patrones de Inflamación:** `ecchymotic`, `exudate`, `fissured`.
2.  **Morfología P1:** `necrosis` (crucial para Fascitis Necrosante, aunque las reglas heurísticas ya lo manejen, el ranker no lo tiene en perfiles estadísticos).
3.  **Configuraciones Avanzadas:** `targetoid` (Eritema Multiforme), `satellite` (Candidiasis).

## 3. Riesgos de Sesgo Fototipo (Fitzpatrick)
- **Eritema vs Violáceo:** En pieles oscuras, el eritema puede reportarse menos en favor del color violáceo. El ranker v1.2 ahora soporta `color_violaceo`, lo que reduce el riesgo de sub-detección en fototipos altos.
- **Hiperpigmentación:** Sigue siendo una feature con alta prevalencia en Derm1M para muchas patologías. Debe vigilarse que no se convierta en una "catch-all" en pacientes con fototipo V-VI.

## 4. Recomendación Estratégica
En la siguiente fase, debemos actualizar la **UI** para que exponga formalmente los nuevos conceptos (`patron_anular`, `umbilicacion`, `cupuliforme`) para que el médico de APS pueda alimentarlos al motor y así disparar estos boosters de diferencial.
