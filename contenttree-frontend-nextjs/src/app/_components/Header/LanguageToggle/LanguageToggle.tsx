"use client";

import DoneIcon from "@mui/icons-material/Done";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useChangeLanguage, useT } from "next-i18next/client";
import { type MouseEvent, useState } from "react";
import { i18nConfig } from "@/i18n/i18n.config";

const availableLanguages: Record<string, { name: string }> = {
  en: { name: "English" },
  hu: { name: "Magyar" },
};

export const LanguageToggle = () => {
  const [langaugeButton, setLangaugeButton] = useState<null | HTMLElement>(null);
  const isLangMenuOpen = Boolean(langaugeButton);
  const changeLanguage = useChangeLanguage();
  const { i18n, t } = useT("app");

  const handleLangMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setLangaugeButton(event.currentTarget);
  };

  const handleLangMenuClose = (lng?: string) => {
    if (lng) {
      changeLanguage(lng);
    }
    setLangaugeButton(null);
  };

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        aria-label={t("app.language-toggle.language-button-aria-label")}
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleLangMenuOpen}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={langaugeButton}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isLangMenuOpen}
        onClose={() => handleLangMenuClose()}
      >
        {i18nConfig.supportedLngs.map((lng) => (
          <MenuItem
            key={lng}
            onClick={() => handleLangMenuClose(lng)}
            aria-selected={lng === i18n.language}
          >
            {lng === i18n.language && (
              <ListItemIcon>
                <DoneIcon fontSize="small" />
              </ListItemIcon>
            )}
            {availableLanguages[lng]!.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
