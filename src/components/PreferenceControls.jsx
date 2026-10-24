import { Languages, Moon, Sun } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';

export default function PreferenceControls({ className = '' }) {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  return (
    <div className={`preference-controls ${className}`} aria-label={t('Application preferences')}>
      <button
        type="button"
        className="preference-theme-button"
        onClick={toggleTheme}
        aria-label={t(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')}
        title={t(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <label className="preference-language-control">
        <Languages size={17} aria-hidden="true" />
        <span className="sr-only">{t('Language')}</span>
        <select value={language} onChange={event => setLanguage(event.target.value)} aria-label={t('Language')}>
          <option value="en">English</option>
          <option value="te">తెలుగు</option>
          <option value="hi">हिन्दी</option>
        </select>
      </label>
    </div>
  );
}
