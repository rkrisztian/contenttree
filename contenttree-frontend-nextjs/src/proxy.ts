import { createProxy } from "next-i18next/proxy";
import { i18nConfig } from "@/i18n/i18n.config";

export const proxy = createProxy(i18nConfig);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|_not-found|favicon\\.|.*\\..*).*)", // NOSONAR: `String.raw` not supported
};
