"use client";

import AccountTree from "@mui/icons-material/AccountTree";
import Info from "@mui/icons-material/Info";
import MoreVert from "@mui/icons-material/MoreVert";
import Notifications from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { type MouseEvent, useState } from "react";
import { ErrorCard } from "@/app/_components/ErrorCard/ErrorCard";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import styles from "./Header.module.scss";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";

export const Header = () => {
  const { loading, errors } = useBackendApi();
  const [navigationButton, setNavigationButton] = useState<null | HTMLElement>(null);
  const [errorsButton, setErrorsButton] = useState<null | HTMLElement>(null);
  const isNavMenuOpen = Boolean(navigationButton);
  const isErrorMenuOpen = Boolean(errorsButton);

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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Content Tree Application
        </Typography>

        {loading && (
          <CircularProgress size={24} color="inherit" disableShrink aria-label="Loading" />
        )}

        {/* Pages Menu */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="pages"
          aria-controls="navigation-menu"
          aria-haspopup="true"
          onClick={handleNavMenuOpen}
        >
          <MoreVert />
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
              <AccountTree fontSize="small" />
            </ListItemIcon>
            Tree
          </MenuItem>
          <MenuItem component={Link} href="/about" onClick={handleNavMenuClose}>
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            About
          </MenuItem>
        </Menu>

        {/* Error Notifications Menu */}
        <IconButton
          size="large"
          color="inherit"
          aria-label={errorNotificationsAriaLabel(errors.length)}
          aria-controls="error-menu"
          aria-haspopup="true"
          onClick={handleErrorsMenuOpen}
        >
          <Badge badgeContent={errors.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <Menu
          id="error-menu"
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
          className={styles["error-menu"]}
          sx={{
            maxHeight: 480,
            width: "320px",
            p: 0,
          }}
        >
          {errors.length === 0 ? (
            <MenuItem disabled>
              <Box className={styles["empty-state"]}>No errors</Box>
            </MenuItem>
          ) : (
            <Box className={styles["error-list-container"]}>
              {errors.map((error) => (
                <ErrorCard key={error.id} error={error} closeable={false} />
              ))}
            </Box>
          )}
        </Menu>

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

const errorNotificationsAriaLabel = (errorCount: number) => {
  let label = "Error notifications";

  if (errorCount) {
    label += `, ${errorCount} error`;

    if (errorCount > 1) {
      label += "s";
    }
  }

  return label;
};
