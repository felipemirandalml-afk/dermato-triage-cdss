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
- `drug_reaction` (incluye SJS/NET, DRESS) — ✅ **completado abajo** (guías nac/internac)
- `urticarial_dermatosis` — ✅ **completado abajo**
- `vesiculobullous_disease` — ✅ **completado abajo** (base P2, no P3)
- `vasculitic_purpuric_disease` — ✅ **completado abajo** (base P2)
- `connective_tissue_disease`
- `bacterial_skin_infection`

> Nota: varios de estos ya tienen banderas rojas en `safety_modifiers.js` (Capa 2);
> lo que falta es su urgencia basal (Capa 0) y respaldo citable. Se van completando
> con fuentes de guías nacionales/internacionales (vía NotebookLM) en la sección siguiente.

---

## Tabla de triage — síndromes agudos (fuentes: guías nac/internacionales)

> Estos síndromes no están en el protocolo general ambulatorio SSMSO. Sus criterios
> provienen de guías y manuales de dermatología, citados por entrada.

### `drug_reaction` (farmacodermias / RAMM) — base **P3** (formas leves), escalada rápida
- **Capa 0:** formas leves (erupción fija no complicada, exantema morbiliforme leve sin
  síntomas sistémicos) → manejo en APS (P3).
- **Capa 1 → P2 (derivar a dermatología/teledermatología):**
  - duda diagnóstica (no se asegura fármaco causal ni tipo de reacción)
  - refractariedad: no cede tras suspender el fármaco + tratamiento basal
  - extensión BSA significativa (>10%, extrapolado de psoriasis)
  - sospecha de DRESS (tríada exantema + compromiso visceral + alteración de laboratorio)
  - AGEP con duda → interconsulta urgente
  - laboratorio: eosinofilia >1.000/mm³, linfocitos atípicos, pruebas hepáticas alteradas
- **Capa 2 → P1 / Urgencia (riesgo vital):**
  - cutáneos: signo de Nikolsky positivo · dolor cutáneo intenso/desproporcionado ·
    eritema confluente de aparición rápida · ampollas o piel denudada extensa ·
    compromiso mucoso (boca/ojos/genitales/ano) · necrosis o púrpura palpable ·
    edema facial importante o compromiso centrofacial
  - sistémicos: fiebre alta (>40°C) o persistente · CEG/obnubilación/sopor ·
    taquipnea/sibilancias/dificultad respiratoria (angioedema de vía aérea/anafilaxia) ·
    hipotensión o taquicardia (>120 lpm) · adenopatías generalizadas grandes (>2 cm)
- **Mapeo a inputs:** ya existen — Nikolsky (`ampolla_nikolsky`/`despegamiento_epidermico`),
  dolor (`dolor`), ampollas (`bula_ampolla`), mucosas (`mucosas`), necrosis
  (`necrosis_isquemia`), púrpura palpable (`purpura_palpable`), hipotensión
  (`signo_hipotension`), conciencia (`compromiso_conciencia`), fiebre (`fiebre`),
  BSA (`severity.bsaPercent`), refractariedad (`treatment`). **Faltan:** dificultad
  respiratoria/angioedema, adenopatías, y los criterios de laboratorio/visceral (fuera
  del alcance de un motor morfológico — quedan como límite declarado).
- **Fuentes:** Manual de Dermatología U. de Chile (págs. 24-25, 27-31) · Manual de
  Dermatología para Médicos Generales, 3.ª ed. 2025 (págs. 157-159, 164) · Fitzpatrick,
  Atlas de Dermatología Clínica (págs. 137-140, 488-491) · Patología Dermatológica,
  Aguayo et al. (págs. 1076, 1089).

### `urticarial_dermatosis` (urticaria / angioedema) — base **P3** (urticaria aguda)
- **Capa 0:** urticaria aguda (<6 semanas) → manejo en APS (P3) con antihistamínicos H1;
  no se justifica laboratorio extenso en aguda no complicada.
