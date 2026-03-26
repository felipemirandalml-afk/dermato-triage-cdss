# Reporte de Validación por Grupos Diagnósticos (Fase 8)

Fecha: 2026-03-21

## Grupo: VIRAL
- Total Casos: 3
- Precisión Prioridad: 66.7%
- Precisión Síndrome: 0.0%

### Fallos / Discrepancias:
- [TC-044] Exantema Viral Inespecífico
  - P: Exp 3 | Got 1
  - S: Exp viral_skin_infection | Got drug_reaction
- [TC-050] Herpes Simple Periocular
  - S: Exp viral_skin_infection | Got vesiculobullous_disease
- [TC-H2-03] Zoster Sine Herpete (Herpes Zóster sin Vesículas)
  - S: Exp viral_skin_infection | Got bacterial_skin_infection

## Grupo: BACTERIANO
- Total Casos: 7
- Precisión Prioridad: 85.7%
- Precisión Síndrome: 71.4%

### Fallos / Discrepancias:
- [TC-047] Sepsis de Origen Cutáneo (Inmuno)
  - S: Exp bacterial_skin_infection | Got fungal_skin_infection
- [TC-055] Pie de Atleta con Celulitis
  - P: Exp 2 | Got 1
- [TC-H2-01] Eczema Atópico Sobreinfectado (Impetiginizado)
  - S: Exp bacterial_skin_infection | Got psoriasiform_dermatosis

## Grupo: FUNGICO
- Total Casos: 1
- Precisión Prioridad: 100.0%
- Precisión Síndrome: 0.0%

### Fallos / Discrepancias:
- [TC-045] Tiña de Cuerpo Extensa
  - S: Exp fungal_skin_infection | Got psoriasiform_dermatosis

## Grupo: INFLAMATORIO
- Total Casos: 12
- Precisión Prioridad: 75.0%
- Precisión Síndrome: 66.7%

### Fallos / Discrepancias:
- [TC-001] Dermatitis Atópica Localizada
  - S: Exp eczema_dermatitis | Got psoriasiform_dermatosis
- [TC-042] Dermatitis de Estasis Bilateral
  - S: Exp eczema_dermatitis | Got viral_skin_infection
- [TC-046] Psoriasis Eritrodérmica (Grave)
  - S: Exp psoriasiform_dermatosis | Got drug_reaction
- [TC-049] NET (Necrólisis Epidérmica Tóxica)
  - S: Exp drug_reaction | Got vesiculobullous_disease
- [TC-052] Lupus Eritematoso Sistémico (Rash)
  - P: Exp 2 | Got 3
- [TC-056] Urticaria Aguda sin Angioedema
  - P: Exp 3 | Got 2
- [TC-057] Escabiasis (Sarna) Nodular
  - P: Exp 3 | Got 2

## Grupo: PROLIFERATIVO
- Total Casos: 4
- Precisión Prioridad: 75.0%
- Precisión Síndrome: 25.0%

### Fallos / Discrepancias:
- [TC-053] Melanoma Amelanótico
  - S: Exp cutaneous_tumor_suspected | Got benign_cutaneous_tumor
- [TC-054] Queratosis Actínica Inflamada
  - S: Exp benign_cutaneous_tumor | Got psoriasiform_dermatosis
- [TC-060] Carcinoma Basocelular Ulcerado
  - P: Exp 3 | Got 2
- [TC-H2-04] Melanoma Amelanótico (Nodular)
  - S: Exp cutaneous_tumor_suspected | Got benign_cutaneous_tumor

## Grupo: VASCULAR
- Total Casos: 1
- Precisión Prioridad: 100.0%
- Precisión Síndrome: 100.0%

## Grupo: SEGURIDAD_P1
- Total Casos: 22
- Precisión Prioridad: 100.0%
- Precisión Síndrome: 81.8%

### Fallos / Discrepancias:
- [TC-046] Psoriasis Eritrodérmica (Grave)
  - S: Exp psoriasiform_dermatosis | Got drug_reaction
- [TC-047] Sepsis de Origen Cutáneo (Inmuno)
  - S: Exp bacterial_skin_infection | Got fungal_skin_infection
- [TC-049] NET (Necrólisis Epidérmica Tóxica)
  - S: Exp drug_reaction | Got vesiculobullous_disease
- [TC-H2-01] Eczema Atópico Sobreinfectado (Impetiginizado)
  - S: Exp bacterial_skin_infection | Got psoriasiform_dermatosis

