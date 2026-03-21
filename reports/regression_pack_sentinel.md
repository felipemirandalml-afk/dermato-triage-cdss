# Paquete de Regresión Centinela: DermatoTriage CDSS

## 1. Objetivo del Regression Pack
Este conjunto de datos (`tests/regression_pack_sentinel.json`) ha sido diseñado para proteger la "Inteligencia Cardinal" del sistema. Los casos centinela representan diagnósticos donde el motor heurístico tiene preeminencia sobre el estadístico o donde el fallo implicaría un riesgo clínico inaceptable.

## 2. Inventario de Casos Críticos

| ID Sentinela | Diagnóstico | Signo "Ancla" / Regla Crítica | Razón Médica |
| :--- | :--- | :--- | :--- |
| SENTINEL-01 | Herpes Zoster | Dermatomía + Dolor + Vesícula | Patrón neural agudo / Urgente en cara. |
| SENTINEL-02 | Molusco | Umbilicación central | Hallazgo patognomónico viral. |
| SENTINEL-03 | Tiña Corporal | Patrón anular centrofugo | Diferenciación de psoriasis/eczema. |
| SENTINEL-04 | Urticaria | Habón (Roncha) | Fugacidad y tipo de lesión elemental. |
| SENTINEL-05 | Sífilis Secundaria| Patrón acral + Generalizado | Salud Pública / Gran imitador. |
| SENTINEL-06 | Escabiosis | Surco acarino | Hallazgo patognomónico de infestación. |
| SENTINEL-07 | Queratoacantoma | Forma cupuliforme | Sospecha de tumor de crecimiento rápido. |
| SENTINEL-08 | Pénfigo Vulgar | Nikolsky (+) / Mucosas | Riesgo de descompensación ampollosa. |
| SENTINEL-09 | Melanoma | ABCDE / Crónico | Neoplasia maligna de alta mortalidad. |
| SENTINEL-10 | Celulitis (P1) | Fiebre + Dolor + Cara | Seguridad P1 (Erisipela Facial). |

## 3. Protocolo de Ejecución
Este paquete DEBE ejecutarse:
1. Después de modificar `cardinal_feature_rules.js`.
2. Después de cambiar el `concept_canonical_map.json`.
3. Antes de realizar el build de producción.

## 4. Criterios de Vigilancia Especial
- **Zoster prodrómico**: Vigilar que `dermatomal + dolor` active la sospecha incluso sin vesículas (Implementado en 7B).
- **Syphilis vs PR**: Vigilar que la afectación acral siempre priorice la sospecha de Lúes II.
- **Scabies**: Vigilar que el prurito nocturno y simétrico sea detectado.
