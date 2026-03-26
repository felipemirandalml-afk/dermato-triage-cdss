# Análisis de Exclusiones y Hallazgos Diferidos (Fase 7A)

## 1. Conceptos Evaluados y Descartados para Reglas Cardinales
Los siguientes descriptores canónicos han sido evaluados pero no se han incluido como reglas cardinales en la presente fase:

| Concepto | Motivo de la Exclusión | Futura Revisión |
| :--- | :--- | :--- |
| **Color Violáceo** | Riesgo de sesgo por fototipo (Fitzpatrick). En fototipos oscuros, el eritema puede verse violáceo sin ser patognomónico de liquen plano. | Auditoría Bias v1.1 |
| **Patrón Lineal** | Descriptor demasiado genérico (Kóebner, Dermatitis de contacto, Fitofotodermatitis, Escabiosis). Falta de un anchor diagnóstico de alta confianza único. | Fase 7B |
| **Brusco/Repentino** | Concepto ya manejado por `agudo` en el modelo LR. Se prefiere no duplicar reglas para evitar sobre-pesajes. | N/A |
| **Induración** | Requiere evaluación táctil. Baja fiabilidad en una herramienta de soporte visual/triage telemático inicial. | Fase 8 |

## 2. Decisiones Técnicas
Se ha decidido mantener las reglas de la Fase 7A como **"Anclas Fuertes"** y no como penalizadores radicales de otros síndromes, con la excepción de las supresiones mutuas entre Viral e Inflamatorio/Bacteriano, donde el riesgo de diagnóstico erróneo por sesgo estadístico es mayor.

## 3. Hoja de Ruta para Descripcion de Colores
Antes de que el **Color Violáceo** sea una regla para Liquen Plano, se requiere verificar la consistencia de este hallazgo en el dataset SkinCon segregado por subgrupos de Fitzpatrick.
