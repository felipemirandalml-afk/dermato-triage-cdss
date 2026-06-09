"""
prototype_bayesian_syndrome.py — PROTOTIPO (no productivo)

Demuestra el clasificador sindrómico bayesiano (Naive Bayes Bernoulli) computado
DIRECTAMENTE desde la co-ocurrencia real de Derm1M, sin datos sintéticos.

P(feature|síndrome) se cuenta de concept.csv (mapeado con concept_canonical_map +
syndrome_to_ontology_map). Luego, para un paciente con un set de features:
  score(s) = log P(s) + Σ_{f presente} log P(f|s) + Σ_{f ausente} log(1 - P(f|s))
  → softmax → probabilidad por síndrome.

Cubre los 14 síndromes (incluidos pigmentary/connective que el RF no emite).
"""
import json
import math
import re
from collections import defaultdict
from pathlib import Path

import pandas as pd

ALPHA = 0.5  # suavizado de Laplace


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def load_concept_resolver(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    resolver = {}
    for c in data["concepts"]:
        cid = c["canonical_id"]
        resolver[cid.lower()] = cid
        for a in c.get("aliases", []):
            resolver[a.lower()] = cid
        for m in c.get("source_mappings", []):
            resolver[m["label"].lower()] = cid
    return resolver


def norm_disease(name: str) -> str:
    n = re.sub(r"\(.*?\)", "", name.lower())
    n = re.sub(r"[^a-z0-9 ]", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def load_disease_to_syndrome(map_js: Path):
    content = map_js.read_text(encoding="utf-8")
    start = content.index("{", content.index("SYNDROME_TO_ONTOLOGY_MAP"))
    depth = 0
    for i in range(start, len(content)):
        if content[i] == "{":
            depth += 1
        elif content[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    mapping = json.loads(content[start:end])
    d2s = {}
    for syndrome, info in mapping.items():
        for diff in info.get("differentials", []):
            d2s[norm_disease(diff)] = syndrome
    return d2s


def resolve_syndrome(label, d2s):
    n = norm_disease(label)
    if n in d2s:
        return d2s[n]
    for k, s in d2s.items():
        if k and (k in n or n in k):
            return s
    return None


def build_profiles(root: Path):
    resolver = load_concept_resolver(root / "frontend-v2" / "src" / "data" / "concept_canonical_map.json")
    d2s = load_disease_to_syndrome(root / "frontend-v2" / "src" / "engine" / "syndrome_to_ontology_map.js")
    df = pd.read_csv(root / "data" / "derm1m" / "concept.csv").dropna(subset=["disease_label", "skin_concept"])

    n_s = defaultdict(int)
    n_fs = defaultdict(lambda: defaultdict(int))
    features = set()
    for disease, concept_raw in zip(df["disease_label"], df["skin_concept"]):
        s = resolve_syndrome(disease, d2s)
        if s is None:
            continue
        feats = {resolver.get(c.strip()) for c in str(concept_raw).lower().split(",")}
        feats.discard(None)
        n_s[s] += 1
        for f in feats:
            n_fs[f][s] += 1
            features.add(f)

    # P(f|s) con Laplace; prior P(s)
    p_f_given_s = {s: {} for s in n_s}
    for f in features:
        for s in n_s:
            p_f_given_s[s][f] = (n_fs[f][s] + ALPHA) / (n_s[s] + 2 * ALPHA)
    total = sum(n_s.values())
    prior = {s: n_s[s] / total for s in n_s}
    return p_f_given_s, prior, sorted(features), n_s


def classify(present, p_f_given_s, prior, features):
    present = set(present)
    scores = {}
    for s in prior:
        lp = math.log(prior[s])
        for f in features:
            p = min(max(p_f_given_s[s][f], 1e-6), 1 - 1e-6)
            lp += math.log(p) if f in present else math.log(1 - p)
        scores[s] = lp
    m = max(scores.values())
    exps = {s: math.exp(v - m) for s, v in scores.items()}
    z = sum(exps.values())
    probs = {s: v / z for s, v in exps.items()}
    ranked = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)
    return ranked


CASES = {
    "Ampolloso (ampolla+mucosas+erosion)": ["bula_ampolla", "mucosas", "erosion"],
    "Psoriasis (placa+escama+eritema)": ["placa", "escama", "eritema"],
    "Pigmentario (macula+hiperpigmentacion)": ["macula", "hiperpigmentacion"],
    "Urticaria (habon)": ["habon"],
    "Tumor (nodulo+ulcera)": ["nodulo", "ulcera"],
}


def main():
    root = repo_root()
    p_f_given_s, prior, features, n_s = build_profiles(root)
    print(f"Perfiles construidos: {len(prior)} sindromes, {len(features)} features (de Derm1M)\n")
    for name, present in CASES.items():
        ranked = classify(present, p_f_given_s, prior, features)
        top2 = ", ".join(f"{s} {p*100:.0f}%" for s, p in ranked[:2])
        print(f"{name}")
        print(f"   BAYES -> {top2}")


if __name__ == "__main__":
    main()
