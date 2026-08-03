import type { I18nConfig } from "next-i18next/proxy";

export const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "hu"],
  fallbackLng: "en",
  localeInPath: false,
  resourceLoader: (language, namespace) => import(`@/i18n/messages/${language}/${namespace}.json`),
  defaultNS: "app",
  ns: ["about", "app", "login", "tree"],
};
