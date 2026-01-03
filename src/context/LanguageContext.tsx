import { createContext, useContext, useState, ReactNode } from "react";

type LanguageContextType = {
  lang: "en" | "ta";
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<"en" | "ta">("en");

  const toggleLang = () => setLang(prev => (prev === "en" ? "ta" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
