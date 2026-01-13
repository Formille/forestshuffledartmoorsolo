import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import koTranslations from '../locales/ko.json'
import enTranslations from '../locales/en.json'

const resources = {
  ko: {
    translation: koTranslations
  },
  en: {
    translation: enTranslations
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('dartmoor-language') || 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

