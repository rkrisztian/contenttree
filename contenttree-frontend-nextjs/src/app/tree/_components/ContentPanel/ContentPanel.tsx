import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useT } from "next-i18next/client";
import { Suspense } from "react";
import { ReloadableError } from "@/app/_components/ReloadableError/ReloadableError";
import { ErrorBoundary } from "@/app/_lib/ErrorBoundary";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./ContentPanel.module.scss";

export const ContentPanel = () => {
  const { treeData, selectedNodeId } = useTreePage();
  const { contentForSelectedNode } = useTreePage();

  return (
    <Card className={styles["content-panel"]} elevation={2}>
      {selectedNodeId && (
        <>
          <CardHeader
            title={
              <Typography variant="h3" component="h3">
                {treeData.getNodebyId(selectedNodeId).name}
              </Typography>
            }
            sx={{ paddingBottom: 0 }}
          />
          <Divider />
        </>
      )}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ErrorBoundary
          fallback={<ReloadableError reload={() => contentForSelectedNode.mutate()} />}
        >
          <Suspense fallback={<LoadingNodeContent />}>
            <NodeContent />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

const NodeContent = () => {
  const { selectedNodeId, contentForSelectedNode } = useTreePage();
  const { t } = useT("tree");

  if (!selectedNodeId || !contentForSelectedNode.data) {
    return (
      <p className={styles["node-not-selected"]}>
        {t("tree-page.content-panel.node-not-selected")}
      </p>
    );
  }

  return <pre className={styles["content-data"]}>{contentForSelectedNode.data.data}</pre>;
};

const LoadingNodeContent = () => {
  const { t } = useT("tree");

  return (
    <output className={styles["loading"]} aria-label="Loading content" aria-live="polite">
      <CircularProgress size={32} />
      <span>{t("tree-page.content-panel.loading-indicator")}</span>
    </output>
  );
};
