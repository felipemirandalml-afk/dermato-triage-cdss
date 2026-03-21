/**
 * concept_mapper.js - Motor de Resolución de Conceptos Canónicos
 * Centraliza la relación entre Datasets (Derm1M, SkinCon) y el Motor de DermatoTriage.
 */

import CANONICAL_MAP_DATA from '../data/concept_canonical_map.json' with { type: 'json' };

/**
 * Provee acceso y resolución al mapa canónico de conceptos.
 */
class ConceptMapper {
    constructor() {
        this.cache = new Map();
        this.labelToCanonical = new Map();
        this.aliasToCanonical = new Map();
        this._initialize();
    }

    _initialize() {
        CANONICAL_MAP_DATA.concepts.forEach(concept => {
            const id = concept.canonical_id;
            this.cache.set(id, concept);

            // Mapeo desde etiquetas de datasets (Derm1M, SkinCon)
            concept.source_mappings.forEach(m => {
                this.labelToCanonical.set(m.label.toLowerCase(), id);
            });

            // Mapeo desde aliases de sistema (legacy)
            concept.aliases.forEach(alias => {
                this.aliasToCanonical.set(alias.toLowerCase(), id);
            });
            
            // Auto-mapeo del propio ID
            this.aliasToCanonical.set(id.toLowerCase(), id);
        });
    }

    /**
     * Resuelve un ID de entrada (UI o Dataset) a su representación canónica interna.
     * @param {string} inputId - ID proveniente de UI (ej: lesion_papula) o datasets (ej: Papule)
     * @returns {string|null} ID canónico si existe, null en caso de no resolución
     */
    resolve(inputId) {
        if (!inputId) return null;
        let id = inputId.toLowerCase().trim();
        
        // 1. Limpieza de prefijos comunes de la UI (lesion_, topog_, etc.)
        const uiPrefixes = ['lesion_', 'topog_', 'topo_', 'patron_', 'signo_', 'antecedente_'];
        for (const prefix of uiPrefixes) {
            if (id.startsWith(prefix)) {
                id = id.substring(prefix.length);
                break;
            }
        }

        // 2. Intento de resolución vía Alias del Mapa Canónico
        if (this.aliasToCanonical.has(id)) return this.aliasToCanonical.get(id);

        // 3. Intento de resolución vía Source Mapping (Derm1M/SkinCon)
        if (this.labelToCanonical.has(id)) return this.labelToCanonical.get(id);

        return null;
    }

    /**
     * Obtiene la metadata completa de un concepto canónico.
     */
    getConcept(id) {
        return this.cache.get(id) || null;
    }

    /**
     * Retorna todos los IDs canónicos registrados.
     */
    getAllCanonicalIds() {
        return Array.from(this.cache.keys());
    }
}

// Singleton para el sistema
export const conceptMapper = new ConceptMapper();
export default conceptMapper;
