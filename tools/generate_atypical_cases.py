import csv
import random
import os

def generate_atypical_cases():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    
    # Definición de features (basado en feature_schema.json)
    fieldnames = [
        "edad", "fototipo", "papula", "placa", "vesicula", "pustula", "bula_ampolla", "escama", "ulcera", "purpura",
        "dermatomal", "intertriginoso", "flexural", "extensor", "generalizado", "localizado",
        "agudo", "subagudo", "cronico", "prurito", "dolor", "fiebre",
        "farmacos_recientes", "inmunosupresion", "diabetes", "hepatopatia", "atopia", "embarazo", "target"
    ]
    
    fototipos = ["I", "II", "III", "IV", "V", "VI"]
    atypical_cases = []

    def get_base_case(target):
        return {f: 0 for f in fieldnames if f != "target" and f != "fototipo" and f != "target"}.copy()

    # --- CATEGORÍA 1: ATYPICALS PSORIASIS vs ECZEMA (15 casos) ---
    for _ in range(8):
        # Psoriasis Inversa (Flexural, sin escama obvia)
        case = get_base_case("psoriasiform_dermatosis")
        case.update({"edad": random.randint(20, 70), "fototipo": random.choice(fototipos),
                     "placa": 1, "intertriginoso": 1, "cronico": 1, "prurito": 0, "target": "psoriasiform_dermatosis"})
        atypical_cases.append(case)
        
        # Eczema Extensor (Simula psoriasis)
        case = get_base_case("eczema_dermatitis")
        case.update({"edad": random.randint(5, 60), "fototipo": random.choice(fototipos),
                     "placa": 1, "escama": 1, "extensor": 1, "cronico": 1, "prurito": 1, "atopia": 1, "target": "eczema_dermatitis"})
        atypical_cases.append(case)

    # --- CATEGORÍA 2: BACTERIAL AFREBILE (15 casos) ---
    for _ in range(15):
        # Celulitis en Diabético sin Fiebre
        case = get_base_case("bacterial_skin_infection")
        case.update({"edad": random.randint(50, 85), "fototipo": random.choice(fototipos),
                     "placa": 1, "dolor": 1, "agudo": 1, "localizado": 1, "diabetes": 1, "fiebre": 0, "target": "bacterial_skin_infection"})
        atypical_cases.append(case)

    # --- CATEGORÍA 3: TUMORAL AGE-REVERSED (20 casos) ---
    for _ in range(10):
        # Melanoma o BCC en Jóvenes
        case = get_base_case("cutaneous_tumor_suspected")
        case.update({"edad": random.randint(22, 38), "fototipo": random.choice(fototipos),
                     "placa": 1, "ulcera": random.choice([0, 1]), "cronico": 1, "localizado": 1, "target": "cutaneous_tumor_suspected"})
        atypical_cases.append(case)
        
        # Queratosis Seborreica (Benigno) en Ancianos pero de evolución más rápida/irritada
        case = get_base_case("benign_cutaneous_tumor")
        case.update({"edad": random.randint(70, 95), "fototipo": random.choice(fototipos),
                     "placa": 1, "escama": 1, "subagudo": 1, "localizado": 1, "dolor": 1, "target": "benign_cutaneous_tumor"})
        atypical_cases.append(case)

    # --- CATEGORÍA 4: DRUG REACTION ATYPICAL (15 casos) ---
    for _ in range(15):
        # Drug reaction sin fármaco reciente obvio (memoria del sistema/latencia)
        case = get_base_case("drug_reaction")
        case.update({"edad": random.randint(20, 75), "fototipo": random.choice(fototipos),
                     "papula": 1, "generalizado": 1, "agudo": 1, "prurito": 1, "farmacos_recientes": 0, "target": "drug_reaction"})
        atypical_cases.append(case)

    # --- CATEGORÍA 5: VESICULOBULLOUS NON-ELDERLY (15 casos) ---
    for _ in range(15):
        # Penfigoide o Dermatitis Herpetiforme en Joven
        case = get_base_case("vesiculobullous_disease")
        case.update({"edad": random.randint(18, 45), "fototipo": random.choice(fototipos),
                     "bula_ampolla": 1, "prurito": 1, "subagudo": 1, "generalizado": 1, "inmunosupresion": 0, "target": "vesiculobullous_disease"})
        atypical_cases.append(case)

    # --- CATEGORÍA 6: VASCULITIS LEVE/NO DOLOROSA (10 casos) ---
    for _ in range(10):
        case = get_base_case("vasculitic_purpuric_disease")
        case.update({"edad": random.randint(10, 60), "fototipo": random.choice(fototipos),
                     "purpura": 1, "dolor": 0, "agudo": 1, "localizado": 1, "target": "vasculitic_purpuric_disease"})
        atypical_cases.append(case)

    # --- CATEGORÍA 7: INFLAMMATORY OTHER ATYPICAL (10 casos) ---
    for _ in range(10):
        case = get_base_case("inflammatory_dermatosis_other")
        case.update({"edad": random.randint(10, 80), "fototipo": random.choice(fototipos),
                     "papula": 1, "cronico": 1, "generalizado": 1, "target": "inflammatory_dermatosis_other"})
        atypical_cases.append(case)

    print(f"Generados {len(atypical_cases)} casos atípicos.")

    # Guardar / Append
    file_exists = os.path.isfile(data_path)
    with open(data_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for c in atypical_cases:
            # Asegurar fototipo
            if "fototipo" not in c: c["fototipo"] = "III"
            writer.writerow(c)
            
    print(f"Casos agregados exitosamente a {data_path}")

if __name__ == "__main__":
    generate_atypical_cases()
