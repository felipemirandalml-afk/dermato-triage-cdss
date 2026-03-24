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

        // 2. Traducciones Locales de Sistema y Fase 6 (Precedencia Máxima)
        const sysAliases = {
            'signo_fiebre': 'fiebre', 'fiebre_si': 'fiebre', 'signo_dolor': 'dolor', 'dolor_si': 'dolor', 'riesgo_metabolico': 'diabetes',
            'abcde': 'signo_abcde', 'flexural_pliegues': 'topo_flexural_pliegues', 'friccion_extensora': 'topo_friccion_extensora',
            'lesion_macula': 'macula', 'lesion_mancha': 'mancha', 'lesion_papula': 'papula', 'lesion_placa': 'placa',
            'lesion_vesicula': 'vesicula', 'lesion_pustula': 'pustula', 'lesion_bula': 'bula_ampolla', 'bula': 'bula_ampolla', 'lesion_ampolla': 'bula_ampolla', 'ampolla': 'bula_ampolla',
            'lesion_habon': 'habon', 'lesion_nodulo': 'nodulo', 'lesion_ulcera': 'ulcera', 'lesion_costra': 'costra',
            'lesion_escama': 'escama', 'lesion_escara': 'escara', 'lesion_atrofia': 'atrofia', 'lesion_liquenificacion': 'liquenificacion',
            'lesion_cicatriz': 'cicatriz', 'lesion_comedon': 'comedon', 'lesion_surco': 'surco', 'lesion_quiste': 'quiste',
            'lesion_erosion': 'erosion', 'lesion_excoriacion': 'excoriacion', 'lesion_induracion': 'induracion', 'lesion_purpura': 'purpura',
            'lesion_tumor': 'tumor', 'lesion_eritema': 'eritema', 'lesion_hiperpigmentacion': 'hiperpigmentacion', 'lesion_hipopigmentacion': 'hipopigmentacion',
            'evanescente': 'lesion_evanescente', 'umbilicacion': 'umbilicacion', 'cupuliforme': 'cupuliforme',
            
            'antecedente_inmunosupresion': 'inmunosupresion', 'antecedente_diabetes': 'diabetes', 'antecedente_atopia': 'atopia',
            'antecedente_embarazo': 'embarazo', 'antecedente_hepatopatia': 'hepatopatia', 'antecedente_neoplasia': 'antecedente_neoplasia',
            'antecedente_autoinmune': 'antecedente_autoinmune', 'antecedente_obesidad': 'antecedente_obesidad', 'antecedente_trauma': 'antecedente_trauma',
            'antecedente_quimico': 'antecedente_quimico', 'antecedente_viaje': 'antecedente_viaje', 'antecedente_eii': 'antecedente_eii',
            
            'patron_agudo': 'agudo', 'patron_subagudo': 'subagudo', 'patron_cronico': 'cronico', 'patron_dermatomal': 'dermatomal',
            
            // Re-mapeos funcionales de Fase 6
            'cabeza': 'cabeza', 'topog_cabeza': 'cabeza',
            'cara_centro': 'cara_centro', 'topo_cara_centro': 'cara_centro',
            'cuello': 'cabeza', 'topo_cuello': 'cabeza', 'cuero_cabelludo': 'cabeza', 'topo_cuero_cabelludo': 'cabeza',
            'tronco': 'tronco', 'topog_tronco': 'tronco', 'pecho': 'tronco', 'topo_pecho': 'tronco', 'abdomen': 'tronco', 'topo_abdomen': 'tronco', 'espalda': 'tronco', 'topo_espalda': 'tronco',
            'axilas': 'topo_flexural_pliegues', 'topo_axilas': 'topo_flexural_pliegues',
            'inguinal': 'topo_flexural_pliegues', 'topo_inguinal': 'topo_flexural_pliegues',
            'topo_submamario': 'topo_flexural_pliegues', 'intertriginoso': 'topo_flexural_pliegues', 'flexural': 'topo_flexural_pliegues',
            'extremidad_superior': 'extremidad_superior', 'ext_sup': 'extremidad_superior', 'topog_ext_sup': 'extremidad_superior', 'hombros': 'extremidad_superior', 'topo_hombros': 'extremidad_superior', 'brazos': 'extremidad_superior', 'topo_brazos': 'extremidad_superior', 'antebrazos': 'extremidad_superior', 'topo_antebrazos': 'extremidad_superior',
            'codos': 'topo_friccion_extensora', 'topo_codos': 'topo_friccion_extensora', 'extensor': 'topo_friccion_extensora',
            'manos': 'extremidad_superior', 'topo_manos': 'extremidad_superior', 'dorso_manos': 'extremidad_superior', 'topo_dorso_manos': 'extremidad_superior',
            'palmas': 'pies', 'topo_palmas': 'pies',
            'extremidad_inferior': 'extremidad_inferior', 'ext_inf': 'extremidad_inferior', 'topog_ext_inf': 'extremidad_inferior', 'muslos': 'extremidad_inferior', 'topo_muslos': 'extremidad_inferior', 'espinillas': 'extremidad_inferior', 'topo_espinillas': 'extremidad_inferior', 'pantorrillas': 'extremidad_inferior', 'topo_pantorrillas': 'extremidad_inferior', 'tobillos': 'extremidad_inferior', 'topo_tobillos': 'extremidad_inferior',
            'rodillas': 'topo_friccion_extensora', 'topo_rodillas': 'topo_friccion_extensora',
            'pies': 'pies', 'topo_pies': 'pies', 'plantas': 'pies', 'topo_plantas': 'pies', 'dorso_pies': 'extremidad_inferior', 'topo_dorso_pies': 'extremidad_inferior',
            
            'acral': 'acral', 'patron_acral': 'acral',
            'mucosas': 'mucosas', 'signo_mucosas': 'mucosas',
            'zosteriforme': 'dermatomal', 'dermatomal': 'dermatomal',
            
            'patron_simetrico': 'simetrico', 'patron_lineal': 'lineal'
        };
        if (sysAliases[id]) return sysAliases[id];

        // 3. Intento de resolución vía Alias del Mapa Canónico
        if (this.aliasToCanonical.has(id)) return this.aliasToCanonical.get(id);

        // 4. Intento de resolución vía Source Mapping (Derm1M/SkinCon)
        if (this.labelToCanonical.has(id)) return this.labelToCanonical.get(id);

        // 5. Devolver la ID limpia si está en la ontología base
        return id;
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
