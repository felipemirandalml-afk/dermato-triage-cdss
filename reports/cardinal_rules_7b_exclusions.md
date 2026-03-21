# Reporte de Exclusiones de Conceptos: Fase 7B

## 1. Conceptos Evaluados y Descartados

| Concepto | Razón de Exclusión | Riesgo Identificado | Estado Futuro |
| :--- | :--- | :--- | :--- |
| **Color Violáceo** | Riesgo de Sesgo Étnico | Interpretación errónea en Fitzpatrick IV-VI (Eritema vs Violáceo). | Requiere Auditoría de Color. |
| **Patrón Lineal** | Alta Ambigüedad | Demasiados diferenciales (Líneas de Blaschko, Koebner, Larva Migrans). | Mantener como descriptor débil. |
| **Brusco / Repentino** | Redundancia | Ya cubierto por el descriptor canónico `agudo`. | No añadir duplicidad. |
| **Induración** | Baja Fiabilidad | Difícil de evaluar en triage telemático sin palpación física. | Excluir de reglas cardinales. |
| **Atrofia** | Baja de Especificidad | Común en piel senil o uso de corticoides; no es ancla diagnóstica. | Mantener en perfil semiológico. |

## 2. Justificación Técnica (Sesgo Fitzpatrick)
El concepto **"Violáceo"** es un descriptor clásico del Liquen Plano, pero en pacientes con fototipos altos (Fitzpatrick IV-VI), el eritema inflamatorio suele presentarse con tonos violáceos o hiperpigmentados. Utilizarlo como ancla fuerte para Liquen Plano en una app de Triage APS podría causar **falsos negativos en celulitis o eczemas agudos** en minorías étnicas.

## 3. Limitaciones de Granularidad
El **Patrón Lineal** no se ha integrado como regla cardinal activa debido a que su activación sin morfología acompañante (ej: vesículas vs pápulas) genera demasiado "ruido" en el diferencial de APS.

## 4. Hoja de Ruta
Estos conceptos permanecen en la **Capa de Perfiles Semiológicos (Derm1M/SkinCon)** para scoring probabilístico, pero se mantienen fuera de la **Capa Heurística de Reglas Cardinales** hasta contar con validación clínica multicéntrica.
