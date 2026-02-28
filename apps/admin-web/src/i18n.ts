import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";

const STORAGE_KEY = "lot-lang";

function detectLanguage(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  };
  const browserLang = navigator.language;
  return browserLang.startsWith("zh") ? "zh-CN" : "en";
}

i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": { translation: zhCN },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: "zh-CN",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

export default i18n;
