import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const LANGUAGE_KEY = 'roadguard.landing.language';
const THEME_KEY = 'roadguard.landing.theme';
const languages = ['en', 'te', 'hi'];
const themes = ['dark', 'light'];
const PreferencesContext = createContext(null);

function readPreference(key, allowed, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function PreferencesProvider({ children }) {
  const [language, setLanguage] = useState(() => readPreference(LANGUAGE_KEY, languages, 'en'));
  const [theme, setTheme] = useState(() => readPreference(THEME_KEY, themes, 'dark'));

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Preferences continue to apply for this session if storage is unavailable.
    }
  }, [language, theme]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme: () => setTheme(current => current === 'dark' ? 'light' : 'dark'),
    t: (key, values = {}) => {
      let text = translations[language]?.[key] || key;
      for (const [name, replacement] of Object.entries(values)) {
        text = text.replaceAll(`{${name}}`, String(replacement));
      }
      return text;
    }
  }), [language, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
