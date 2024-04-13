import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}

export const resources = {
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI
  },
  en: {
    home: HOME_EN,
    product: PRODUCT_EN
  }
}

export const defaultNS = 'home'

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: resources,
  ns: ['home', 'product'],
  defaultNS,
  fallbackLng: 'vi',
  lng: 'vi',
  interpolation: {
    escapeValue: false
  }
})
