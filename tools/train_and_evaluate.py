import pandas as pd
import numpy as np
import json
import os
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import StandardScaler

# Rutas
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
data_path = os.path.join(base_dir, "data", "training_cases_v2.csv")
schema_path = os.path.join(base_dir, "engine", "feature_schema.json")
output_path = os.path.join(base_dir, "engine", "model_coefficients.json")
rf_output_path = os.path.join(base_dir, "engine", "rf_model.json")

def load_data():
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    expected_features = list(schema.keys())
    
    df = pd.read_csv(data_path)
    # Limpieza agresiva de NaNs
    df = df.dropna(subset=["target"])
    
    available_cols = [col for col in expected_features if col in df.columns]
    
    X = df[available_cols].copy()
    y = df["target"]
    
    # Map fototipo integers/strings to dummy prefixes
    if 'fototipo' in X.columns:
        X['fototipo'] = X['fototipo'].astype(str)
        
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")

    # Ensure ft_I, ft_II, ..., ft_VI exist to match schema output identically
    for ft in ['ft_I', 'ft_II', 'ft_III', 'ft_IV', 'ft_V', 'ft_VI']:
        if ft not in X_encoded.columns:
            X_encoded[ft] = 0

    # Ensure columns match original schema order exactly + fototipo
    final_features = expected_features.copy()
    if 'fototipo' in final_features:
        final_features.remove('fototipo')
    feature_names = final_features + ['ft_I', 'ft_II', 'ft_III', 'ft_IV', 'ft_V', 'ft_VI']
    
    # Reindex to ensure explicit feature order, filling missings with 0
    X_encoded = X_encoded.reindex(columns=feature_names, fill_value=0)
    X_encoded = X_encoded.fillna(0) # Doble seguridad
    
    return X_encoded, y, feature_names

def evaluate_model(name, model, X_test, y_test):
    print(f"\n{'='*50}\nEVALUACIÓN: {name}\n{'='*50}")
    y_pred = model.predict(X_test)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(X_test)
        confidence = np.max(probs, axis=1).mean()
        print(f"Confianza Media de Probabilidad: {confidence:.2f}")

    print(f"\nAccuracy Global: {accuracy_score(y_test, y_pred):.3f}\n")
    print(classification_report(y_test, y_pred, zero_division=0))
def export_rf_to_json(model, feature_names, path):
    print("Exportando Random Forest a JSON...")
    trees = []
    
    for i, estimator in enumerate(model.estimators_):
        tree = estimator.tree_
        
        # Build node structures
        def recurse(node_id):
            left_child = tree.children_left[node_id]
            right_child = tree.children_right[node_id]
            
            # Leaf node
            if left_child == -1 and right_child == -1:
                # Tree value is array of array [1, num_classes]
                val = tree.value[node_id][0]
                # To save space, we can just save the normalized value
                val = (val / val.sum()).tolist()
                return {"is_leaf": True, "value": val}
            
            # Decision node
            return {
                "is_leaf": False,
                "feature": int(tree.feature[node_id]), # use index to save space, feature_names maps it
                "threshold": float(tree.threshold[node_id]),
                "left": recurse(left_child),
                "right": recurse(right_child)
            }
            
        trees.append(recurse(0))

    model_data = {
        "metadata": {
            "model_type": "RandomForest",
            "classes": [str(c) for c in model.classes_.tolist()],
            "features": feature_names,
            "version": "4.0.0"
        },
        "trees": trees
    }
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(model_data, f, ensure_ascii=False) # remove indent=2 to save file size

def run_pipeline():
    print("Iniciando Pipeline de Entrenamiento - Fase 3...")
    X, y, feature_names = load_data()
    print(f"Total casos: {len(X)}")
    
    # Split para evaluación real (70/30)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    
    # Normalización (Requerida por RL, OPCIONAL para RF)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    X_all_scaled = scaler.fit_transform(X) # Para exportar con todos los datos y recuperar el scaler
    
    # ---------------------------------------------------------
    # Modelo 1: Regresión Logística (Retrained Baseline)
    # ---------------------------------------------------------
    # Class_weight='balanced' para compensar desbalances graves como viral_skin_infection
    lr_model = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000, C=1.0, class_weight='balanced')
    lr_model.fit(X_train_scaled, y_train)
    evaluate_model("REGRESIÓN LOGÍSTICA (Test Set)", lr_model, X_test_scaled, y_test)
    
    # ---------------------------------------------------------
    # Modelo 2: Random Forest (Benchmark)
    # ---------------------------------------------------------
    rf_model = RandomForestClassifier(n_estimators=300, max_depth=20, min_samples_split=5, min_samples_leaf=3, class_weight='balanced_subsample', random_state=42)
    rf_model.fit(X_train, y_train)
    evaluate_model("RANDOM FOREST (Test Set)", rf_model, X_test, y_test)

    # ---------------------------------------------------------
    # Re-entrenamiento Random Forest (Full Data) y Exportación
    # ---------------------------------------------------------
    print("\nReentrenando RANDOM FOREST sobre dataset completo para exportación...")
    rf_final = RandomForestClassifier(n_estimators=300, max_depth=20, min_samples_split=5, min_samples_leaf=3, class_weight='balanced_subsample', random_state=42)
    rf_final.fit(X, y)

    # --- ANÁLISIS DE IMPORTANCIA DE FEATURES (FASE 6.2D) ---
    importances = rf_final.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    print("\n" + "="*50)
    print("TOP 15 FEATURES (IMPORTANCE)")
    print("="*50)
    for f in range(15):
        print(f"{f+1:2d}. {feature_names[indices[f]]:<25} : {importances[indices[f]]:.4f}")

    NEW_FEATURES = ["prodromo_catarral", "despegamiento_epidermico", "borde_activo", "costra_mielicerica", "purpura_palpable", "engrosamiento_ungueal"]
    print("\n" + "="*50)
    print("IMPORTANCIA DE NUEVAS FEATURES HD")
    print("="*50)
    for feat in NEW_FEATURES:
        if feat in feature_names:
            idx = feature_names.index(feat)
            rank = np.where(indices == idx)[0][0] + 1
            print(f"Feature: {feat:<25} | Importancia: {importances[idx]:.4f} | Rank: {rank}")
        else:
            print(f"Feature: {feat:<25} | NOT FOUND IN MODEL")

    export_rf_to_json(rf_final, feature_names, rf_output_path)
    print(f"✅ Random Forest exportado a {rf_output_path}")

    # ---------------------------------------------------------
    # Re-entrenamiento y Exportación (Logistic Regression)
    # ---------------------------------------------------------
    print("\nReentrenando Regresión Logística sobre dataset completo para exportación...")
    lr_final = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000, C=1.0, class_weight='balanced')
    lr_final.fit(X_all_scaled, y)
    
    model_data = {
        "metadata": {
            "model_type": "LogisticRegression",
            "classes": [str(c) for c in lr_final.classes_.tolist()],
            "features": feature_names,
            "version": "3.0.0"
        },
        "parameters": {
            "intercept": lr_final.intercept_.tolist(),
            "coefficients": lr_final.coef_.tolist()
        },
        "scaling": {
            "mean": scaler.mean_.tolist(),
            "scale": scaler.scale_.tolist()
        }
    }
    
    # Escribir a model_coefficients.json sobreescribiendo
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(model_data, f, indent=2, ensure_ascii=False)
        
    print(f"\n✅ Coeficientes LogisticRegression exportados a {output_path}")

if __name__ == "__main__":
    run_pipeline()
