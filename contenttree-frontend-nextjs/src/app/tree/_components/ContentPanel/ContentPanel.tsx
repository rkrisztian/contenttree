import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./ContentPanel.module.scss";

export const ContentPanel = () => {
  const { treeData, selectedNodeId } = useTreePage();

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
        <NodeContent />
      </CardContent>
    </Card>
  );
};

const NodeContent = () => {
  const { selectedNodeId, contentForSelectedNode } = useTreePage();

  if (contentForSelectedNode.isLoading) {
    return (
      <output className={styles["loading"]} aria-label="Loading content" aria-live="polite">
        <CircularProgress size={32} />
        <span>Loading content...</span>
      </output>
    );
  }

  if (!selectedNodeId || !contentForSelectedNode.data) {
    return <p className={styles["node-not-selected"]}>Select a node to view its content</p>;
  }

  return <pre className={styles["content-data"]}>{contentForSelectedNode.data.data}</pre>;
};
