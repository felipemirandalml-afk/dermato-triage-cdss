import pandas as pd
import json
import numpy as np
import os
from sklearn.metrics import confusion_matrix, classification_report

def analyze_model():
    # Rutas
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    model_path = os.path.join(base_dir, "engine", "model_coefficients.json")

    # 1. Cargar Datos
    if not os.path.exists(data_path) or not os.path.exists(model_path):
        print("Error: No se encontraron los archivos necesarios.")
        return

    df = pd.read_csv(data_path)
    with open(model_path, "r", encoding="utf-8") as f:
        model_json = json.load(f)

    # 2. Preprocesamiento (Dummies para fototipo)
    X = df.drop("target", axis=1)
    y_true = df["target"]
    
    # Asegurar el mismo encoding que el entrenamiento
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")
    
    # Reordenar columnas para que coincidan con el modelo
    feature_names = model_json["metadata"]["features"]
    
    # Asegurar que todas las columnas existan (por si no hay ejemplos de algún fototipo en el CSV, 
    # aunque aquí están todos)
    for col in feature_names:
        if col not in X_encoded.columns:
            X_encoded[col] = 0
            
    X_encoded = X_encoded[feature_names]

    # 3. Aplicar Escalamiento (Scaling)
    mean = np.array(model_json["scaling"]["mean"])
    scale = np.array(model_json["scaling"]["scale"])
    X_scaled = (X_encoded.values - mean) / scale

    # 4. Calcular Predicciones (Manual Linear Inference)
    intercepts = np.array(model_json["parameters"]["intercept"])
    coefficients = np.array(model_json["parameters"]["coefficients"])
    classes = model_json["metadata"]["classes"]

    # Z = X * W' + b
    scores = np.dot(X_scaled, coefficients.T) + intercepts
    y_pred_indices = np.argmax(scores, axis=1)
    y_pred = [classes[i] for i in y_pred_indices]

    # 5. Métricas y Matriz de Confusión
    print(f"\n=== ANÁLISIS DEL MODELO DERMATOLÓGICO ===")
    print(f"Número de casos evaluados: {len(df)}")
    print(f"Número de clases: {len(classes)}")
    
    print("\n--- MATRIZ DE CONFUSIÓN ---")
    cm = confusion_matrix(y_true, y_pred, labels=classes)
    cm_df = pd.DataFrame(cm, index=classes, columns=classes)
    print(cm_df)

    print("\n--- REPORTE DE CLASIFICACIÓN ---")
    print(classification_report(y_true, y_pred, target_names=classes))

    # 6. Importancia de Features (Top 5 por síndrome)
    print("\n--- FEATURES MÁS INFLUYENTES POR SÍNDROME (Basado en Coeficientes) ---")
    for i, class_name in enumerate(classes):
        coeffs = coefficients[i]
        # Obtener índices de los coeficientes más altos
        top_indices = np.argsort(coeffs)[-5:][::-1]
        
        print(f"\n> {class_name.upper()}:")
        for idx in top_indices:
            print(f"  - {feature_names[idx]}: {coeffs[idx]:.4f}")

if __name__ == "__main__":
    analyze_model()
