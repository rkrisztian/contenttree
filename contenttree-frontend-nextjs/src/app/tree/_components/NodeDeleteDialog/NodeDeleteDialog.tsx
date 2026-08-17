import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { Trans, useT } from "next-i18next/client";
import type { TreeNodeData } from "@/app/tree/_lib/tree-data";
import styles from "./NodeDeleteDialog.module.scss";

export interface NodeDeleteDialogProps {
  data: NodeDeleteDialogData;
  onClose: () => void;
  onDelete: () => void;
}

export interface NodeDeleteDialogData {
  allNodesToDelete: TreeNodeData[];
}

export const NodeDeleteDialog = ({ data, onClose, onDelete }: Readonly<NodeDeleteDialogProps>) => {
  const nodeToDelete = data.allNodesToDelete[0]!;
  const { t } = useT("tree");

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onDelete();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="node-delete-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className={styles["dialog-header"]} id="node-delete-dialog-title">
        {t("tree-page.node-delete-dialog.title")}
      </DialogTitle>
      <IconButton
        onClick={onClose}
        aria-label={t("tree-page.node-delete-dialog.close-button-aria-label")}
        className={styles["close-button"]}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Typography variant="body1" className={styles["instruction-text"]}>
          <Trans
            t={t}
            i18nKey="tree-page.node-delete-dialog.delete-confirmation"
            values={{ count: data.allNodesToDelete.length, nodeName: nodeToDelete.name }}
            components={{ strong: <strong /> }}
          />
        </Typography>

        {data.allNodesToDelete.length > 1 && (
          <Box className={styles["tree-preview-container"]}>
            <List
              aria-label={t("tree-page.node-delete-dialog.nodes-to-be-deleted-aria-label")}
              className={styles["tree-preview-list"]}
            >
              {data.allNodesToDelete.map((node) => (
                <Box key={node.id}>
                  <ListItem
                    className={styles["tree-node"]}
                    disablePadding
                    sx={{ marginLeft: `${(node.depth - nodeToDelete.depth) * 1.75}rem` }}
                  >
                    <ListItemIcon className={styles["tree-node-icon"]}>
                      {node.children.length > 0 ? <FolderIcon /> : <DescriptionIcon />}
                    </ListItemIcon>
                    {/* ListItemText renders a `div` */}
                    <span className={styles["tree-node-name"]}>{node.name}</span>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions className={styles["dialog-actions"]}>
        <Button variant="outlined" onClick={handleClose} startIcon={<CancelIcon />}>
          {t("tree-page.node-delete-dialog.cancel-button-label")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          startIcon={<DeleteIcon />}
        >
          {t("tree-page.node-delete-dialog.delete-button-label", {
            count: data.allNodesToDelete.length,
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
