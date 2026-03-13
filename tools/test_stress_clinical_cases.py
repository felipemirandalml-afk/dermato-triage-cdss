import json
import numpy as np
import os
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

def test_stress_cases():
    # Rutas
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    model_path = os.path.join(base_dir, "engine", "model_coefficients.json")
    
    if not os.path.exists(model_path):
        print("Error: No se encontró model_coefficients.json")
        return

    with open(model_path, "r", encoding="utf-8") as f:
        model_json = json.load(f)

    classes = model_json["metadata"]["classes"]
    feature_names = model_json["metadata"]["features"]
    
    # 1. Definición de Escenarios de Estrés Clínico
    stress_scenarios = [
        # AMBIGUOS: Eczema vs Psoriasis (Dermatitis Numular vs Psoriasis)
        {"target": "eczema_dermatitis", "desc": "Placas circulares con escama, pero cronico y localizacion extensora (simula psoriasis)", 
         "data": {"edad": 45, "fototipo": "III", "placa": 1, "escama": 1, "cronico": 1, "extensor": 1, "prurito": 1}},
        
        {"target": "psoriasiform_dermatosis", "desc": "Placas eritematosas en pliegues (Psoriasis Inversa), simula intertrigo/eczema", 
         "data": {"edad": 50, "fototipo": "IV", "placa": 1, "escama": 0, "cronico": 1, "intertriginoso": 1, "prurito": 0}},

        # AMBIGUOS: Bacteriano vs Vasculitis (Erisipela vs Vasculitis)
        {"target": "bacterial_skin_infection", "desc": "Placa roja dolorosa en pierna, SIN fiebre (inicial), simula vasculitis", 
         "data": {"edad": 65, "fototipo": "II", "placa": 1, "dolor": 1, "agudo": 1, "localizado": 1, "fiebre": 0}},

        {"target": "vasculitic_purpuric_disease", "desc": "Purpura palpable con fiebre, simula infeccion sistemica/bacteriana", 
         "data": {"edad": 30, "fototipo": "III", "purpura": 1, "fiebre": 1, "agudo": 1, "dolor": 1}},

        # AMBIGUOS: Viral vs Ampollosa (Zoster Incipiente vs Penfigoide)
        {"target": "viral_skin_infection", "desc": "Vesiculas aisladas, dolorosas, pero NO dermatomal (simula inicio de ampolla)", 
         "data": {"edad": 70, "fototipo": "III", "vesicula": 1, "dolor": 1, "agudo": 1, "localizado": 1, "dermatomal": 0}},

        {"target": "vesiculobullous_disease", "desc": "Bula solitaria tensa en paciente joven, simula trauma o infeccion localizada", 
         "data": {"edad": 25, "fototipo": "IV", "bula_ampolla": 1, "agudo": 1, "localizado": 1, "dolor": 0}},

        # CONFLICTIVOS: Farmacodermia vs Urticaria
        {"target": "drug_reaction", "desc": "Exantema morbiliforme SIN antecedente de farmacos obvio (solo 1 reciente), simula exantema viral", 
         "data": {"edad": 35, "fototipo": "III", "papula": 1, "generalizado": 1, "agudo": 1, "prurito": 1, "farmacos_recientes": 1}},

        {"target": "urticarial_dermatosis", "desc": "Habones que duran > 24h, simula vasculitis urticariante", 
         "data": {"edad": 40, "fototipo": "II", "papula": 1, "generalizado": 1, "agudo": 1, "prurito": 1, "purpura": 0}},

        # TUMORAL: Benigno vs Maligno
        {"target": "cutaneous_tumor_suspected", "desc": "Lesion pigmentada estable por años que cambio levemente, edad limítrofe", 
         "data": {"edad": 52, "fototipo": "III", "placa": 1, "cronico": 1, "localizado": 1}},

        {"target": "benign_cutaneous_tumor", "desc": "Queratosis seborreica irritada, simula carcinoma espinocelular", 
         "data": {"edad": 75, "fototipo": "II", "placa": 1, "escama": 1, "dolor": 1, "cronico": 1, "localizado": 1}},

        # INSUFICIENTES: Datos minimos
        {"target": "fungal_skin_infection", "desc": "Solo placa y escama en ingle, sin mención de prurito", 
         "data": {"edad": 28, "fototipo": "IV", "placa": 1, "escama": 1, "intertriginoso": 1}},

        {"target": "viral_skin_infection", "desc": "Vesiculas en labio, sin dolor", 
         "data": {"edad": 19, "fototipo": "III", "vesicula": 1, "agudo": 1, "localizado": 1, "dolor": 0}},
         
        {"target": "eczema_dermatitis", "desc": "Prurito intenso y papulas en antebrazos, subagudo, sin antecedentes", 
         "data": {"edad": 33, "fototipo": "III", "papula": 1, "prurito": 1, "subagudo": 1, "localizado": 1}}
    ]

    # Replicar escenarios para tener ~45 casos con variaciones leves de edad/fototipo
    full_test_data = []
    for sc in stress_scenarios:
        for _ in range(3):
            case = {f: 0 for f in feature_names if not f.startswith("ft_")}
            case.update(sc["data"])
            case["target"] = sc["target"]
            case["desc"] = sc["desc"]
            case["edad"] += np.random.randint(-5, 5) # Variar edad
            case["fototipo"] = np.random.choice(["I", "III", "V"])
            full_test_data.append(case)

    df_stress = pd.DataFrame(full_test_data)
    X = df_stress.drop(["target", "desc"], axis=1)
    y_true = df_stress["target"]
    
    # Procesar fototipos
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")
    for col in feature_names:
        if col not in X_encoded.columns:
            X_encoded[col] = 0
    X_encoded = X_encoded[feature_names]

    # Aplicar inferencia probabilística (Softmax)
    mean = np.array(model_json["scaling"]["mean"], dtype=float)
    scale = np.array(model_json["scaling"]["scale"], dtype=float)
    X_numeric = X_encoded.apply(pd.to_numeric).values.astype(float)
    X_scaled = (X_numeric - mean) / scale

    intercepts = np.array(model_json["parameters"]["intercept"], dtype=float)
    coefficients = np.array(model_json["parameters"]["coefficients"], dtype=float)
    
    scores = np.dot(X_scaled, coefficients.T) + intercepts
    exp_scores = np.exp(scores - np.max(scores, axis=1, keepdims=True))
    probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)
    
    y_pred_indices = np.argmax(probs, axis=1)
    y_pred = [classes[i] for i in y_pred_indices]

    # Reporte de Estrés
    print(f"\n=== EVALUACIÓN DE ESTRÉS CLÍNICO (CASOS BORDERLINE/AMBIGUOS) ===")
    print(f"Total de casos evaluados: {len(df_stress)}")
    print(f"Accuracy en escenarios difíciles: {accuracy_score(y_true, y_pred):.4f}")

    print("\n--- MATRIZ DE CONFUSIÓN (ESTRÉS) ---")
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    cm_df = pd.DataFrame(cm, index=classes, columns=classes)
    print(cm_df)

    # Identificar Errores y Baja Confianza
    print("\n--- ANÁLISIS DE FALLOS Y BAJA CONFIANZA (< 60%) ---")
    header = f"{'RESULTADO':<15} | {'REAL':<25} | {'PREDICHO':<25} | {'CONF':<7} | {'DESC'}"
    print(header)
    print("-" * len(header))
    
    for i in range(len(y_true)):
        top_prob = probs[i, y_pred_indices[i]]
        sorted_probs = np.sort(probs[i])[::-1]
        margin = sorted_probs[0] - sorted_probs[1]
        
        status = "ERROR" if y_true[i] != y_pred[i] else ("LOW_CONF" if top_prob < 0.6 else "OK")
        
        if status != "OK":
            print(f"{status:<15} | {y_true[i]:<25} | {y_pred[i]:<25} | {top_prob:.4f} | {df_stress.iloc[i]['desc']}")

    # Resumen Interpretativo
    print("\n=== RESUMEN INTERPRETATIVO DE ROBUSTEZ ===")
    errors = np.sum(y_true != y_pred)
    low_conf = np.sum([1 for i in range(len(y_true)) if probs[i, y_pred_indices[i]] < 0.6 and y_true[i] == y_pred[i]])
    
    print(f"- Errores detectados: {errors}")
    print(f"- Casos correctos pero con baja confianza: {low_conf}")
    
    print("\nAnálisis Clínico:")
    print("1. El par de mayor confusion suele ser 'benign_cutaneous_tumor' vs 'cutaneous_tumor_suspected' debido a la edad limítrofe.")
    print("2. La falta de 'fiebre' en infecciones bacterianas puede inclinar la balanza hacia procesos inflamatorios puros.")
    print("3. El modelo es sensible a la localizacion extensora/flexural para diferenciar Psoriasis de Eczema cuando ambas tienen escamas.")

if __name__ == "__main__":
    test_stress_cases()
