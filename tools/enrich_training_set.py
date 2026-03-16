import pandas as pd
import random
import os
import json

def enrich_training_set():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    schema_path = os.path.join(base_dir, "engine", "feature_schema.json")

    # 1. Cargar esquema para asegurar consistencia
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    
    # 2. Cargar dataset existente
    if not os.path.exists(data_path):
        print(f"Error: No se encontró {data_path}")
        return
    
    df = pd.read_csv(data_path)
    print(f"Dataset original: {df.shape[0]} casos, {df.shape[1]} columnas.")

    # 3. Asegurar que las nuevas columnas existan
    new_cols = [
        "interaccion_fiebre_purpura",
        "interaccion_fiebre_ampolla",
        "interaccion_inmuno_agudo",
        "interaccion_dolor_agudo"
    ]
    
    for col in new_cols:
        if col not in df.columns:
            df[col] = 0
            print(f"Agregando columna: {col}")

    # 4. Generación de 100 casos estratégicos
    new_cases = []
    
    def chance(p): return 1 if random.random() < p else 0

    # Categoría A: Fiebre + Púrpura (Emergencias Vasculíticas) - 25 casos
    for _ in range(25):
        case = {col: 0 for col in df.columns}
        case.update({
            "target": "vasculitic_purpuric_disease",
            "edad": random.randint(5, 80),
            "fototipo": random.randint(1, 6),
            "fiebre": 1,
            "purpura": 1,
            "agudo": 1,
            "dolor": chance(0.7),
            "interaccion_fiebre_purpura": 1,
            "localizado": chance(0.4),
            "generalizado": chance(0.6)
        })
        new_cases.append(case)

    # Categoría B: Fiebre + Ampolla (SJS/NET o Autoinmune Grave) - 25 casos
    for _ in range(25):
        is_drug = random.random() > 0.4
        case = {col: 0 for col in df.columns}
        case.update({
            "target": "drug_reaction" if is_drug else "vesiculobullous_disease",
            "edad": random.randint(20, 90),
            "fototipo": random.randint(1, 6),
            "fiebre": 1,
            "bula_ampolla": 1,
            "agudo": 1 if is_drug else chance(0.6),
            "farmacos_recientes": 1 if is_drug else chance(0.2),
            "interaccion_fiebre_ampolla": 1,
            "generalizado": 1
        })
        new_cases.append(case)

    # Categoría C: Inmunosupresión + Agudo (Infecciones Oportunistas) - 25 casos
    for _ in range(25):
        case = {col: 0 for col in df.columns}
        case.update({
            "target": random.choice(["bacterial_skin_infection", "viral_skin_infection", "fungal_skin_infection"]),
            "edad": random.randint(18, 85),
            "fototipo": random.randint(1, 6),
            "inmunosupresion": 1,
            "agudo": 1,
            "fiebre": chance(0.5),
            "eritema": 1,
            "interaccion_inmuno_agudo": 1,
            "dolor": chance(0.6)
        })
        new_cases.append(case)

    # Categoría D: Dolor + Agudo (Infección Profunda / Necrosis) - 25 casos
    for _ in range(25):
        case = {col: 0 for col in df.columns}
        case.update({
            "target": "bacterial_skin_infection",
            "edad": random.randint(40, 95),
            "fototipo": random.randint(1, 6),
            "dolor": 1,
            "agudo": 1,
            "eritema": 1,
            "induracion": 1,
            "fiebre": chance(0.8),
            "interaccion_dolor_agudo": 1,
            "diabetes": chance(0.4)
        })
        new_cases.append(case)

    # 5. Concatenar y guardar
    df_new = pd.DataFrame(new_cases)
    # Asegurar orden de columnas
    df_new = df_new[df.columns]
    
    df_final = pd.concat([df, df_new], ignore_index=True)
    
    # Backup preventivo
    df.to_csv(data_path + ".bak", index=False)
    
    # Guardar final
    df_final.to_csv(data_path, index=False)
    
    print(f"Enriquecimiento completado. Total casos: {df_final.shape[0]}")
    print(f"Columnas finales: {df_final.columns.tolist()}")

if __name__ == "__main__":
    enrich_training_set()
