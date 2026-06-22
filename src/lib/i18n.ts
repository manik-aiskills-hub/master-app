export type Language = "en" | "de";

const translations = {
  en: {
    // Nav
    "nav.learn": "Learn",
    "nav.quiz": "Quiz",
    "nav.exam": "Exam",
    "nav.progress": "Progress",
    "nav.settings": "Settings",
    // Home
    "home.title": "German B1 Planner",
    "home.subtitle": "30-day telc B1 exam preparation",
    // Settings
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.language": "Language",
    "settings.examDate": "Exam Date",
    "settings.examDate.placeholder": "Select your exam date",
    "settings.daysLeft": "days left",
    "settings.pace": "Pace",
    "settings.pace.relaxed": "Relaxed",
    "settings.pace.normal": "Normal",
    "settings.pace.intense": "Intense",
    "settings.pace.cramming": "Cramming!",
    "settings.saved": "Settings saved",
  },
  de: {
    "nav.learn": "Lernen",
    "nav.quiz": "Quiz",
    "nav.exam": "Prüfung",
    "nav.progress": "Fortschritt",
    "nav.settings": "Einstellungen",
    "home.title": "Deutsch B1 Planer",
    "home.subtitle": "30-Tage telc B1 Prüfungsvorbereitung",
    "settings.title": "Einstellungen",
    "settings.theme": "Design",
    "settings.theme.light": "Hell",
    "settings.theme.dark": "Dunkel",
    "settings.language": "Sprache",
    "settings.examDate": "Prüfungsdatum",
    "settings.examDate.placeholder": "Prüfungsdatum wählen",
    "settings.daysLeft": "Tage übrig",
    "settings.pace": "Tempo",
    "settings.pace.relaxed": "Entspannt",
    "settings.pace.normal": "Normal",
    "settings.pace.intense": "Intensiv",
    "settings.pace.cramming": "Pauken!",
    "settings.saved": "Einstellungen gespeichert",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? key;
}

export { translations };
