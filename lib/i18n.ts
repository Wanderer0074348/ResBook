export const translations = {
  en: {
    nav: {
      home: "Home",
      tools: "Tools",
      workflows: "Workflows",
      dotfiles: "Dotfiles",
      compare: "Compare",
      collections: "Collections",
      search: "Search",
      bookmarks: "Bookmarks",
      analytics: "Analytics",
      resources: "Resources",
      submit: "Submit",
    },
    common: {
      search: "Search...",
      loading: "Loading...",
      noResults: "No results found",
      viewAll: "View all",
      learnMore: "Learn more",
      addToStack: "Add to Stack",
      inStack: "In Stack",
      share: "Share",
      copyLink: "Copy link",
      recentlyUpdated: "Recently Updated",
    },
    tools: {
      title: "AI Tools",
      byCategory: "by category",
      pricing: "Pricing",
      category: "Category",
      recommended: "Recommended",
    },
    workflows: {
      title: "Workflows",
      fromPractitioners: "from practitioners",
      complexity: "Complexity",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    dotfiles: {
      title: "Dotfiles",
      readyToUse: "ready to use",
      kind: "Kind",
      author: "Author",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      tools: "Herramientas",
      workflows: "Flujos",
      dotfiles: "Dotfiles",
      compare: "Comparar",
      collections: "Colecciones",
      search: "Buscar",
      bookmarks: "Marcadores",
      analytics: "Estadisticas",
      resources: "Recursos",
      submit: "Enviar",
    },
    common: {
      search: "Buscar...",
      loading: "Cargando...",
      noResults: "Sin resultados",
      viewAll: "Ver todo",
      learnMore: "Aprender mas",
      addToStack: "Agregar a Stack",
      inStack: "En Stack",
      share: "Compartir",
      copyLink: "Copiar enlace",
      recentlyUpdated: "Actualizado recientemente",
    },
    tools: {
      title: "Herramientas de IA",
      byCategory: "por categoria",
      pricing: "Precio",
      category: "Categoria",
      recommended: "Recomendado",
    },
    workflows: {
      title: "Flujos",
      fromPractitioners: "de practicantes",
      complexity: "Complejidad",
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
    },
    dotfiles: {
      title: "Dotfiles",
      readyToUse: "listo para usar",
      kind: "Tipo",
      author: "Autor",
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.en;

const LANGUAGE_KEY = "resbook-language";

export function useTranslation() {
  if (typeof window === "undefined") {
    return translations.en;
  }

  const stored = localStorage.getItem(LANGUAGE_KEY) as Language;
  if (stored && translations[stored]) {
    return translations[stored];
  }

  return translations.en;
}

export function setLanguage(lang: Language) {
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LANGUAGE_KEY) as Language) || "en";
}