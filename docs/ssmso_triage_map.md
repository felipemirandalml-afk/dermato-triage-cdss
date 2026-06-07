# Tabla de Triage por Síndrome — derivada del protocolo SSMSO

> **Fuente:** *Protocolo de Resolución en Red — General de Dermatología*, Servicio de
> Salud Metropolitano Sur Oriente (SSMSO), Santiago de Chile. Versión 1.0, Resolución
> Exenta N°2499, 30/12/2022. Sección 4 (Antecedentes clínicos), patologías 4.1–4.16.
>
> **Qué es:** el contenido clínico de las 3 capas del triage (ver METHODS §5.3),
> aterrizado a la taxonomía de 14 síndromes. Es la fuente de verdad citable para el
> paso 3c (construir el triage en el motor). Cada criterio remite a su sección del
> protocolo → cero números mágicos.
>
> **Modelo:** Capa 0 = urgencia basal (piso) · Capa 1 = severidad/extensión escala
> P3→P2 · Capa 2 = banderas rojas escala →P1 (urgencia).

---

## Mapeo patología SSMSO → síndrome

| Patología SSMSO | Síndrome (14) |
| :--- | :--- |
| 4.8 Psoriasis | `psoriasiform_dermatosis` |
| 4.5 Dermatitis del pañal · 4.6 Seborreica · 4.13 Contacto · 4.16 Atópica | `eczema_dermatitis` |
| 4.11 Micosis superficiales · 4.12 Onicomicosis | `fungal_skin_infection` |
| 4.3 Moluscos · 4.4 Varicela/Herpes Zóster · 4.15 Verrugas | `viral_skin_infection` |
| 4.1 Rosácea · 4.9 Escabiosis · 4.10 Pediculosis · 4.14 Acné | `inflammatory_dermatosis_other` |
| 4.7 Vitíligo | `pigmentary_disorder` |
| 4.2 Tumores/quistes/nevos (malignos) | `cutaneous_tumor_suspected` |
| 4.2 Tumores/quistes/nevos (benignos) | `benign_cutaneous_tumor` |

---

## Tabla de triage (7 síndromes cubiertos por el protocolo)

### `psoriasiform_dermatosis` — base **P3**
- **Capa 1 → P2:** BSA **>7%** · subtipo especial (inversa, palmoplantar, ungueal, eritrodérmica, pustular) · falla a tratamiento *(SSMSO 4.8)*
- **Capa 2 → P1/Urgencia:** eritrodérmica o pustular con compromiso del estado general o hemodinámico *(4.8)*
- *Lateral:* artritis psoriática → Reumatología
- *Inputs requeridos:* **BSA%** (pendiente), subtipo morfológico, refractariedad (✓)

### `eczema_dermatitis` — base **P3**
- **Capa 1 → P2:**
  - Atópica: sin respuesta ≥1 mes · **>10% BSA** · infecciones recurrentes · eccema recurrente · prurito intratable *(4.16)*
  - Contacto: >6 semanas pese a tto completo + suspensión de contactante · resistente a manejo · persistente en palmas/plantas · severa o generalizada *(4.13)*
  - Seborreica: sin respuesta 3–6 meses · compromiso severo con erosiones/petequias *(4.6)*
  - Pañal: sin respuesta ≥1 mes · lesiones purpúricas (sospecha histiocitosis) · sospecha de psoriasis *(4.5)*
- *Inputs requeridos:* refractariedad (✓), **BSA%** (pendiente), **sitio especial** palmas/plantas (pendiente), recurrencia (pendiente)

### `fungal_skin_infection` — base **P3**
- **Capa 1 → P2:** tiña capitis inflamatoria · micosis extensa en inmunosuprimido · alta sospecha con micológico negativo · sin respuesta 3 meses *(4.11)* · onicomicosis: mala respuesta 3 meses · pruebas hepáticas alteradas · severa con contraindicación de tto sistémico · sospecha de onicodistrofia no micótica · compromiso proximal por inmunosupresión *(4.12)*
- **NO DERIVAR:** onicomicosis sin evaluación previa de respuesta a tratamiento *(4.12)*
- *Inputs requeridos:* refractariedad (✓), inmunosupresión (✓), extensión (pendiente)

### `viral_skin_infection` — base **P3** (Herpes Zóster considerar **P2**)
- **Capa 1 → P2:**
  - Moluscos: inmunosuprimido · refractario (≥4 sesiones cantaridina / post curetaje) · anogenital o periocular *(4.3)*
  - Verrugas: recalcitrante >3 meses · múltiples (>10), especialmente inmunodeprimido · periungueal extensa · periocular · embarazada · alteración estética/funcional significativa · sospecha de cáncer *(4.15)*
  - Herpes simple: >6 reactivaciones/año *(4.4)*
- **Capa 2 → P1/Urgencia:**
  - Varicela: compromiso extenso/severo · dificultad para alimentación · CEG · fiebre que no cede >3 días · inmunosuprimidos *(4.4)*
  - Herpes Zóster: dermátoma V1 / signo de Hutchinson (riesgo oftálmico) · facial/cuero cabelludo + otalgia/hipoacusia/parálisis facial/compromiso visual · necrótico · ≥2 dermátomas · inmunosuprimido · fiebre y CEG *(4.4)*
