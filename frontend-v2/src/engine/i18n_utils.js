/**
 * i18n_utils.js - Diccionario liviano para el engine
 * Permite manejar strings multi-idioma sin dependencias pesadas en la capa de lógica.
 */

const DICTIONARY = {
    es: {
        'safety.ocular_risk': "Riesgo Ocular / Compromiso de Cara Centrofacial",
        'safety.ischemia': "Signos de Isquemia o Necrosis Tisular Aguda",
        'safety.blister_autoimmune': "Sospecha de Dermatosis Ampollosa o Compromiso Sistémico",
        'safety.nikolsky': "Signo de Nikolsky Positivo Agudo (Posible Síndrome de Piel Escaldada / NET)",
        'safety.malignancy': "Sospecha de Lesión Maligna / Neoplasia (P2-Shield)",
        'safety.acral': "Reacción Acral Aguda (Estudio de Gatillante)",
        'safety.suppurative': "Inflamación Supurativa / Fístulas Crónicas",
        'safety.drug_rash': "Exantema Medicamentoso Simple (Vigilancia Estándar)",
        'ui.alert_security': "[Alerta de Seguridad]",
        'ui.alert_mismatch': "[Alerta de Discordancia]",
        'ui.priority_based_on': "Priorización basada en",
        'ui.front_findings': "Frente a hallazgos de",
        'rf.mucosa': "Compromiso de Mucosas (Riesgo SJS/NET)",
        'rf.fever': "Fiebre / Respuesta Inflamatoria Sistémica",
        'rf.pain': "Dolor Intenso (Sospecha de Infección Profunda/Necrosis)",
        'rf.blister': "Dermatosis Ampollosa / Bulas",
        'rf.purpura': "Púrpura Palpable (Sospecha Vasculitis)",
        'rf.immuno': "Paciente Inmunocompromedido",
        'rf.drugs': "Antecedente de Fármacos Sistémicos Críticos"
    }
};

export function t(key, lang = 'es') {
    return DICTIONARY[lang]?.[key] || key;
}