- **Capa 1 → P2 (derivar a especialista):**
  - cronicidad: urticaria crónica (>6 semanas)
  - refractariedad: aguda que no responde a antihistamínicos
  - recurrencia: múltiples episodios de urticaria aguda o angioedema recurrente
  - sospecha de vasculitis urticarial: habón fijo en el mismo lugar **>24 h** → biopsia
  - sospecha de patología autoinmune / mesenquimopatía subyacente
- **Capa 2 → P1 / Urgencia (riesgo vital, adrenalina + alta complejidad):**
  - vía aérea: dificultad respiratoria, disnea, estridor laríngeo, disfonía (edema laríngeo)
  - angioedema grave: aumento de volumen en labios, lengua u orofaringe
  - anafilaxia/shock: hipotensión, taquicardia, compromiso de conciencia, ≥2 sistemas
  - pródromos de gravedad: prurito intenso en palmas, plantas o nuca
- **Mapeo a inputs:** ya existen — cronicidad (`cronico`/timing), refractariedad
  (`treatment`), hipotensión (`signo_hipotension`), conciencia (`compromiso_conciencia`),
  prurito (`prurito`). **Faltan:** dificultad respiratoria/angioedema (vía aérea),
  recurrencia, habón fijo >24 h (vs `lesion_evanescente`), taquicardia/pulso.
- **Fuentes:** Manual de Dermatología U. de Chile (págs. 29, 31-35) · Manual de
  Dermatología para Médicos Generales, 3.ª ed. 2025 (págs. 479, 482-484, 502) ·
  Patología Dermatológica, Aguayo et al. (págs. 1076, 1093-1094) · Fitzpatrick,
  Atlas de Dermatología Clínica (págs. 312, 497-498) · Protocolo Teleinterconsultas
  HD 2023 (pág. 4, criterios de exclusión).

### `vesiculobullous_disease` (ampollares autoinmunes: pénfigo, penfigoide) — base **P2** (no se maneja en APS)
> ⚠️ A diferencia de los crónicos, su urgencia basal NO es P3: **no debe manejarse
> ambulatoriamente**. Toda sospecha se deriva; urgente apenas se sospeche, por
> potencial gravedad/letalidad (pénfigo vulgar).
- **Capa 0:** sospecha de EAA → derivación a dermatología (P2). El estándar de oro es
  biopsia + inmunofluorescencia directa (IFD), no disponible en APS.
- **Capa 1 → P2 (derivar a especialista):**
  - sospecha clínica: ampollas o erosiones mucocutáneas sugerentes de EAA
  - necesidad de estudio confirmatorio (biopsia perilesional, IFD, ELISA de autoanticuerpos)
  - lesiones crónicas / curso recidivante
  - complejidad terapéutica (inmunosupresión sistémica prolongada)
- **Capa 2 → P1 / Urgencia (hospitalización, a veces UCI; manejo tipo gran quemado):**
  - signo de Nikolsky positivo (acantólisis activa)
  - CEG y fiebre (toxicidad sistémica / sobreinfección / sepsis)
  - extensión denudada o ampollosa extensa de la superficie corporal
  - compromiso mucoso severo que impide la deglución/alimentación
  - inestabilidad hemodinámica (pérdida masiva de líquidos/electrolitos/proteínas)
  - eritrodermia (>80-90% del tegumento; p. ej. pénfigo foliáceo)
- **Mapeo a inputs:** ya existen — ampollas (`bula_ampolla`), erosión (`erosion`),
  mucosas (`mucosas`), Nikolsky (`ampolla_nikolsky`/`despegamiento_epidermico`), fiebre
  (`fiebre`), extensión (`severity.bsaPercent`), hipotensión (`signo_hipotension`),
  eritrodermia (`generalizado`+`eritema`), cronicidad (`cronico`). Estudio confirmatorio
  (biopsia/IFD) no es un input clínico (es motivo de derivación, no signo).
- **Fuentes:** Manual de Dermatología U. de Chile (págs. 41, 48) · Manual de Dermatología
  para Médicos Generales, 3.ª ed. 2025 (págs. 459-461, 464, 468, 472, 475) · Fitzpatrick,
  Atlas de Dermatología Clínica (págs. 137, 153, 160, 163, 259, 261, 268) · Protocolo
  diagnóstico de dermatosis ampollosas, Aramberri et al. (págs. 130, 133, 148-149).

