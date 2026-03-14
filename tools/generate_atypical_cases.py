import csv
import random
import os

"""
generate_atypical_cases.py - Clinical Data Augmentation v2.0
Refactorizado para implementar varianza biológica (ruido clínico) y balanceo de clases.
"""

def chance(prob):
    """Retorna 1 con una probabilidad dada, de lo contrario 0."""
    return 1 if random.random() < prob else 0

def generate_atypical_cases():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    
    # Definición de features EXACTO al training_cases.csv
    fieldnames = [
        "edad", "fototipo", "papula", "placa", "vesicula", "pustula", "bula_ampolla", "escama", "ulcera", "purpura",
        "dermatomal", "intertriginoso", "flexural", "extensor", "generalizado", "localizado",
        "agudo", "subagudo", "cronico", "prurito", "dolor", "fiebre",
        "farmacos_recientes", "inmunosupresion", "diabetes", "hepatopatia", "atopia", "embarazo",
        "eritema", "hiperpigmentacion", "hipopigmentacion", "costra", "erosion", "excoriacion",
        "liquenificacion", "nodulo", "quiste", "induracion", "telangiectasias", "atrofia",
        "habon", "comedon", "surco", "target"
    ]
    
    fototipos = ["I", "II", "III", "IV", "V", "VI"]
    atypical_cases = []

    def create_case(target, **overrides):
        case = {f: 0 for f in fieldnames if f not in ["target", "fototipo", "edad"]}
        case["target"] = target
        case["fototipo"] = random.choice(fototipos)
        case["edad"] = random.randint(1, 95)
        case.update(overrides)
        return case

    # --- CATEGORÍA 1: ATYPICAL PSORIASIS vs ECZEMA (30 casos) ---
    # Ruido: Psoriasis sin escama (inversa) o Eczema con escama gruesa.
    for _ in range(15):
        # Psoriasis Inversa / Flexural
        case = create_case("psoriasiform_dermatosis", 
            edad=random.randint(15, 80),
            placa=1, 
            intertriginoso=chance(0.9), 
            flexural=chance(0.7),
            escama=chance(0.2), # Inversa suele ser eritematosa brillante sin escama
            cronico=chance(0.8),
            prurito=chance(0.4))
        atypical_cases.append(case)
        
        # Eczema Nummular / Extensor
        case = create_case("eczema_dermatitis",
            edad=random.randint(5, 70),
            placa=1,
            escama=chance(0.6),
            extensor=chance(0.7), # Simula psoriasis
            prurito=chance(0.9),
            atopia=chance(0.5),
            cronico=chance(0.6))
        atypical_cases.append(case)

    # --- CATEGORÍA 2: BACTERIAL AFREBILE & ATYPICAL (30 casos) ---
    # Ruido: Celulitis en diabéticos/ancianos que no montan fiebre.
    for _ in range(30):
        case = create_case("bacterial_skin_infection",
            edad=random.randint(60, 90),
            placa=1,
            dolor=chance(0.85),
            agudo=1,
            localizado=1,
            diabetes=chance(0.6),
            fiebre=chance(0.3 if random.random() > 0.5 else 0.1)) # Muy baja fiebre en geriatría
        atypical_cases.append(case)

    # --- CATEGORÍA 3: TUMORAL (CRÍTICO) (80 casos) ---
    # Varianza: Melanomas en jóvenes, BCC en fototipos altos, ulceración variable.
    for _ in range(80):
        is_young = random.random() < 0.2
        case = create_case("cutaneous_tumor_suspected",
            edad=random.randint(20, 45) if is_young else random.randint(55, 95),
            fototipo=random.choice(fototipos) if is_young else random.choice(fototipos[:3]),
            placa=chance(0.9) if not chance(0.1) else 0, # A veces nódulo
            nodulo=chance(0.4),
            ulcera=chance(0.35), # No siempre ulcerado
            cronico=1,
            localizado=1,
            prurito=chance(0.2))
        atypical_cases.append(case)

    # --- CATEGORÍA 4: DRUG REACTION VARIANTS (40 casos) ---
    # Ruido: Latencia farmacológica o falta de antecedente claro.
    for _ in range(40):
        case = create_case("drug_reaction",
            edad=random.randint(18, 85),
            papula=chance(0.8),
            generalizado=chance(0.9),
            agudo=1,
            prurito=chance(0.7),
            farmacos_recientes=chance(0.7), # 30% no recuerda o es latencia larga
            eritema=chance(0.8)) # En lugar de mucosas (no presente en CSV schema por ahora)
        atypical_cases.append(case)

    # --- CATEGORÍA 5: VESICULOBULLOUS (CRÍTICO) (70 casos) ---
    # Varianza: Penfigoide localizado o en pacientes no ancianos.
    for _ in range(70):
        is_elderly = random.random() > 0.3
        case = create_case("vesiculobullous_disease",
            edad=random.randint(70, 95) if is_elderly else random.randint(20, 50),
            bula_ampolla=1,
            prurito=chance(0.8),
            subagudo=chance(0.7),
            generalizado=chance(0.6), # A veces localizado inicial
            localizado=chance(0.3),
            inmunosupresion=chance(0.2))
        atypical_cases.append(case)

    # --- CATEGORÍA 6: VASCULITIS / PURPURA (CRÍTICO) (60 casos) ---
    # Varianza: Púrpura no palpable o vasculitis sin dolor.
    for _ in range(60):
        case = create_case("vasculitic_purpuric_disease",
            edad=random.randint(5, 75),
            purpura=1,
            dolor=chance(0.4), # Solo 40% duele/quema
            fiebre=chance(0.2),
            agudo=1,
            localizado=chance(0.8),
            generalizado=chance(0.2))
        atypical_cases.append(case)

    # --- CATEGORÍA 7: INFLAMMATORY OTHER / ATYPICAL (60 casos) ---
    # Varianza: Escabiasis atípica o Lupus sin fotosensibilidad evidente.
    for _ in range(60):
        case = create_case("inflammatory_dermatosis_other",
            edad=random.randint(1, 95),
            papula=chance(0.7),
            prurito=chance(0.8),
            cronico=chance(0.6),
            generalizado=chance(0.5),
            inmunosupresion=chance(0.1))
        atypical_cases.append(case)

    print(f"Generando {len(atypical_cases)} casos clínicos con varianza biológica...")

    # Guardar / Append
    file_exists = os.path.isfile(data_path)
    with open(data_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for c in atypical_cases:
            writer.writerow(c)
            
    print(f"Dataset expandido exitosamente en {data_path}")

if __name__ == "__main__":
    generate_atypical_cases()
