/**
 * i18n_utils.js - Adaptador de i18n para el engine (framework-agnostic).
 *
 * El engine corre fuera de React (también en scripts Node), por lo que no puede
 * usar el hook useTranslation de react-i18next. Este adaptador lee la MISMA
 * fuente de verdad (i18n/locales/<lang>.json) que usa react-i18next, resolviendo
 * claves con notación de punto (ej. 'safety.ocular_risk'). Así no hay diccionario
 * duplicado: un solo JSON alimenta tanto la UI como el engine.
 */
import esLocale from '../i18n/locales/es.json' with { type: 'json' };

const LOCALES = { es: esLocale };

function resolveKey(dict, key) {
    return key.split('.').reduce((acc, part) => (acc != null ? acc[part] : undefined), dict);
}

export function t(key, lang = 'es') {
    const dict = LOCALES[lang] || LOCALES.es;
    const value = resolveKey(dict, key);
    return typeof value === 'string' ? value : key;
}
