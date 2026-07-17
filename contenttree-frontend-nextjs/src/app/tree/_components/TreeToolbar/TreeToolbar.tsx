import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/_lib/AuthContext";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import {
  NodeDeleteDialog,
  type NodeDeleteDialogData,
} from "@/app/tree/_components/NodeDeleteDialog/NodeDeleteDialog";
import NodeEditorDialog, {
  type NodeEditorDialogData,
  type NodeEditorFormData,
} from "@/app/tree/_components/NodeEditorDialog/NodeEditorDialog";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./TreeToolbar.module.scss";

const DEBOUNCE_DELAY = 500; // ms

export const TreeToolbar = () => {
  const { loading } = useBackendApi();
  const { isManager } = useAuthContext();
  const {
    treeData,
    selectedNodeId,
    searchText,
    setSearchText,
    contentForSelectedNode,
    createNode,
    updateSelectedNode,
    deleteSelectedNode,
  } = useTreePage();

  const [searchInputValue, setSearchInputValue] = useState(searchText);
  const hasInvalidLength = searchInputValue.length > 0 && searchInputValue.length < 3;
  const invalidMessage = hasInvalidLength ? "At least 3 characters are required" : "";

  const [nodeEditorDialogData, setNodeEditorDialogData] = useState<NodeEditorDialogData | null>(
    null,
  );
  const [nodeDeleteDialogData, setNodeDeleteDialogData] = useState<NodeDeleteDialogData | null>(
    null,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: searchText is a side effect.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInvalidLength && searchInputValue !== searchText) {
        setSearchText(searchInputValue);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInputValue, hasInvalidLength]);

  const openNodeEditorDialog = (createMode: boolean): void => {
    setNodeEditorDialogData({
      createMode,
      selectedNode: selectedNodeId ? treeData.getNodebyId(selectedNodeId) : null,
      content: createMode ? undefined : contentForSelectedNode.data!.data,
    });
  };

  const closeNodeEditorDialog = () => {
    setNodeEditorDialogData(null);
  };

  const addOrEditNode = (createMode: boolean, data: NodeEditorFormData) => {
    if (createMode) {
      createNode({ ...data, ...(selectedNodeId ? { parentId: selectedNodeId } : {}) });
    } else {
      updateSelectedNode(data);
    }

    setNodeEditorDialogData(null);
  };

  const openNodeDeleteDialog = (): void => {
    setNodeDeleteDialogData({
      allNodesToDelete: [...treeData.iterateSubTree(selectedNodeId!)],
    });
  };

  const closeNodeDeleteDialog = () => {
    setNodeDeleteDialogData(null);
  };

  const deleteNode = (): void => {
    deleteSelectedNode();
    setNodeDeleteDialogData(null);
  };

  return (
    <div className={styles["toolbar-container"]}>
      <FormControl fullWidth variant="outlined" error={hasInvalidLength}>
        <TextField
          type="search"
          label="Search nodes"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          variant="outlined"
          error={hasInvalidLength}
          helperText={hasInvalidLength ? invalidMessage : undefined}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchInputValue ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchInputValue("")}
                    aria-label="Clear search"
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </FormControl>

      <Box className={styles["toolbar-button-row"]}>
        <Button
          variant="contained"
          onClick={() => openNodeEditorDialog(true)}
          disabled={!isManager || (!!treeData.rootNodeId && !selectedNodeId) || !!loading}
          aria-label="Add new node"
          startIcon={<AddIcon />}
        >
          Add
        </Button>

        <Button
          variant="contained"
          onClick={() => openNodeEditorDialog(false)}
          disabled={!isManager || !selectedNodeId || !!loading}
          aria-label="Edit selected node"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={openNodeDeleteDialog}
          disabled={
            !isManager || !selectedNodeId || selectedNodeId === treeData.rootNodeId || !!loading
          }
          aria-label="Delete selected node"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </Box>

      {nodeEditorDialogData && (
        <NodeEditorDialog
          data={nodeEditorDialogData}
          onClose={closeNodeEditorDialog}
          onSave={addOrEditNode}
        />
      )}

      {nodeDeleteDialogData && (
        <NodeDeleteDialog
          data={nodeDeleteDialogData}
          onClose={closeNodeDeleteDialog}
          onDelete={deleteNode}
        />
      )}
    </div>
  );
};
