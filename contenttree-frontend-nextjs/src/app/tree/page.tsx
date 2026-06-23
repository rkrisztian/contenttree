"use client";

import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { ContentPanel } from "@/app/tree/_components/ContentPanel/ContentPanel";
import { Tree } from "@/app/tree/_components/Tree/Tree";
import { TreeToolbar } from "@/app/tree/_components/TreeToolbar/TreeToolbar";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./page.module.scss";

export default function TreePage() {
  const { flatNodes, rootNode } = useTreePage();

  return (
    <Box className={styles["page-layout"]}>
      <Card className={styles["tree-panel"]} elevation={2}>
        <CardContent>
          <TreeToolbar />
        </CardContent>

        <Divider />

        <CardContent className={styles["tree"]}>
          {flatNodes.isLoading ? (
            <Box className={styles["loading-container"]}>
              <CircularProgress size={32} />
              <Typography>Loading tree...</Typography>
            </Box>
          ) : rootNode ? ( // NOSONAR: TODO: I'll deal with this later.
            <Tree />
          ) : (
            <Box className={styles["empty-state"]}>
              <InboxIcon className={styles["empty-icon"]} />
              <Typography variant="h5" component="h3">
                Tree is Empty
              </Typography>
              <Typography variant="body1">
                Add a root node to begin organizing your data.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box className={styles["content-panel-container"]}>
        <ContentPanel />
      </Box>
    </Box>
  );
}
