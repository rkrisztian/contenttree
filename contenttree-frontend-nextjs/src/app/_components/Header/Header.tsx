"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PolicyIcon from "@mui/icons-material/Policy";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { type MouseEvent, useMemo, useState } from "react";
import { ErrorCard } from "@/app/_components/ErrorCard/ErrorCard";
import { LanguageToggle } from "@/app/_components/Header/LanguageToggle/LanguageToggle";
import { ThemeToggle } from "@/app/_components/Header/ThemeToggle/ThemeToggle";
import { useAuthContext } from "@/app/_lib/AuthContext";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import styles from "./Header.module.scss";

export const Header = () => {
  const { loading, errors } = useBackendApi();
  const { isAuthenticated, loginData, logout } = useAuthContext();
  const currentUsername = useMemo(() => loginData?.username ?? null, [loginData]);
  const [navigationButton, setNavigationButton] = useState<null | HTMLElement>(null);
  const [errorsButton, setErrorsButton] = useState<null | HTMLElement>(null);
  const [userButton, setUserButton] = useState<null | HTMLElement>(null);
  const isNavMenuOpen = Boolean(navigationButton);
  const isErrorMenuOpen = Boolean(errorsButton);
  const isUserMenuOpen = Boolean(userButton);
  const { t } = useT("app");

  const handleNavMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setNavigationButton(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setNavigationButton(null);
  };

  const handleErrorsMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setErrorsButton(event.currentTarget);
  };

  const handleErrorsMenuClose = () => {
    setErrorsButton(null);
  };

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserButton(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserButton(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" className={styles["title"]}>
          {t("app.header.title")}
        </Typography>

        {loading && (
          <CircularProgress
            size={24}
            color="inherit"
            disableShrink
            aria-label={t("app.header.loading-indicator-aria-label")}
          />
        )}

        {/* Pages Menu */}
        <IconButton
          size="large"
          color="inherit"
          aria-label={t("app.header.pages-menu-button-aria-label")}
          aria-controls="navigation-menu"
          aria-haspopup="true"
          onClick={handleNavMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="navigation-menu"
          anchorEl={navigationButton}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isNavMenuOpen}
          onClose={handleNavMenuClose}
        >
          <MenuItem component={Link} href="/tree" onClick={handleNavMenuClose}>
            <ListItemIcon>
              <AccountTreeIcon fontSize="small" />
            </ListItemIcon>
            {t("app.header.pages-menu-tree-page")}
          </MenuItem>
          <MenuItem component={Link} href="/about" onClick={handleNavMenuClose}>
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            {t("app.header.pages-menu-about-page")}
          </MenuItem>
          <MenuItem component={Link} href="/privacy-policy" onClick={handleNavMenuClose}>
            <ListItemIcon>
              <PolicyIcon fontSize="small" />
            </ListItemIcon>
            {t("app.header.pages-menu-privacy-policy-page")}
          </MenuItem>
        </Menu>

        {/* Error Notifications Menu */}
        <IconButton
          size="large"
          color="inherit"
          aria-label={t("app.header.errors-menu-button-aria-label", { count: errors.length })}
          aria-controls="errors-menu"
          aria-haspopup="true"
          onClick={handleErrorsMenuOpen}
        >
          <Badge badgeContent={errors.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          id="errors-menu"
          anchorEl={errorsButton}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isErrorMenuOpen}
          onClose={handleErrorsMenuClose}
          className={styles["errors-menu"]}
          sx={{
            maxHeight: 480,
            width: "320px",
            p: 0,
          }}
        >
          {errors.length === 0 ? (
            <MenuItem disabled>
              <Box className={styles["empty-state"]}>{t("app.header.errors-menu-no-errors")}</Box>
            </MenuItem>
          ) : (
            <Box className={styles["error-list-container"]}>
              {errors.map((error) => (
                <ErrorCard key={error.id} error={error} closeable={false} />
              ))}
            </Box>
          )}
        </Menu>

        {/* User Menu */}
        <IconButton
          size="large"
          color="inherit"
          aria-label={t("app.header.user-menu-button-aria-label")}
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleUserMenuOpen}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={userButton}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isUserMenuOpen}
          onClose={handleUserMenuClose}
          className={styles["user-menu"]}
        >
          {isAuthenticated ? (
            <>
              <MenuItem disabled>
                <Box className={styles["username"]}>
                  <ListItemText primary={currentUsername} />
                </Box>
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("app.header.user-menu-log-out")} />
              </MenuItem>
            </>
          ) : (
            <MenuItem component={Link} href="/login" onClick={handleUserMenuClose}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("app.header.user-menu-log-in")} />
            </MenuItem>
          )}
        </Menu>

        <ThemeToggle />

        <LanguageToggle />
      </Toolbar>
    </AppBar>
  );
};
