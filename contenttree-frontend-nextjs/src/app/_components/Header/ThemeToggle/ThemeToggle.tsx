"use client";

import { DarkMode, LightMode } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import { useT } from "next-i18next/client";

export const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useT("app");

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={toggleMode}
      aria-label={t(
        mode === "dark"
          ? "app.header.theme-button-aria-label-dark"
          : "app.header.theme-button-aria-label-light",
      )}
    >
      {mode === "dark" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
};
