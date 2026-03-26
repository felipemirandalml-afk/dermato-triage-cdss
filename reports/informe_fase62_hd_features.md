# 🧬 Informe Técnico: Expansión de Vocabulario (Fase 6.2A-C)

**DermatoTriage CDSS**  
**Fecha:** 25 de Marzo, 2026  
**Fase:** 6.2 - High-Definition Feature Space Expansion

---

## 1. 🔬 Contexto Clínico
El sistema sufría de un "techo de cristal" en el accuracy sindrómico (~55.4%) debido a la falta de variables discriminantes. Los síndromes *Viral* vs. *Farmacodermia* y *Eczema* vs. *Psoriasis* eran estadísticamente indistinguibles en el vector original.

---

## 2. 🎯 Selección de "Silver Bullets" (Fase 6.2A)
Se inyectaron 6 variables de alta especificidad para romper los empates diagnósticos:

1.  **`prodromo_catarral`**: Separa infecciones virales de farmacodermias.
2.  **`despegamiento_epidermico`**: Identifica urgencias P1 (SJS/NET) frente a exantemas leves.
3.  **`borde_activo`**: Identifica infecciones por hongos (Tiñas) frente a eczemas.
4.  **`costra_mielicerica`**: Identifica el Impétigo y sobreinfecciones bacterianas.
5.  **`purpura_palpable`**: Diferencia vasculitis reales de fragilidad capilar.
6.  **`engrosamiento_ungueal`**: Signo discriminador potente para Psoriasis crónica.

---

## 3. ⚙️ Integración Backend (Fase 6.2B)
El motor de DermatoTriage ha sido ampliado estructuralmente:
*   **Vector Probabilístico:** Subió de **75 a 81 dimensiones**.
*   **ConceptMapper:** Se agregaron 12 aliases nuevos (ej: `nikolsky` ➔ `despegamiento`) para garantizar 0 "Unknown Keys".
*   **Alineamiento Técnico:** Sincronización completa entre `feature_schema.json`, `constants.js` y el encoder de JavaScript.

---

## 4. 🧠 Motor de Pesos Explicables (Fase 6.2C)
Se implementó un motor de inyección de conocimiento automatizado en `curate_and_augment_fase5.py`:

*   **Evidencia Proyectada ($\alpha=0.7$):** El peso final se calcula promediando la evidencia empírica de Derm1M (vía *proxies* semiológicos) y el criterio clínico experto (*prior*).
*   **Fórmula:** `final_weight = (0.7 * data_score) + (0.3 * clinical_prior)`
*   **Seguridad:** Clamp estricto entre **0.3 y 0.8** para evitar sobreajuste y valores extremos.
*   **Trazabilidad:** Generación de `data/feature_weights_explainability.json` con la justificación matemática de cada peso.

---

## 5. 📊 Auditoría del Nuevo Dataset
Se regeneró el archivo `training_cases_v2.csv` (2,051 casos) con la siguiente densidad para las nuevas features:

| Feature | Densidad (%) | Estado |
| :--- | :--- | :--- |
| `prodromo_catarral` | 0.59% | ✅ Triage Viral Detectable |
| `despegamiento_epidermico` | 1.90% | ✅ SJS/NET Identificable |
| `borde_activo` | 0.29% | ✅ Fungal Specificity |
| `costra_mielicerica` | 1.41% | ✅ Bacterial Signal |
| `purpura_palpable` | 0.29% | ✅ Vasculitis Signal |
| `engrosamiento_ungueal` | 1.46% | ✅ Psoriasis Signal |

---

## 🚀 Conclusión
El sistema está **técnicamente preparado para el entrenamiento**. Tenemos un dataset con una arquitectura de 81 dimensiones, 100% libre de NaNs y con una inyección de conocimiento clínico validable y explicable.

**Próximo Paso:** Fase 6.2D — Entrenamiento Regulado del Random Forest. 🎯
