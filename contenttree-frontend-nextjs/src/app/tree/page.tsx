"use client";

import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useT } from "next-i18next/client";
import { Suspense } from "react";
import { ContentPanel } from "@/app/tree/_components/ContentPanel/ContentPanel";
import { Tree } from "@/app/tree/_components/Tree/Tree";
import { TreeToolbar } from "@/app/tree/_components/TreeToolbar/TreeToolbar";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import { ReloadableError } from "../_components/ReloadableError/ReloadableError";
import { ErrorBoundary } from "../_lib/ErrorBoundary";
import styles from "./page.module.scss";

export default function TreePage() {
  return (
    <Box className={styles["page-layout"]}>
      <TreePanel />
      <Box className={styles["content-panel-container"]}>
        <ContentPanel />
      </Box>
    </Box>
  );
}

const TreePanel = () => {
  const { rawNodes: flatNodes } = useTreePage();

  return (
    <Card className={styles["tree-panel"]} elevation={2}>
      <CardContent>
        <TreeToolbar />
      </CardContent>

      <Divider />

      <CardContent className={styles["tree"]}>
        <ErrorBoundary fallback={<ReloadableError reload={() => flatNodes.mutate()} />}>
          <Suspense fallback={<LoadingTreeContent />}>
            <TreeContent />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

const TreeContent = () => {
  const { treeData } = useTreePage();
  const { t } = useT("tree");

  if (!treeData.rootNodeId) {
    return (
      <Box className={styles["empty-state"]}>
        <InboxIcon className={styles["empty-icon"]} />
        <Typography variant="h5" component="h3">
          {t("tree-page.tree.tree-is-empty")}
        </Typography>
        <Typography variant="body1">{t("tree-page.tree.add-root-node-text")}</Typography>
      </Box>
    );
  }

  return <Tree />;
};

export const LoadingTreeContent = () => {
  const { t } = useT("tree");

  return (
    <Box className={styles["loading-container"]}>
      <CircularProgress size={32} />
      <Typography>{t("tree-page.tree.loading-indicator")}</Typography>
    </Box>
  );
};
