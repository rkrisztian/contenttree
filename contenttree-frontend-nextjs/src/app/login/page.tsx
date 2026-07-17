"use client";

import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "../_lib/AuthContext";
import { useBackendApi } from "../_lib/BackendApiContext";
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

  const onSubmit = (formData: LoginFormData) => {
    login(formData.username.trim(), formData.password.trim());
  };

  return (
    <Box className={styles["container"]}>
      <Card className={styles["card"]}>
        <CardHeader className={styles["card-header"]} title="Login"></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="login-form">
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Username"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "Username is required" : null}
                  className={styles["text-field"]}
                  placeholder="Enter username"
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
                  label="Password"
                  fullWidth
                  type="password"
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "Password is required" : null}
                  className={styles["text-field"]}
                  placeholder="Enter password"
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
            Log in
          </Button>
        </CardActions>{" "}
      </Card>
    </Box>
  );
}
