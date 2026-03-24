import json
import pandas as pd
import numpy as np
import random
import os
import re

def run():
    # Rutas
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    map_path = os.path.join(base_dir, "engine", "syndrome_to_ontology_map.js")
    semiology_path = os.path.join(base_dir, "engine", "semiology_profiles.json")
    schema_path = os.path.join(base_dir, "engine", "feature_schema.json")
    train_csv_path = os.path.join(base_dir, "data", "training_cases.csv")
    aug_csv_path = os.path.join(base_dir, "data", "training_cases_v2.csv") # New dataset
    output_profiles_path = os.path.join(base_dir, "engine", "syndromic_semiology_profiles.json")

    # 1. Cargar el mapa (Parseo manual del JS limitándolo al JSON)
    with open(map_path, 'r', encoding='utf-8') as f:
        content = f.read()
    json_str = content.split("export const SYNDROME_TO_ONTOLOGY_MAP = ")[1].split("};")[0] + "}"
    mapping = json.loads(json_str)

    # 2. Cargar perfiles de Derm1M
    with open(semiology_path, 'r', encoding='utf-8') as f:
        semiology = json.load(f)

    # 3. Construir perfiles sindrómicos agregados
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

    with open(output_profiles_path, 'w', encoding='utf-8') as f:
        json.dump(syndromic_profiles, f, ensure_ascii=False, indent=2)
    print(f"✅ Se han derivado los perfiles sindrómicos ricos en {output_profiles_path}")

    # 4. Generador de Casos Sintéticos Controlados por Conocimiento
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    expected_features = list(schema.keys())

    # Leer dataset base para no perder columnas
    df_base = pd.read_csv(train_csv_path)
    all_cols = df_base.columns.tolist()
    
    synthetic_rows = []
    # Parámetros para la generación "clínicamente justificada"
    CASES_PER_SYNDROME = 35  # Suavizar clases poco representadas
    random.seed(42)

    SYNDROME_LORE = {
        "eczema_dermatitis": {"prurito": 0.9, "cronico": 0.6, "subagudo": 0.4, "eritema": 0.9, "escama": 0.75, "localizado": 0.7, "placa": 0.5},
        "psoriasiform_dermatosis": {"cronico": 0.8, "escama": 0.95, "placa": 0.9, "eritema": 0.8, "localizado": 0.6},
        "bacterial_skin_infection": {"agudo": 0.95, "dolor": 0.9, "fiebre": 0.8, "localizado": 0.8, "eritema": 0.9, "pustula": 0.5, "costra": 0.6},
        "viral_skin_infection": {"agudo": 0.95, "fiebre": 0.85, "dolor": 0.4, "generalizado": 0.8, "eritema": 0.9, "papula": 0.8, "dermatomal": 0.4, "vesicula": 0.85},
        "fungal_skin_infection": {"prurito": 0.85, "subagudo": 0.8, "cronico": 0.5, "escama": 0.9, "placa": 0.8, "eritema": 0.8, "topo_flexural_pliegues": 0.5},
        "drug_reaction": {"agudo": 0.95, "prurito": 0.8, "fiebre": 0.7, "generalizado": 0.9, "farmacos_recientes": 0.95, "eritema": 0.9, "macula": 0.85, "papula": 0.8, "bula_ampolla": 0.4},
        "urticarial_dermatosis": {"agudo": 0.95, "prurito": 0.95, "habon": 0.95, "generalizado": 0.8},
        "vesiculobullous_disease": {"agudo": 0.6, "cronico": 0.4, "bula_ampolla": 0.95, "erosio": 0.7},
        "cutaneous_tumor_suspected": {"cronico": 0.95, "induracion": 0.8, "localizado": 0.95, "ulcera": 0.6, "nodulo": 0.7, "costra": 0.4, "fotoexpuesto": 0.6},
        "benign_cutaneous_tumor": {"cronico": 0.95, "localizado": 1.0, "nodulo": 0.8, "papula": 0.8},
        "vasculitic_purpuric_disease": {"agudo": 0.9, "purpura": 0.95, "dolor": 0.8, "fiebre": 0.7},
        "inflammatory_dermatosis_other": {"subagudo": 0.8, "cronico": 0.6, "prurito": 0.6, "papula": 0.7, "eritema": 0.7, "escama": 0.6}
    }

    for syndrome in mapping.keys():
        profile = syndromic_profiles.get(syndrome, {})
        lore = SYNDROME_LORE.get(syndrome, {})
        for _ in range(CASES_PER_SYNDROME):
            row = {}
            for col in all_cols:
                row[col] = 0

            # Set basic
            row["target"] = syndrome
            row["edad"] = random.randint(18, 75)
            row["fototipo"] = random.choice(["I", "II", "III", "IV", "V", "VI"])
            
            # Sampling features conditionally based on the new derm1m probabilities!
            valid_feats_in_schema = [f for f in profile.keys() if f in expected_features]
            
            for feat in valid_feats_in_schema:
                prob = profile[feat]
                if random.random() < min(prob * 1.5, 0.95):
                    row[feat] = 1
            
            # 5. Inject domain expert synthetic priors (Lore)
            for feat, prob in lore.items():
                if feat in expected_features:
                    if random.random() < prob:
                        row[feat] = 1

            # Fallbacks temporales
            if row.get("agudo", 0) == 0 and row.get("cronico", 0) == 0 and row.get("subagudo", 0) == 0:
                row["agudo"] = 1 if random.random() > 0.5 else 0
                row["cronico"] = 1 if row["agudo"] == 0 else 0
            
            if row.get("localizado", 0) == 0 and row.get("generalizado", 0) == 0:
                row["localizado"] = 1 if random.random() > 0.4 else 0

            synthetic_rows.append(row)

    df_synth = pd.DataFrame(synthetic_rows)
    df_combined = pd.concat([df_base, df_synth], ignore_index=True)
    
    # Save the augmented dataset
    df_combined.to_csv(aug_csv_path, index=False)
    print(f"✅ Se generaron {len(df_synth)} casos aumentados limpios desde Derm1M.")
    print(f"✅ Nuevo dataset guardado en {aug_csv_path} (Total casos: {len(df_combined)})")

if __name__ == "__main__":
    run()
