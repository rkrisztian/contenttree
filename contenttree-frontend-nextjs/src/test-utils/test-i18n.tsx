import i18next, { type Resource, type ResourceKey } from "i18next";
import { I18nProvider } from "next-i18next/client";
import type { PropsWithChildren } from "react";
import { i18nConfig } from "@/i18n/i18n.config";

export const WithTestI18nProvider = ({
  children,
  resources,
  namespace,
  messages,
}: Readonly<
  PropsWithChildren<{ resources?: Resource; namespace?: string; messages?: ResourceKey }>
>) => {
  initTestI18n(resources || { en: { [namespace!]: messages! } }, namespace);

  return (
    <I18nProvider language="en" resources={i18next.store.data}>
      {children}
    </I18nProvider>
  );
};

const initTestI18n = (resources: Resource, namespace = i18nConfig.defaultNS!) => {
  i18next.init({
    lng: "en",
    fallbackLng: i18nConfig.fallbackLng,
    ns: i18nConfig.ns!,
    defaultNS: namespace,
    interpolation: { escapeValue: false }, // not needed for react
    resources,
    debug: false,
  });
};

export const t = i18next.t;
