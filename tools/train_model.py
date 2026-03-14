import pandas as pd
import json
import os
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

def train_dermato_triage_model():
    """
    Entrena un modelo de Regresión Logística para el triage dermatológico
    y exporta los coeficientes para su uso en el motor JavaScript.
    """
    # Rutas de archivos
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "training_cases.csv")
    output_path = os.path.join(base_dir, "engine", "model_coefficients.json")
    
    # 1. Cargar datos y esquema
    if not os.path.exists(data_path):
        print(f"Error: No se encontró el archivo {data_path}")
        return

    schema_path = os.path.join(base_dir, "engine", "feature_schema.json")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    
    # Lista de features esperadas (excluyendo el target)
    expected_features = list(schema.keys())
    
    df = pd.read_csv(data_path)
    
    # Verificación mínima de datos
    if len(df) < 5:
        print("Error: El dataset debe tener al menos algunos ejemplos para entrenar.")
        return

    # 2. Separar Features (X) y Target (y)
    # Solo tomamos las columnas presentes en el esquema + target
    available_cols = [col for col in expected_features if col in df.columns]
    X = df[available_cols]
    y = df["target"]


    # 3. Procesamiento de variables categóricas (fototipo)
    # Fototipo es categórico (1-6), lo convertimos a dummies
    X_encoded = pd.get_dummies(X, columns=["fototipo"], prefix="ft")

    # Guardar nombres de columnas finales para el motor JS
    feature_names = X_encoded.columns.tolist()

    # Normalización de datos (StandardScaler)
    # Fundamental para que los coeficientes de la Regresión Logística sean comparables
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_encoded)

    # 4. Entrenar Modelo
    # Usamos multi_class='multinomial' para clasificar P1, P2 y P3 simultáneamente
    model = LogisticRegression(
        multi_class='multinomial', 
        solver='lbfgs', 
        max_iter=1000,
        C=1.0  # Parámetro de regularización
    )
    model.fit(X_scaled, y)

    # 5. Exportar Coeficientes a JSON
    # Estos valores serán leídos por el objeto Interpreter en JavaScript
    model_data = {
        "metadata": {
            "model_type": "LogisticRegression",
            "classes": [int(c) if isinstance(c, (int, float)) else str(c) for c in model.classes_.tolist()],
            "features": feature_names,
            "version": "1.0.0"
        },
        "parameters": {
            "intercept": model.intercept_.tolist(),
            "coefficients": model.coef_.tolist()
        },
        "scaling": {
            "mean": scaler.mean_.tolist(),
            "scale": scaler.scale_.tolist()
        }
    }

    # Asegurar que el directorio existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(model_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Éxito: Modelo entrenado y coeficientes exportados a {output_path}")
    print(f"Features procesadas: {len(feature_names)}")

if __name__ == "__main__":
    train_dermato_triage_model()
