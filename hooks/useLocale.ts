import { useState, useEffect } from "react";
import { SUPPORTED_LOCALES as LOCALES } from "../constants/locales";

type Texts = Record<string, any>;

export default function useLocale() {
  const [locale, setLocale] = useState<string>("en");
  const [texts, setTexts] = useState<Texts>({});

  const loadLocaleTexts = async (loc: string) => {
    try {
      const module = await import(`../locales/${loc}.json`);
      setTexts(module.default);
    } catch (err) {
      console.warn(`Locale "${loc}" not found, falling back to English.`);
      const module = await import(`../locales/en.json`);
      setTexts(module.default);
    }
  };

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    const browserLang = typeof window !== "undefined" ? navigator.language.split("-")[0] : "en";
    const initialLocale = stored || (LOCALES[browserLang] ? browserLang : "en");
    setLocale(initialLocale);
    loadLocaleTexts(initialLocale);
  }, []);

  const changeLocale = (newLocale: string) => {
    if (!LOCALES[newLocale]) return;
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    loadLocaleTexts(newLocale);
  };

  return { locale, texts, changeLocale, SUPPORTED_LOCALES: LOCALES };
}
