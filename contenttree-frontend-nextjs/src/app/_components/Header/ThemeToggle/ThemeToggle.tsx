"use client";

import { DarkMode, LightMode } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

export const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={toggleMode}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
    >
      {mode === "light" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};
