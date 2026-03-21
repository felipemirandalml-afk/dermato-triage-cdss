# Concept Coverage Audit Summary

## 1. Métricas de Cobertura

- **Universo Conceptual Externo (Datasets):** 182 conceptos únicos.
- **Entendimiento Interno (Sistema):** 109 conceptos canónicos.
- **Exposición en UI:** 65 elementos de formulario.
- **Uso en Reglas Expertas:** 44 conceptos.
- **Uso en Motor de Diferenciales:** 25 conceptos.

## 2. Gaps Semánticos Identificados

### 🚩 Potencial No Explotado (179 conceptos)
Datasets contienen conceptos que no están mapeados en el motor actual:
- `(c) lymphohistiocytic infiltrate`
- `Abscess`
- `Acuminate`
- `Atrophy`
- `Black`
- `Blue`
- `Brown(Hyperpigmentation)`
- `Bulla`
- `Burrow`
- `Comedo`
- `Crust`
- `Cyst`
- `Dome-shaped`
- `Erosion`
- `Erythema`
- `Excoriation`
- `Exophytic/Fungating`
- `Exudate`
- `Fissure`
- `Flat topped`
... (ver JSON para lista completa)

### 🔍 Conceptos Internos Huérfanos (106 conceptos)
Conceptos definidos en `constants.js` que no tienen un match exacto con el nombre crudo de datasets (requieren canonicalización):
- `agudo`
- `antecedente_autoinmune`
- `antecedente_eii`
- `antecedente_neoplasia`
- `antecedente_obesidad`
- `antecedente_quimico`
- `antecedente_trauma`
- `antecedente_viaje`
- `atopia`
- `atrofia`

## 3. Top Conceptos de Alto Valor No Explotados (SkinCon)
- `Abscess` (Específico de SkinCon)
- `Acuminate` (Específico de SkinCon)
- `Atrophy` (Específico de SkinCon)
- `Black` (Específico de SkinCon)
- `Blue` (Específico de SkinCon)
- `Brown(Hyperpigmentation)` (Específico de SkinCon)
- `Bulla` (Específico de SkinCon)
- `Burrow` (Específico de SkinCon)
- `Comedo` (Específico de SkinCon)
- `Crust` (Específico de SkinCon)
- `Cyst` (Específico de SkinCon)
- `Dome-shaped` (Específico de SkinCon)
- `Erythema` (Específico de SkinCon)
- `Excoriation` (Específico de SkinCon)
- `Exophytic/Fungating` (Específico de SkinCon)
