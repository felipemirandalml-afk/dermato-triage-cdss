# Resumen de Conceptos No Resueltos (Encoder v1.1)

Este reporte identifica elementos que el motor reconoce (UI/Datasets) pero que no tienen un mapeo formal en la capa canónica.

## 1. UI (Formulario) - 46 items sin resolver
Estos campos en la web no se están traduciendo a conceptos canónicos (aunque se usen por su ID directo):
- `antecedente_atopia`
- `antecedente_autoinmune`
- `antecedente_eii`
- `antecedente_embarazo`
- `antecedente_hepatopatia`
- `antecedente_neoplasia`
- `antecedente_obesidad`
- `antecedente_quimico`
- `antecedente_trauma`
- `antecedente_viaje`
- `lesion_ampolla`
- `lesion_bula`
- `patron_acral`
- `patron_dermatomal`
- `patron_extensor`
... (ver JSON)

## 2. SkinCon - 16 columnas sin resolver
Características de SkinCon que el sistema ignora actualmente:
- `Acuminate`
- `Dome-shaped`
- `Exudate`
- `Flat topped`
- `Friable`
- `Gray`
- `Induration`
- `Pedunculated`
- `Pigmented`
- `Poikiloderma`
- `Purple`
- `Salmon`
- `Translucent`
- `Warty/Papillomatous`
- `Xerosis`

## 3. Huérfanos Internos - 62 features
Features en `constants.js` que no están documentadas en el mapa canónico:
- `agudo`
- `antecedente_autoinmune`
- `antecedente_eii`
- `antecedente_neoplasia`
- `antecedente_obesidad`
- `antecedente_quimico`
- `antecedente_trauma`
- `antecedente_viaje`
- `atopia`
- `cronico`
- `dermatomal`
- `diabetes`
- `dolor`
- `embarazo`
- `extensor`
