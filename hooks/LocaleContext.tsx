// hooks/LocaleContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import enTexts from "../locales/en.json";
import ptTexts from "../locales/pt.json";
import { SUPPORTED_LOCALES } from "../constants/locales";

type Texts = typeof enTexts;

type LocaleContextType = {
  locale: string;
  texts: Texts;
  changeLocale: (newLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState("en");
  const [texts, setTexts] = useState<Texts>(enTexts);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("locale");
      const browserLang = navigator.language.split("-")[0];
      const initialLocale = stored || (SUPPORTED_LOCALES[browserLang] ? browserLang : "en");
      setLocale(initialLocale);
      setTexts(initialLocale === "pt" ? ptTexts : enTexts);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    if (SUPPORTED_LOCALES[newLocale]) {
      setLocale(newLocale);
      setTexts(newLocale === "pt" ? ptTexts : enTexts);
      localStorage.setItem("locale", newLocale);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, texts, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within a LocaleProvider");
  return context;
};
