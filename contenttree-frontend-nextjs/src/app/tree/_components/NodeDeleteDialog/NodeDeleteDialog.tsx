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
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import type { TreeNodeData } from "@/app/tree/_lib/TreePageContext";
import styles from "./NodeDeleteDialog.module.scss";
import { convertTreeToList } from "./node-delete-dialog-util";

export interface NodeDeleteDialogProps {
  node: TreeNodeData;
  onClose: () => void;
  onDelete: () => void;
}

export const NodeDeleteDialog = ({ node, onClose, onDelete }: Readonly<NodeDeleteDialogProps>) => {
  const allNodesToDelete = convertTreeToList(node);

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
          Are you sure you want to delete <strong>{node.name}</strong>
          {allNodesToDelete.length > 1 && " and its following children"}?
        </Typography>

        {allNodesToDelete.length > 1 && (
          <Box className={styles["tree-preview-container"]}>
            <List aria-label="Nodes to be deleted" className={styles["tree-preview-list"]}>
              {allNodesToDelete.map((item) => (
                <ListItem
                  key={item.node.id}
                  className={styles["tree-item"]}
                  disablePadding
                  sx={{ paddingLeft: `${item.indentLevel * 24}px` }}
                >
                  <ListItemIcon className={styles["tree-icon"]}>
                    {item.node.children.length > 0 ? <FolderIcon /> : <DescriptionIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.node.name}
                    slotProps={{ primary: { className: styles["tree-name"] } }}
                  />
                </ListItem>
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
          {allNodesToDelete.length > 1 && " All"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
