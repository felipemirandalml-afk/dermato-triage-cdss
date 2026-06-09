/**
 * safety_modifiers.js - Reglas de seguridad basadas en morfologia y senales criticas.
 */
import { t } from './i18n_utils.js';

export function applySafetyModifiers(helper, currentResult) {
    const { has } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    if (has('topog_cabeza') && has('topo_cara_centro') && (has('vesicula') || has('dolor'))) {
        const desc = t('safety.ocular_risk');
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    if ((has('escara') || has('ulcera') || has('purpura')) && has('agudo')) {
        const desc = t('safety.ischemia');
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    if (
        (has('bula_ampolla') || has('erosion') || has('ampolla_nikolsky')) &&
        (has('mucosas') || has('dolor') || has('generalizado') || has('patron_seborreica') || has('ampolla_nikolsky')) &&
        !has('cronico')
    ) {
        const desc = t('safety.blister_autoimmune');
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    if (has('eritema') && (has('escama') || has('costra')) && has('generalizado')) {
        const desc = t('safety.erythroderma');
        rules.push(`[ALERTA] ${desc}`);
        priority = 1;
        modifier = desc;
    }

    if ((has('ampolla_nikolsky') || has('despegamiento_epidermico')) && has('agudo')) {
        const desc = t('safety.nikolsky');
        rules.push(`[ALERTA] ${desc}`);
        priority = 1;
        modifier = desc;
    }

    if (has('signo_hipotension') || has('compromiso_conciencia')) {
        const desc = t('safety.systemic_shock');
        rules.push(`[ALERTA] ${desc}`);
        priority = 1;
        modifier = desc;
    }

    if (has('necrosis_isquemia')) {
        const desc = t('safety.ischemia');
        rules.push(`[ALERTA] ${desc}`);
        priority = 1;
        modifier = desc;
    }

    // Infección/inflamación sistémica aguda (celulitis, erisipela, fascitis, impétigo
    // sobreinfectado): fiebre + cuadro agudo + signo inflamatorio/supurativo o dolor.
    // SSMSO 4.x: "fiebre alta + CEG" y "dolor desproporcionado" → urgencia.
    if (has('fiebre') && has('agudo') && (has('dolor') || has('pustula') || has('costra'))) {
        const desc = 'Sospecha de infeccion/inflamacion sistemica aguda (fiebre + cuadro agudo)';
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) { priority = 1; modifier = desc; }
    }

    // Farmacodermia grave / DRESS: fiebre + fármaco reciente + extensión/agudo.
    // Guías farmacodermia: fiebre alta + CEG → urgencia.
    if (has('fiebre') && has('farmacos_recientes') && (has('generalizado') || has('agudo'))) {
        const desc = 'Sospecha de farmacodermia grave / DRESS (fiebre + farmaco reciente)';
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) { priority = 1; modifier = desc; }
    }

    // Eccema herpético (erupción variceliforme de Kaposi): vesículas + fiebre +
    // umbilicación/erosión. Emergencia dermatológica.
    if (has('vesicula') && has('fiebre') && (has('umbilicacion') || has('erosion'))) {
        const desc = 'Sospecha de eccema herpetico (vesiculas umbilicadas + fiebre)';
        rules.push(`[ALERTA] ${desc}`);
        if (priority > 1) { priority = 1; modifier = desc; }
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}

export function applyBlockModifiers(helper, currentResult) {
    const { has } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    const isSuspectTime = has('cronico') || has('subagudo');
    const isMalignantLesion = has('nodulo') || has('tumor') || has('ulcera') || has('signo_abcde');
    const isElderly = helper.get && helper.get('edad') >= 65;
    const isFaceNodule = has('topog_cabeza') && has('topo_cara_centro') && has('nodulo');

    if (has('signo_abcde') || (isSuspectTime && isMalignantLesion) || (isElderly && isFaceNodule)) {
        const desc = t('safety.malignancy');
        rules.push(`[BLOQUEO] ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    if (has('patron_acral') && has('agudo')) {
        const desc = t('safety.acral');
        rules.push(`[BLOQUEO] ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    if (has('fistulas_supuracion')) {
        const desc = t('safety.suppurative');
        rules.push(`[BLOQUEO] ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    if (priority === 1 && has('farmacos_recientes') && !has('fiebre') && !has('dolor') && !has('mucosas') && !has('bula_ampolla')) {
        const desc = t('safety.drug_rash');
        rules.push(`[AJUSTE] ${desc}`);
        priority = 2;
        modifier = desc;
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}
