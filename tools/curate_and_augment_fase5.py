import json
import pandas as pd
import numpy as np
import random
import os

def run():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    map_path = os.path.join(base_dir, "engine", "syndrome_to_ontology_map.js")
    semiology_path = os.path.join(base_dir, "engine", "semiology_profiles.json")
    schema_path = os.path.join(base_dir, "engine", "feature_schema.json")
    train_csv_path = os.path.join(base_dir, "data", "training_cases.csv")
    aug_csv_path = os.path.join(base_dir, "data", "training_cases_v2.csv")
    explainability_path = os.path.join(base_dir, "data", "feature_weights_explainability.json")

    # 1. Cargar el mapa y perfiles
    with open(map_path, 'r', encoding='utf-8') as f:
        content = f.read()
    json_str = content.split("export const SYNDROME_TO_ONTOLOGY_MAP = ")[1].split("};")[0] + "}"
    mapping = json.loads(json_str)

    with open(semiology_path, 'r', encoding='utf-8') as f:
        semiology = json.load(f)

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    expected_features = list(schema.keys())

    # 2. Construir perfiles sindrómicos agregados
    syndromic_profiles = {}
    for syndrome, info in mapping.items():
        feats_freq = {}
        differentials = info.get("differentials", [])
        count = 0
        for diff in differentials:
            diff_lower = diff.lower()
            if diff_lower in semiology:
                count += 1
                for k, v in semiology[diff_lower].items():
                    feats_freq[k] = feats_freq.get(k, 0) + v
        if count > 0:
            for k in feats_freq:
                feats_freq[k] /= count
        syndromic_profiles[syndrome] = feats_freq

    # 3. Motor de Pesos (Fase 6.2C)
    NEW_FEATURES = ["prodromo_catarral", "despegamiento_epidermico", "borde_activo", "costra_mielicerica", "purpura_palpable", "engrosamiento_ungueal"]
    PRIORS = {"prodromo_catarral": 0.7, "despegamiento_epidermico": 0.85, "borde_activo": 0.75, "costra_mielicerica": 0.75, "purpura_palpable": 0.8, "engrosamiento_ungueal": 0.7}
    TARGETS = {"prodromo_catarral": ["viral_skin_infection"], "despegamiento_epidermico": ["drug_reaction", "vesiculobullous_disease"], "borde_activo": ["fungal_skin_infection"], "costra_mielicerica": ["bacterial_skin_infection"], "purpura_palpable": ["vasculitic_purpuric_disease"], "engrosamiento_ungueal": ["psoriasiform_dermatosis"]}
    PROXIES = {"prodromo_catarral": ["fiebre", "agudo"], "despegamiento_epidermico": ["bula_ampolla", "mucosas"], "borde_activo": ["anular"], "costra_mielicerica": ["costra"], "purpura_palpable": ["purpura"], "engrosamiento_ungueal": ["escama"]}

    alpha = 0.7
    explainability = {}
    calc_weights = {}

    for feat in NEW_FEATURES:
        explainability[feat] = {}
        for syndrome in syndromic_profiles:
            if syndrome not in TARGETS[feat]: continue
            p_cond = np.mean([syndromic_profiles[syndrome].get(px, 0) for px in PROXIES[feat]])
            others = [np.mean([syndromic_profiles[s].get(px, 0) for px in PROXIES[feat]]) for s in syndromic_profiles if s != syndrome]
            p_others = np.mean(others) if others else 0
            score_data = p_cond / (p_others + 1e-6)
            score_data_norm = score_data / (score_data + 1.0)
            weight = alpha * score_data_norm + (1 - alpha) * PRIORS[feat]
            weight = min(max(weight, 0.3), 0.8)
            calc_weights[(syndrome, feat)] = weight
            explainability[feat][syndrome] = {"weight": round(weight, 3), "data_score": round(score_data_norm, 3), "clinical_prior": PRIORS[feat]}

    with open(explainability_path, 'w', encoding='utf-8') as f:
        json.dump(explainability, f, indent=2, ensure_ascii=False)

    # 4. Lore Base (Fase 6.1) + Inyección Dinámica
    SYNDROME_LORE = {
        "eczema_dermatitis": {"prurito": 0.85, "cronico": 0.6, "simetrico": 0.65, "eritema": 0.85},
        "psoriasiform_dermatosis": {"cronico": 0.8, "escama": 0.85, "placa": 0.85, "simetrico": 0.75, "seborreica": 0.4},
        "bacterial_skin_infection": {"agudo": 0.85, "dolor": 0.8, "fiebre": 0.7, "eritema": 0.85},
        "viral_skin_infection": {"agudo": 0.85, "fiebre": 0.75, "eritema": 0.8, "vesicula": 0.8},
        "fungal_skin_infection": {"prurito": 0.8, "subagudo": 0.7, "escama": 0.85, "anular": 0.5},
        "drug_reaction": {"agudo": 0.85, "fiebre": 0.8, "generalizado": 0.85, "farmacos_recientes": 0.85},
        "urticarial_dermatosis": {"agudo": 0.85, "prurito": 0.85, "habon": 0.85},
        "vesiculobullous_disease": {"bula_ampolla": 0.85, "mucosas": 0.6},
        "cutaneous_tumor_suspected": {"cronico": 0.85, "localizado": 0.85, "fotoexpuesto": 0.7},
        "benign_cutaneous_tumor": {"cronico": 0.85, "localizado": 0.9, "nodulo": 0.7},
        "vasculitic_purpuric_disease": {"agudo": 0.85, "purpura": 0.85, "dolor": 0.7},
        "inflammatory_dermatosis_other": {"subagudo": 0.7, "seborreica": 0.6, "escama_untuosa": 0.5, "comedon": 0.4}
    }

    for (s, f), w in calc_weights.items():
        if s in SYNDROME_LORE: SYNDROME_LORE[s][f] = w
        else: SYNDROME_LORE[s] = {f: w}

    # 5. Generación
    df_base = pd.read_csv(train_csv_path)
    synth_rows = []
    random.seed(42)
    for syndrome in mapping:
        profile = syndromic_profiles.get(syndrome, {})
        lore = SYNDROME_LORE.get(syndrome, {})
        for _ in range(35):
            row = {f: 0 for f in expected_features + ["target", "fototipo"]}
            row["target"] = syndrome
            row["edad"] = random.randint(18, 75)
            row["fototipo"] = random.choice(["I", "II", "III", "IV", "V", "VI"])
            for f in [f for f in profile if f in expected_features]:
                if random.random() < min(profile[f] * 1.5, 0.85): row[f] = 1
            for f, p in lore.items():
                if f in expected_features and random.random() < p: row[f] = 1
            if not any([row.get("agudo"), row.get("subagudo"), row.get("cronico")]):
                if random.random() > 0.5: row["agudo"] = 1
                else: row["cronico"] = 1
            if not any([row.get("localizado"), row.get("generalizado")]):
                row["localizado"] = 1 if random.random() > 0.4 else 0
            synth_rows.append(row)

    df_synth = pd.DataFrame(synth_rows)
    df_combined = pd.concat([df_base, df_synth], ignore_index=True).fillna(0)
    df_combined.to_csv(aug_csv_path, index=False)

    print("\n==================================================")
    print("AUDITORÍA DE DATASET - FASE 6.2C")
    print("==================================================")
    audit = df_combined[NEW_FEATURES].mean()
    for f in NEW_FEATURES:
        print(f"Feature: {f:<25} | Densidad: {audit[f]:.4f} | Status: {'✅ OK' if 0.05 <= audit[f] <= 0.5 else '⚠️ ATENCIÓN'}")
    print(f"\nNaNs: {df_combined.isna().sum().sum()} | Dimensiones: {df_combined.shape}")

if __name__ == "__main__":
    run()
