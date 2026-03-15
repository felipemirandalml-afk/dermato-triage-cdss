import json
import os

"""
tools/explore_ontology.py
Script para explorar la jerarquía de la ontología Derm1M sin modificar el archivo original.
"""

def explore_ontology(file_path):
    if not os.path.exists(file_path):
        print(f"Error: No se encontró el archivo en {file_path}")
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            ontology = json.load(f)
    except Exception as e:
        print(f"Error cargando el JSON: {e}")
        return

    # 1. Mostrar keys de nivel superior
    print("=== TOP-LEVEL KEYS ===")
    top_keys = list(ontology.keys())
    print(f"Total de categorías/términos encontrados: {len(top_keys)}")
    print(f"Keys principales (primeras 10): {top_keys[:10]}\n")

    # 2. Función recursiva para imprimir el árbol
    visited = set()

    def print_tree(node_name, indent=0):
        """Imprime recursivamente la jerarquía con indentación."""
        print("  " * indent + str(node_name))
        
        # Evitar bucles infinitos si la ontología tuviera ciclos
        if node_name in visited:
            return
        
        visited.add(node_name)
        
        # Obtener los hijos del nodo actual
        children = ontology.get(node_name, [])
        
        if isinstance(children, list):
            for child in children:
                print_tree(child, indent + 1)
        elif isinstance(children, dict):
            # Caso no esperado según el schema actual, pero manejado por robustez
            for child_key in children.keys():
                print_tree(child_key, indent + 1)
        
        # Nota: quitamos de visited después de procesar una rama si queremos 
        # permitir que un nodo aparezca en distintos caminos (DAG), 
        # pero para exploración de árbol simple lo mantenemos para evitar redundancia extrema.
        # visited.remove(node_name) 

    print("=== ONTOLOGY HIERARCHY TREE ===")
    # Empezamos desde la raíz definida en el archivo
    root_elements = ontology.get("root", [])
    
    if not root_elements:
        print("Advertencia: No se encontró la key 'root'. Explorando todas las keys principales...")
        # Si no hay root, podríamos intentar inferir o simplemente listar todo.
        # En este caso 'root' existe en el archivo.
        root_elements = top_keys[:5] # Fallback de seguridad

    for element in root_elements:
        print_tree(element)

if __name__ == "__main__":
    # Ruta relativa al archivo de ontología
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    ontology_file = os.path.join(base_dir, "data", "derm1m", "ontology.json")
    
    explore_ontology(ontology_file)
