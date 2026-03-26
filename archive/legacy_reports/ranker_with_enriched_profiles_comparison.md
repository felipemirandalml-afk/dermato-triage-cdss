# Reporte: Comparación de Rendimiento del Ranker Enriquecido (v1.2.0)

## 1. Conclusiones Directas
La migración a perfiles canónicos enriquecidos ha permitido al sistema discriminar diagnósticos por **configuración espacial**, reduciendo la ambigüedad en cuadros morfológicos similares but topográficamente distintos.

## 2. Casos de Mejora Clínica

| Diagnóstico | Hallazgo Clave v1.1 | Hallazgo Clave v1.2 | Impacto en el Ranker |
| :--- | :--- | :--- | :--- |
| **Herpes Zóster** | Vesículas, Pápulas | Vesículas, Pápulas, **Patrón Zosteriforme** | Mayor especificidad frente a Herpes Simplex (que no suele ser zosteriforme). |
| **Keratoacantoma** | Nódulo, Eritema | Nódulo, Eritema, **Cúpuliforme** | Lo aleja de tumores planos y lo acerca a su morfología patognomónica. |
| **Tiña Corpórea** | Placa, Escama | Placa, Escama, **Configuración Anular** | Diferenciación crucial frente a Psoriasis o Dermatitis Atópica. |

## 3. Estabilidad y Regresión
No se detectaron regresiones en el **Benchmark de Prioridad Triage (P1-P3)**. Las nuevas features actúan como amplificadores para los diferenciales sin degradar el accuracy del síndrome general del modelo probabilístico.

## 4. Diferenciales Detectados (Ejemplo: Herpes Zóster)
- **Score v1.1:** 15.2
- **Score v1.2:** 18.5 (Boosted by `patron_zosteriforme: 0.191`)
- **Estado:** Más robusto y con mayor justificación clínica.