### `vasculitic_purpuric_disease` (vasculitis / púrpura cutánea) — base **P2** (derivar con relativa urgencia)
- **Capa 0:** APS realiza la sospecha clínica inicial y el laboratorio básico de compromiso
  visceral (hemograma, orina completa con hematuria, creatininemia, pruebas hepáticas,
  sangre oculta en deposiciones, complemento C3/C4). La mayoría → especialista (P2).
- **Capa 1 → P2 (derivar a especialista):**
  - sospecha clínica de vasculitis cutánea → derivar con relativa urgencia
  - necesidad de estudio histopatológico (el general **no** practica la biopsia)
  - urticaria vasculítica: habón fijo en el mismo lugar **>24 h**
  - duda diagnóstica (no se asegura tipo de reacción ni causa)
- **Capa 2 → P1 / Urgencia (servicio de urgencias / hospitalización):**
  - púrpura palpable generalizada (signo cutáneo grave en paciente enfermo)
  - sintomatología sistémica aguda: fiebre alta, CEG, artralgias intensas, dolor abdominal
    cólico severo o hematuria macroscópica (compromiso renal/intestinal, p. ej. Henoch-Schönlein)
  - lesiones necróticas o ampollas hemorrágicas (escaras, úlceras profundas, vejigas hemáticas)
  - púrpura fulminante: necrosis purpúrica geográfica + fiebre + postración (sospecha CID/sepsis)
  - compromiso de conciencia/obnubilación (shock tóxico, o fascitis necrotizante que debuta
    con placas purpúricas y **dolor desproporcionado**)
- **Mapeo a inputs:** ya existen — púrpura palpable (`purpura_palpable`), fiebre (`fiebre`),
  necrosis (`necrosis_isquemia`), ampollas (`bula_ampolla`), dolor (`dolor`), conciencia
  (`compromiso_conciencia`), generalizado (`generalizado`). **Faltan / fuera de alcance:**
  síntomas extracutáneos (hematuria, dolor abdominal, artralgias) y laboratorio (complemento,
  función renal) — quedan como límite declarado; habón fijo >24 h (compartido con urticaria).
- **Fuentes:** Manual de Dermatología U. de Chile (págs. 14, 145, 159) · Manual de
  Dermatología para Médicos Generales, 3.ª ed. 2025 (págs. 502, 516, 518-521, 530) ·
  Fitzpatrick, Atlas de Dermatología Clínica (págs. 203, 254, 310, 357).

---

## Inputs de formulario que la tabla requiere (alimenta METHODS deuda 6 / paso 3b)

| Input | Estado | Lo usan |
| :--- | :--- | :--- |
| Refractariedad (tto previo/respuesta/tiempo) | ✅ hecho (PR #20) | casi todos los síndromes |
| % superficie corporal (BSA) | ✅ hecho (PR #22) | psoriasis (>7%), atópica (>10%), varicela, micosis, drug_reaction |
| Sitio especial (periocular, anogenital, palmoplantar) | ✅ hecho (PR #23) | viral, eczema, tumor benigno, rosácea |
| Tamaño de lesión (>3 cm) | ✅ hecho (PR #23) | tumor benigno |
| Conteo de lesiones/nevos (>10, >100) | ✅ hecho (PR #23) | verrugas, tumor |
| Crecimiento rápido / cambio en el tiempo | ⏳ pendiente | tumor sospechado |
| Grado de severidad / progresión | ⏳ pendiente | acné, vitíligo, eczema |
| Dificultad respiratoria / angioedema (vía aérea) | ⏳ pendiente | drug_reaction, urticaria |
| Adenopatías | ⏳ pendiente | drug_reaction (DRESS) |
| Recurrencia (múltiples episodios) | ⏳ pendiente | urticaria |
| Habón fijo >24 h / taquicardia | ⏳ pendiente | urticaria |
| inmunosupresión, fiebre, cicatriz, nódulo, ABCDE, úlcera, mucosas, Nikolsky, púrpura, necrosis, hipotensión, conciencia | ✅ ya existen | varios |
