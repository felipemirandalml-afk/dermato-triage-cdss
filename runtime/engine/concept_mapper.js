/**
 * concept_mapper.js - Motor de Resolución de Conceptos Canónicos
 * Centraliza la relación entre UI, Datasets y el Motor de DermatoTriage.
 * Implementación basada en Clinical Schema SSoT v1.0.
 */

import SCHEMA_DATA from '../data/concept_canonical_map.json' with { type: 'json' };

/**
 * Provee resolución explícita de conceptos basada en el schema canónico.
 */
class ConceptMapper {
    constructor() {
        this.lookup = new Map();
        this.metadata = new Map();
        this._initialize();
    }

    _initialize() {
        if (!SCHEMA_DATA || !SCHEMA_DATA.concepts) {
            console.error("ConceptMapper: Schema data invalid or missing.");
            return;
        }

        SCHEMA_DATA.concepts.forEach(feature => {
            const canonical = feature.canonical_id;
            this.metadata.set(canonical, feature);

            // 1. Registro del ID Canónico
            this.lookup.set(canonical.toLowerCase(), canonical);

            // 2. Registro de Aliases de Sistema y Dataset (Equivalencia Semántica)
            if (feature.aliases) {
                feature.aliases.forEach(alias => {
                    this.lookup.set(alias.toLowerCase(), canonical);
                });
            }

            // 3. Registro de Aliases de Entrenamiento (Retrocompatibilidad Datasets)
            if (feature.training_aliases) {
                feature.training_aliases.forEach(alias => {
                    this.lookup.set(alias.toLowerCase(), canonical);
                });
            }
        });
    }

    /**
     * Resuelve un ID de entrada a su representación canónica interna.
     * Cero heurísticas: Solo se resuelve lo que está explícitamente en el schema.
     * 
     * @param {string} inputId - ID proveniente de UI o datasets.
     * @returns {string|null} ID canónico si existe, null en caso contrario.
     */
    resolve(inputId) {
        if (!inputId) return null;
        const normalized = inputId.toLowerCase().trim();
        return this.lookup.get(normalized) || null;
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
