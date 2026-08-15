"use client";

import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import { useT } from "next-i18next/client";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "@/app/_lib/AuthContext";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import styles from "./page.module.scss";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { loading } = useBackendApi();
  const { login } = useAuthContext();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginFormData>({ mode: "onChange", defaultValues: { username: "", password: "" } });
  const { t } = useT("login");

  const onSubmit = (formData: LoginFormData) => {
    login(formData.username.trim(), formData.password.trim());
  };

  return (
    <Box className={styles["container"]}>
      <Card className={styles["card"]}>
        <CardHeader className={styles["card-header"]} title={t("login-page.title")}></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="login-form">
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  label={t("login-page.username-field-label")}
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? t("login-page.username-field-required") : null}
                  className={styles["text-field"]}
                  placeholder={t("login-page.username-field-placeholder")}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  label={t("login-page.password-field-label")}
                  fullWidth
                  type="password"
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? t("login-page.password-field-required") : null}
                  className={styles["text-field"]}
                  placeholder={t("login-page.password-field-placeholder")}
                  {...field}
                />
              )}
            />
          </form>
        </CardContent>
        <CardActions className={styles["actions"]}>
          <Button
            type="submit"
            form="login-form"
            variant="contained"
            disabled={!isValid || isSubmitting || loading}
            startIcon={<LoginIcon />}
          >
            {t("login-page.log-in-button-label")}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
