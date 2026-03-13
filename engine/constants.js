/**
 * constants.js - Diccionarios maestros y configuraciones del motor
 */

const featureGroups = {
    basics: ['edad', 'fototipo', 'sexo_male', 'sexo_female'],
    red_flags: ['inmunosupresion', 'farmacos_recientes', 'riesgo_metabolico', 'signo_fiebre', 'signo_dolor', 'signo_mucosas'],
    primarias: ['lesion_macula', 'lesion_mancha', 'lesion_papula', 'lesion_placa', 'lesion_nodulo', 'lesion_habon', 'lesion_eritema', 'lesion_purpura', 'lesion_telangiectasia', 'lesion_comedon', 'lesion_quiste', 'lesion_tumor', 'lesion_vegetacion'],
    liquidas: ['lesion_vesicula', 'lesion_ampolla', 'lesion_bula', 'lesion_pustula'],
    secundarias: ['lesion_escama', 'lesion_costra', 'lesion_escara', 'lesion_erosion', 'lesion_ulcera', 'lesion_excoriacion', 'lesion_fisura', 'lesion_atrofia', 'lesion_esclerosis', 'lesion_liquenificacion', 'lesion_cicatriz'],
    topografia: [
        'topog_cabeza', 'topo_cuero_cabelludo', 'topo_cara_centro', 'topo_cuello',
        'topog_tronco', 'topo_pecho', 'topo_abdomen', 'topo_espalda', 'topo_axilas',
        'topog_ext_sup', 'topo_hombros', 'topo_brazos', 'topo_codos', 'topo_antebrazos', 'topo_manos', 'topo_dorso_manos', 'topo_palmas',
        'topog_ext_inf', 'topo_muslos', 'topo_rodillas', 'topo_espinillas', 'topo_pantorrillas', 'topo_tobillos', 'topo_pies', 'topo_plantas', 'topo_dorso_pies'
    ],
    patrones: ['patron_acral', 'patron_dermatomal', 'patron_seborreica', 'patron_fotoexpuesto', 'patron_simetrico', 'patron_extensoras', 'patron_flexoras', 'patron_generalizado'],
    timing: ['tiempo_agudo', 'tiempo_subagudo', 'tiempo_cronico'],
    extended_context: [
        'antecedente_neoplasia', 'antecedente_autoinmune', 'antecedente_hepatopatia',
        'antecedente_obesidad', 'antecedente_trauma', 'antecedente_quimico',
        'antecedente_viaje', 'antecedente_eii', 'antecedente_atopia', 'antecedente_embarazo'
    ]
};

export const FEATURE_INDEX = {};
let i = 0;
Object.values(featureGroups).flat().forEach(f => {
    FEATURE_INDEX[f] = i++;
});

export const FEATURE_MAP_LABELS = {
    farmacos_recientes: "Exposición a Fármacos Sistémicos",
    signo_fiebre: "Respuesta Inflamatoria Sistémica",
    lesion_ampolla: "Formación de Ampollas",
    lesion_bula: "Dermatosis Ampollosa Mayor",
    lesion_ulcera: "Pérdida de Continuidad Tisular",
    lesion_purpura: "Extravasación Hemática (Púrpura)",
    patron_generalizado: "Compromiso Extenso de Superficie",
    tiempo_agudo: "Instauración Hiperaguda",
    inmunosupresion: "Estado de Inmunocompromiso",
    tiempo_cronico: "Evolución Crónica (>6 sem)",
    lesion_escama: "Descamación Superficial",
    signo_dolor: "Dolor Intenso / Progresivo",
    signo_mucosas: "Compromiso de Mucosas",
    lesion_nodulo: "Lesión Nodular",
    lesion_tumor: "Lesión Tumoral / Masa",
    lesion_erosion: "Erosiones Cutáneas",
    lesion_comedon: "Comedón (Cerrado/Abierto)",
    antecedente_neoplasia: "Antecedente de Neoplasia",
    antecedente_autoinmune: "Condición Autoinmune",
    antecedente_hepatopatia: "Hepatopatía Crónica",
    antecedente_obesidad: "Obesidad (IMC > 30)",
    antecedente_trauma: "Trauma o Herida Reciente",
    antecedente_quimico: "Exposición a Irritantes",
    antecedente_viaje: "Viaje a Zona Tropical",
    antecedente_eii: "Enfermedad Inflamatoria Intestinal",
    antecedente_atopia: "Perfil Atópico",
    antecedente_embarazo: "Estado de Embarazo"
};

export const CLINICAL_GUI = {
    recommendations: {
        1: {
            conduct: "Evaluación urgente / Derivación inmediata a Servicio de Urgencias.",
            timeframe: "Inmediato (Hoy)",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        2: {
            conduct: "Derivación prioritaria a Dermatología o evaluación preferente por especialista.",
            timeframe: "Plazo Corto (7-14 días)",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        3: {
            conduct: "Manejo ambulatorio estándar / Control programado o seguimiento por medicina general.",
            timeframe: "Diferible (Según disponibilidad)",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    },
    warnings: "Esta herramienta es un apoyo a la decisión clínica y no reemplaza el juicio médico presencial. Si el paciente presenta compromiso hemodinámico o insuficiencia respiratoria, actúe según protocolo de emergencia independientemente del resultado."
};

export const PRIORITY_LABELS = {
    1: "URGENCIAL",
    2: "PRIORITARIO",
    3: "ESTABLE"
};
