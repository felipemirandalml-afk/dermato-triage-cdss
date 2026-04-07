import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationES from './locales/es.json';

const resources = {
  es: {
    translation: translationES
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // Predeterminado
    fallbackLng: "es",
    interpolation: {
      escapeValue: false // react ya se encarga de escapar
    }
  });

export default i18n;
