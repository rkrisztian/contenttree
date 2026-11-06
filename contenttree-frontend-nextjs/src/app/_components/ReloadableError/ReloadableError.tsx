"use client";

import CloudOffIcon from "@mui/icons-material/CloudOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useT } from "next-i18next/client";
import styles from "./ReloadableError.module.scss";

interface ReloadableErrorProps {
  reload: () => void;
}

export const ReloadableError = ({ reload }: Readonly<ReloadableErrorProps>) => {
  const { t } = useT("app");

  return (
    <Box className={styles["error-state"]}>
      <CloudOffIcon className={styles["error-icon"]} />
      <Typography variant="body1">{t("app.reloadable-error.error-loading")}</Typography>
      <Button onClick={reload} startIcon={<RefreshIcon />} variant="contained">
        {t("app.reloadable-error.reload-button-label")}
      </Button>
    </Box>
  );
};
