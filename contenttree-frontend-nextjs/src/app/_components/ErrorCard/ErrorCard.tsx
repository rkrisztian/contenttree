"use client";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { type ErrorData, useBackendApi } from "@/app/_lib/BackendApiContext";
import styles from "./ErrorCard.module.scss";

interface ErrorCardProps {
  error: ErrorData;
  closeable?: boolean;
}

export const ErrorCard = ({ error, closeable = true }: Readonly<ErrorCardProps>) => {
  const { hideLatestError, removeError, copyToClipboard } = useBackendApi();

  return (
    <Card className={styles["error-card"]} elevation={2}>
      <CardHeader
        avatar={<ErrorIcon aria-hidden="true" />}
        title={error.error}
        action={
          closeable && (
            <IconButton aria-label="Close" onClick={hideLatestError} size="small">
              <CloseIcon />
            </IconButton>
          )
        }
      ></CardHeader>

      <CardContent>{error.message}</CardContent>

      {error.traceId && (
        <CardContent>
          <Box className={styles["trace-id-container"]}>
            <Typography variant="caption" className={styles["trace-id-label"]}>
              Trace ID:{" "}
            </Typography>
            <code>{error.traceId}</code>
          </Box>
        </CardContent>
      )}

      <CardActions>
        <Button
          aria-label="Copy error data"
          onClick={() => copyToClipboard(error)}
          startIcon={<ContentCopyIcon />}
          variant="contained"
          color="error"
        >
          Copy
        </Button>

        <Button
          onClick={() => removeError(error.id)}
          startIcon={<DeleteIcon />}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