- *Inputs requeridos:* inmunosupresión (✓), fiebre (✓), **sitio especial** (V1, periocular, anogenital — pendiente), refractariedad (✓), extensión (pendiente)

### `inflammatory_dermatosis_other` — base **P3**
- **Capa 1 → P2:**
  - Rosácea: severa · fimatosa/granulomatosa · falla ≥6 meses · compromiso ocular severo (→Oftalmología) · duda dx con sospecha de mesenquimopatía (lupus, dermatomiositis, sarcoidosis) *(4.1)*
  - Acné: severo / nódulo-quístico / conglobata / fulminans · **deja cicatrices** · falla 3–6 meses · intolerancia a tto · empeoramiento pese a tto *(4.14)*
  - Escabiosis: falla a tto (persistencia 1 mes post-tto) · formas especiales (sarna noruega) *(4.9)*
  - Pediculosis: falla a tto (persistencia 1 mes) *(4.10)*
- *Lateral:* acné + hiperandrogenismo/SOP → Ginecología/Endocrino
- *Inputs requeridos:* refractariedad (✓), grado de severidad (pendiente), cicatriz (✓), nódulo (✓), sitio ocular (pendiente)

### `pigmentary_disorder` — base **P3**
- **Capa 1 → P2:** vitíligo extenso o progresivo (derivación prioritaria) · halo nevo · recién nacido/lactante con nevo despigmentado *(4.7)*
- **NO DERIVAR:** vitíligo estable (>2 años sin cambios), sin deseo de tto y sin historia personal/familiar de melanoma *(4.7)*
- *Inputs requeridos:* extensión/progresión (pendiente), estabilidad temporal (pendiente)

### `cutaneous_tumor_suspected` — base **P2**
- **Capa 1 → P2:** ABCDE (asimetría, bordes irregulares, >3 colores, diámetro >6 mm, evolución) · ulcerado o crecimiento rápido · sospecha de melanoma/no melanoma · familiar 1er grado de melanoma o antecedente personal · >100 nevos · NMC gigante (>20 cm)/múltiples/satelitosis *(4.2)*
- **Capa 2 → Urgencia:** quiste sobreinfectado con fluctuación, eritema y dolor → incisión y drenaje *(4.2)*
- *Inputs requeridos:* signo ABCDE (✓), úlcera (✓), crecimiento rápido (pendiente), antecedente familiar (pendiente), conteo de nevos (pendiente)

### `benign_cutaneous_tumor` — base **P3**
- **Capa 1 → P2:** gran tamaño (>3 cm) · ubicación compleja o compromiso funcional (párpados, pabellón auricular, genital) *(4.2)*
- **NO DERIVAR:** queratosis seborreica, acrocordón/fibroma blando, nevo sin características de malignidad, lipoma <3 cm *(4.2)*
- *Inputs requeridos:* tamaño (pendiente), sitio especial (pendiente)

---

## Síndromes NO cubiertos por este protocolo (requieren otra fuente)

Este es el *protocolo general* ambulatorio del SSMSO; no cubre los síndromes más
agudos/de especialidad. Para estos hay que citar otra fuente (guías internacionales,
protocolos GES, o las propias safety rules ya existentes):

- `bacterial_skin_infection` (celulitis, impétigo, absceso)
- `drug_reaction` (incluye SJS/NET, DRESS)
- `urticarial_dermatosis`
- `vesiculobullous_disease`
- `vasculitic_purpuric_disease`
- `connective_tissue_disease`

> Nota: varios de estos ya tienen banderas rojas en `safety_modifiers.js` (Capa 2);
> lo que falta es su urgencia basal (Capa 0) y respaldo citable.

---

## Inputs de formulario que la tabla requiere (alimenta METHODS deuda 6 / paso 3b)

| Input | Estado | Lo usan |
| :--- | :--- | :--- |
| Refractariedad (tto previo/respuesta/tiempo) | ✅ hecho (PR #20) | casi todos los síndromes |
| **% superficie corporal (BSA)** | ⏳ pendiente | psoriasis (>7%), atópica (>10%), varicela, micosis |
| **Sitio especial** (ocular/periocular, V1, anogenital, palmoplantar, párpado, genital) | ⏳ pendiente (topografía parcial) | viral, eczema, tumor benigno, rosácea |
| Crecimiento rápido / cambio en el tiempo | ⏳ pendiente | tumor sospechado |
| Tamaño de lesión (>3 cm) | ⏳ pendiente | tumor benigno |
| Conteo de lesiones/nevos (>10, >100) | ⏳ pendiente | verrugas, tumor |
| Grado de severidad / progresión | ⏳ pendiente | acné, vitíligo, eczema |
| inmunosupresión, fiebre, cicatriz, nódulo, ABCDE, úlcera | ✅ ya existen | varios |
