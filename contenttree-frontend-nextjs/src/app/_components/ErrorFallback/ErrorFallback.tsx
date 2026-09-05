"use client";

import CloudOffIcon from "@mui/icons-material/CloudOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useT } from "next-i18next/client";
import styles from "./ErrorFallback.module.scss";

interface ErrorFallbackProps {
  reload: () => void;
}

export const ErrorFallback = ({ reload }: Readonly<ErrorFallbackProps>) => {
  const { t } = useT("app");

  return (
    <Box className={styles["error-state"]}>
      <CloudOffIcon className={styles["error-icon"]} />
      <Typography variant="body1">{t("app.error-fallback.error-loading")}</Typography>
      <Button onClick={reload} startIcon={<RefreshIcon />} variant="contained">
        {t("app.error-fallback.reload-button-label")}
      </Button>
    </Box>
  );
};
