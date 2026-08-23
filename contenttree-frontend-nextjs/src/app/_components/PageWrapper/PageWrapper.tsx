"use client";

import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import type { ReactNode } from "react";
import { ErrorCard } from "@/app/_components/ErrorCard/ErrorCard";
import { Header } from "@/app/_components/Header/Header";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import styles from "./PageWrapper.module.scss";

const ERROR_TIMEOUT_IN_MS = 5000;

export default function PageWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const { latestError, hideLatestError } = useBackendApi();

  return (
    <Box className={styles["page-container"]}>
      <Header />

      <Box component="main" className={styles["main"]}>
        {children}
      </Box>

      {latestError && (
        <Snackbar
          open={!!latestError}
          autoHideDuration={ERROR_TIMEOUT_IN_MS}
          onClose={hideLatestError}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box role="alert">
            <ErrorCard key={latestError.id} error={latestError} />
          </Box>
        </Snackbar>
      )}
    </Box>
  );
}
