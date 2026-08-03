import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { I18nProvider } from "next-i18next/client";
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server";
import type { ReactNode } from "react";
import PageWrapper from "@/app/_components/PageWrapper/PageWrapper";
import { AuthContextProvider } from "@/app/_lib/AuthContext";
import { BackendApiContextProvider } from "@/app/_lib/BackendApiContext";
import theme from "@/app/theme";
import { i18nConfig } from "@/i18n/i18n.config";

export const metadata: Metadata = {
  title: "Content Tree Management Application",
  description: "Demonstrates hands-on experience with Next.js",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

initServerI18next(i18nConfig);

export const generateStaticParams = async () => generateI18nStaticParams();

const AppProviders = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const { i18n, lng } = await getT();
  const resources = getResources(i18n);

  return (
    <I18nProvider language={lng} resources={resources}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BackendApiContextProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </BackendApiContextProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </I18nProvider>
  );
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  "use server";

  const { lng } = await getT();

  return (
    <html lang={lng} className={roboto.variable}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
      </head>
      <body>
        <AppProviders>
          <PageWrapper>{children}</PageWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
