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
        Delete Node
      </DialogTitle>
      <IconButton onClick={onClose} aria-label="Close" className={styles["close-button"]}>
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Typography variant="body1" className={styles["instruction-text"]}>
          Are you sure you want to delete <strong>{nodeToDelete.name}</strong>
          {data.allNodesToDelete.length > 1 && " and its following children"}?
        </Typography>

        {data.allNodesToDelete.length > 1 && (
          <Box className={styles["tree-preview-container"]}>
            <List aria-label="Nodes to be deleted" className={styles["tree-preview-list"]}>
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
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          className={styles["delete-button"]}
          startIcon={<DeleteIcon />}
        >
          Delete
          {data.allNodesToDelete.length > 1 && " All"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
