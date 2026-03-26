import json
import numpy as np
import os
import pandas as pd

def analyze_calibration():
    # Rutas
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    model_path = os.path.join(base_dir, "engine", "model_coefficients.json")
    
    if not os.path.exists(data_path) or not os.path.exists(model_path):
        print("Error: No se encontraron los archivos necesarios.")
        return

    # 1. Cargar Datos y Modelo
    df = pd.read_csv(data_path)
    with open(model_path, "r", encoding="utf-8") as f:
        model_json = json.load(f)

    classes = model_json["metadata"]["classes"]
    feature_names = model_json["metadata"]["features"]
    
    # 2. Preprocesamiento (Asegurar mismo encoding que entrenamiento)
    X = df.drop("target", axis=1)
    y_true = df["target"]
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")
    
    for col in feature_names:
        if col not in X_encoded.columns:
            X_encoded[col] = 0
    X_encoded = X_encoded[feature_names]

    # 3. Inferencia Probabilística (Manual Softmax)
    mean = np.array(model_json["scaling"]["mean"], dtype=float)
    scale = np.array(model_json["scaling"]["scale"], dtype=float)
    X_numeric = X_encoded.apply(pd.to_numeric).values.astype(float)
    X_scaled = (X_numeric - mean) / scale

    intercepts = np.array(model_json["parameters"]["intercept"], dtype=float)
    coefficients = np.array(model_json["parameters"]["coefficients"], dtype=float)
    
    scores = np.dot(X_scaled, coefficients.T) + intercepts
    exp_scores = np.exp(scores - np.max(scores, axis=1, keepdims=True))
    probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

    # 4. Cálculo de Métricas de Confianza
    results = []
    for i in range(len(y_true)):
        p = probs[i]
        sorted_indices = np.argsort(p)[::-1]
        
        top1_idx = sorted_indices[0]
        top2_idx = sorted_indices[1]
        
        top1_prob = p[top1_idx]
        top2_prob = p[top2_idx]
        gap = top1_prob - top2_prob
        
        pred_class = classes[top1_idx]
        true_class = y_true[i]
        is_correct = (pred_class == true_class)
        
        results.append({
            "true": true_class,
            "pred": pred_class,
            "prob": top1_prob,
            "gap": gap,
            "correct": is_correct
        })

    res_df = pd.DataFrame(results)

    # 5. Reporte de Calibración
    print("\n=== ANÁLISIS DE CALIBRACIÓN Y CONFIANZA DEL MODELO ===")
    print(f"Total de casos evaluados: {len(res_df)}")
    
    acc = res_df["correct"].mean()
    print(f"Accuracy (Top-1): {acc:.4f}")

    print("\n--- MÉTRICAS DE CONFIANZA ---")
    print(f"Confianza promedio (Top-1): {res_df['prob'].mean():.4f}")
    print(f"Confianza promedio en aciertos: {res_df[res_df['correct']]['prob'].mean():.4f}")
    if not res_df[~res_df['correct']].empty:
        print(f"Confianza promedio en errores: {res_df[~res_df['correct']]['prob'].mean():.4f}")
    
    print(f"Gap promedio (Top1 - Top2): {res_df['gap'].mean():.4f}")

    # 6. Detección de Baja Confianza y Ambigüedad
    low_conf = res_df[res_df["prob"] < 0.60]
    ambiguous = res_df[res_df["gap"] < 0.15]

    print("\n--- CASOS DE BAJA CONFIANZA (Prob < 0.60) ---")
    print(f"Total: {len(low_conf)} ({len(low_conf)/len(res_df)*100:.1f}%)")
    if not low_conf.empty:
        print(low_conf[["true", "pred", "prob", "correct"]].head(10))

    print("\n--- CASOS AMBIGUOS (Gap < 0.15) ---")
    print(f"Total: {len(ambiguous)} ({len(ambiguous)/len(res_df)*100:.1f}%)")
    if not ambiguous.empty:
        print(ambiguous[["true", "pred", "prob", "gap", "correct"]].head(10))

    # 7. Distribución por Deciles
    print("\n--- DISTRIBUCIÓN DE PROBABILIDADES ---")
    res_df['decil'] = pd.cut(res_df['prob'], bins=np.arange(0, 1.1, 0.1))
    dist = res_df.groupby('decil').size()
    for decil, count in dist.items():
        bar = "█" * int(count / len(res_df) * 50)
        print(f"{str(decil):<12} | {count:>3} | {bar}")

    print("\n--- RECOMENDACIÓN CLÍNICA ---")
    if acc > 0.95 and res_df['prob'].mean() > 0.80:
        print("MODELO SÓLIDO: El modelo muestra una calibración fuerte y alta certeza.")
    else:
        print("PRECAUCIÓN: Existen zonas de traslape que requieren revisión de la lógica de signals.")

if __name__ == "__main__":
    analyze_calibration()
