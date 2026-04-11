/**
 * i18n_utils.js - Diccionario liviano para el engine.
 */

const DICTIONARY = {
    es: {
        'safety.ocular_risk': 'Riesgo ocular / compromiso de cara centrofacial',
        'safety.ischemia': 'Signos de isquemia o necrosis tisular aguda',
        'safety.blister_autoimmune': 'Sospecha de dermatosis ampollosa o compromiso sistemico',
        'safety.nikolsky': 'Signo de Nikolsky positivo agudo (posible sindrome de piel escaldada / NET)',
        'safety.malignancy': 'Sospecha de lesion maligna / neoplasia (P2-Shield)',
        'safety.acral': 'Reaccion acral aguda (estudio de gatillante)',
        'safety.suppurative': 'Inflamacion supurativa / fistulas cronicas',
        'safety.erythroderma': 'Eritrodermia grave (riesgo hemodinamico/metabolico)',
        'safety.lpp_nail': 'LPP/Compromiso ungueal (urgencia para evitar secuelas permanentes)',
        'safety.respiratory': 'Compromiso respiratorio / angioedema (riesgo vital)',
        'safety.systemic_shock': 'Signos sistemicos de shock / inestabilidad',
        'ui.alert_security': '[Alerta de seguridad]',
        'ui.alert_mismatch': '[Alerta de discordancia]',
        'ui.priority_based_on': 'Priorizacion basada en',
        'ui.front_findings': 'Frente a hallazgos de',
        'rf.mucosa': 'Compromiso de mucosas (riesgo SJS/NET)',
        'rf.fever': 'Fiebre / respuesta inflamatoria sistemica',
        'rf.pain': 'Dolor intenso (sospecha de infeccion profunda/necrosis)',
        'rf.blister': 'Dermatosis ampollosa / bulas',
        'rf.purpura': 'Purpura palpable (sospecha vasculitis)',
        'rf.immuno': 'Paciente inmunocomprometido',
        'rf.drugs': 'Antecedente de farmacos sistemicos criticos',
        'rf.angioedema': 'Angioedema / dificultad respiratoria',
        'rf.consciousness': 'Alteracion del nivel de conciencia'
    }
};

export function t(key, lang = 'es') {
    return DICTIONARY[lang]?.[key] || key;
}
