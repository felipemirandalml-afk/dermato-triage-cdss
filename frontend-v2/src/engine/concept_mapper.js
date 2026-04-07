/**
 * concept_mapper.js - Motor de Resolución de Conceptos Canónicos
 * Centraliza la relación entre UI, Datasets y el Motor de DermatoTriage.
 * Implementación basada en Clinical Schema SSoT v2.0 (Fuzzy Matching added).
 */

import SCHEMA_DATA from '../data/concept_canonical_map.json' with { type: 'json' };

/**
 * Provee resolución de conceptos basada en el schema canónico con soporte para variaciones.
 */
class ConceptMapper {
    constructor() {
        this.lookup = new Map();
        this.fuzzyLookup = new Map(); // Para coincidencias normalizadas
        this.metadata = new Map();
        this._initialize();
    }

    /**
     * Normaliza un string para comparaciones robustas:
     * - Elimina acentos
     * - Convierte a minúsculas
     * - Elimina plurales básicos ('s' final)
     * - Normaliza separadores a guiones bajos
     */
    static normalize(text) {
        if (!text) return "";
        return text.toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace(/[ \-]/g, "_")         // Espacios y guiones a snake_case
            .replace(/s$/g, "")             // Eliminar plural simple
            .trim();
    }

    _initialize() {
        if (!SCHEMA_DATA || !SCHEMA_DATA.concepts) {
            console.error("ConceptMapper: Schema data invalid or missing.");
            return;
        }

        SCHEMA_DATA.concepts.forEach(feature => {
            const canonical = feature.canonical_id;
            this.metadata.set(canonical, feature);

            // Registro de IDs, Alisases y Training Aliases
            const allKeys = [
                canonical,
                ...(feature.aliases || []),
                ...(feature.training_aliases || [])
            ];

            allKeys.forEach(rawKey => {
                const k = rawKey.toLowerCase().trim();
                
                // 1. Registro exacto (Prioritario)
                if (!this.lookup.has(k)) {
                    this.lookup.set(k, canonical);
                }

                // 2. Registro Fuzzy (Normalizado)
                const fuzzyK = ConceptMapper.normalize(k);
                if (!this.fuzzyLookup.has(fuzzyK)) {
                    this.fuzzyLookup.set(fuzzyK, canonical);
                }
            });
        });
    }

    /**
     * Resuelve un ID de entrada a su representación canónica interna.
     * 
     * @param {string} inputId - ID proveniente de UI o datasets.
     * @returns {string|null} ID canónico si existe, null en caso contrario.
     */
    resolve(inputId) {
        if (!inputId) return null;
        
        const raw = inputId.toLowerCase().trim();
        
        // 1. Camino rápido: Coincidencia exacta/alias
        if (this.lookup.has(raw)) return this.lookup.get(raw);
        
        // 2. Camino fuzzy: Normalización avanzada
        const fuzzy = ConceptMapper.normalize(raw);
        if (this.fuzzyLookup.has(fuzzy)) return this.fuzzyLookup.get(fuzzy);

        return null;
    }

    /**
     * Obtiene la metadata completa de un concepto canónico.
     */
    getFeature(canonicalId) {
        return this.metadata.get(canonicalId) || null;
    }

    /**
     * Retorna todos los IDs canónicos registrados.
     */
    getAllCanonicalIds() {
        return Array.from(this.metadata.keys());
    }
}

// Singleton para el sistema
export const conceptMapper = new ConceptMapper();
export default conceptMapper;
