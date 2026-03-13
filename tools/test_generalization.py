import json
import numpy as np
import os
import random
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

def test_generalization():
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
    
    # 1. Generador de Casos Nuevos (Sintéticos pero Clínicamente Coherentes)
    def generate_new_cases(n_per_class=6):
        new_cases = []
        fototipos = ["I", "II", "III", "IV", "V", "VI"]
        
        for syn in classes:
            for _ in range(n_per_class):
                case = {f: 0 for f in feature_names if not f.startswith("ft_")}
                case["target"] = syn
                case["fototipo"] = random.choice(fototipos)
                
                # Reglas clínicas con aleatoriedad para evitar duplicación exacta
                if syn == "eczema_dermatitis":
                    case["edad"] = random.randint(1, 80)
                    case["placa"] = 1 if random.random() > 0.5 else 0
                    case["papula"] = 1 if case["placa"] == 0 else random.choice([0, 1])
                    case["escama"] = 1
                    case["prurito"] = 1
                    case["flexural"] = 1 if random.random() > 0.3 else 0
                    case["localizado"] = 1
                    case["subagudo"] = 1 if random.random() > 0.5 else 0
                    case["cronico"] = 1 if case["subagudo"] == 0 else 0
                    case["atopia"] = 1 if random.random() > 0.4 else 0
                    
                elif syn == "psoriasiform_dermatosis":
                    case["edad"] = random.randint(10, 85)
                    case["placa"] = 1
                    case["escama"] = 1
                    case["extensor"] = 1 if random.random() > 0.4 else 0
                    case["cronico"] = 1
                    case["generalizado"] = 1 if case["extensor"] == 0 else random.choice([0, 1])
                    case["localizado"] = 1 if case["generalizado"] == 0 else 0
                    case["diabetes"] = 1 if random.random() > 0.7 else 0

                elif syn == "bacterial_skin_infection":
                    case["edad"] = random.randint(5, 90)
                    case["pustula"] = 1 if random.random() > 0.5 else 0
                    case["ulcera"] = 1 if case["pustula"] == 0 else random.choice([0, 1])
                    case["dolor"] = 1
                    case["agudo"] = 1
                    case["fiebre"] = 1 if random.random() > 0.4 else 0
                    case["localizado"] = 1
                    case["diabetes"] = 1 if random.random() > 0.6 else 0

                elif syn == "viral_skin_infection":
                    case["edad"] = random.randint(1, 95)
                    case["vesicula"] = 1
                    case["dolor"] = 1
                    case["agudo"] = 1
                    case["localizado"] = 1
                    case["dermatomal"] = 1 if random.random() > 0.6 else 0
                    case["inmunosupresion"] = 1 if random.random() > 0.8 else 0

                elif syn == "fungal_skin_infection":
                    case["edad"] = random.randint(5, 80)
                    case["placa"] = 1
                    case["escama"] = 1
                    case["prurito"] = 1
                    case["intertriginoso"] = 1 if random.random() > 0.3 else 0
                    case["localizado"] = 1
                    case["subagudo"] = 1 if random.random() > 0.5 else 0
                    case["cronico"] = 1 if case["subagudo"] == 0 else 0

                elif syn == "drug_reaction":
                    case["edad"] = random.randint(18, 90)
                    case["papula"] = 1
                    case["generalizado"] = 1
                    case["agudo"] = 1
                    case["prurito"] = 1
                    case["farmacos_recientes"] = 1
                    case["fiebre"] = 1 if random.random() > 0.7 else 0

                elif syn == "urticarial_dermatosis":
                    case["edad"] = random.randint(1, 70)
                    case["papula"] = 1
                    case["agudo"] = 1
                    case["prurito"] = 1
                    case["generalizado"] = 1
                    case["atopia"] = 1 if random.random() > 0.7 else 0

                elif syn == "vesiculobullous_disease":
                    case["edad"] = random.randint(45, 90)
                    case["bula_ampolla"] = 1
                    case["dolor"] = 1
                    case["subagudo"] = 1
                    case["generalizado"] = 1 if random.random() > 0.5 else 0
                    case["localizado"] = 1 if case["generalizado"] == 0 else 0
                    case["inmunosupresion"] = 1 if random.random() > 0.5 else 0

                elif syn == "vasculitic_purpuric_disease":
                    case["edad"] = random.randint(5, 85)
                    case["purpura"] = 1
                    case["dolor"] = 1
                    case["agudo"] = 1 if random.random() > 0.5 else 0
                    case["subagudo"] = 1 if case["agudo"] == 0 else 0
                    case["localizado"] = 1 if random.random() > 0.4 else 0
                    case["generalizado"] = 1 if case["localizado"] == 0 else 0

                elif syn == "cutaneous_tumor_suspected":
                    case["edad"] = random.randint(50, 95)
                    case["ulcera"] = 1 if random.random() > 0.5 else 0
                    case["placa"] = 1 if case["ulcera"] == 0 else 0
                    case["cronico"] = 1
                    case["localizado"] = 1
                    case["dolor"] = 1 if random.random() > 0.7 else 0

                elif syn == "benign_cutaneous_tumor":
                    case["edad"] = random.randint(20, 90)
                    case["papula"] = 1 if random.random() > 0.5 else 0
                    case["placa"] = 1 if case["papula"] == 0 else 0
                    case["cronico"] = 1
                    case["localizado"] = 1
                    case["prurito"] = 0

                elif syn == "inflammatory_dermatosis_other":
                    case["edad"] = random.randint(20, 80)
                    case["papula"] = 1
                    case["placa"] = 1 if random.random() > 0.5 else 0
                    case["subagudo"] = 1
                    case["localizado"] = 1
                    case["prurito"] = 1

                new_cases.append(case)
        return new_cases

    # 2. Ejecutar Evaluación
    test_data = generate_new_cases(n_per_class=6)
    df_test = pd.DataFrame(test_data)
    
    X = df_test.drop("target", axis=1)
    y_true = df_test["target"]
    
    # Procesar fototipos
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")
    for col in feature_names:
        if col not in X_encoded.columns:
            X_encoded[col] = 0
    X_encoded = X_encoded[feature_names]

    # Aplicar inferencia
    mean = np.array(model_json["scaling"]["mean"], dtype=float)
    scale = np.array(model_json["scaling"]["scale"], dtype=float)
    
    # Asegurar que X_encoded sea todo numerico
    X_numeric = X_encoded.apply(pd.to_numeric).values.astype(float)
    X_scaled = (X_numeric - mean) / scale

    intercepts = np.array(model_json["parameters"]["intercept"], dtype=float)
    coefficients = np.array(model_json["parameters"]["coefficients"], dtype=float)
    
    # Softmax para probabilidades
    scores = np.dot(X_scaled, coefficients.T) + intercepts
    exp_scores = np.exp(scores - np.max(scores, axis=1, keepdims=True))
    probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

    
    y_pred_indices = np.argmax(probs, axis=1)
    y_pred = [classes[i] for i in y_pred_indices]
    
    # 3. Reporte de Resultados
    print(f"\n=== PRUEBA DE GENERALIZACIÓN DEL MODELO ===")
    print(f"Casos nuevos generados: {len(df_test)}")
    print(f"Accuracy Score: {accuracy_score(y_true, y_pred):.4f}")
    
    print("\n--- MATRIZ DE CONFUSIÓN ---")
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    cm_df = pd.DataFrame(cm, index=classes, columns=classes)
    print(cm_df)

    print("\n--- REPORTE DE CLASIFICACIÓN ---")
    print(classification_report(y_true, y_pred, target_names=classes))

    # Análisis de Probabilidades
    correct_probs = [probs[i, classes.index(y_true[i])] for i in range(len(y_true))]
    print(f"\nProbabilidad promedio asignada a la clase correcta: {np.mean(correct_probs):.4f}")

    # Identificar errores
    errors = []
    for i in range(len(y_true)):
        if y_true[i] != y_pred[i]:
            errors.append({
                "real": y_true[i],
                "predicho": y_pred[i],
                "prob": probs[i, y_pred_indices[i]],
                "edad": df_test.iloc[i]["edad"]
            })

    if errors:
        print("\n--- CASOS CON ERROR DE PREDICCIÓN ---")
        for err in errors:
            print(f"Real: {err['real']} | Predicho: {err['predicho']} (Conf: {err['prob']:.4f}) | Edad: {err['edad']}")
    else:
        print("\n✅ El modelo generalizó perfectamente sobre el set de prueba.")

if __name__ == "__main__":
    test_generalization()
