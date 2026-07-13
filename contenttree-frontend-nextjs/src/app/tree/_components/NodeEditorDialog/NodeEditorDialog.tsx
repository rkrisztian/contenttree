import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import type { TreeNodeData } from "@/app/tree/_lib/tree-data";
import styles from "./NodeEditorDialog.module.scss";

interface NodeEditorDialogProps {
  data: NodeEditorDialogData;
  onClose: () => void;
  onSave: (createMode: boolean, data: NodeEditorFormData) => void;
}

export interface NodeEditorDialogData {
  createMode: boolean;
  selectedNode: TreeNodeData | null;
  content: string | undefined;
}

export interface NodeEditorFormData {
  name: string;
  content: string;
}

export default function NodeEditorDialog({
  data,
  onClose,
  onSave,
}: Readonly<NodeEditorDialogProps>) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<NodeEditorFormData>({
    mode: "onChange",
    defaultValues: {
      name: data.createMode ? "" : data.selectedNode!.name,
      content: data.createMode ? "" : data.content!,
    },
  });

  const onSubmit = (formData: NodeEditorFormData) => {
    onSave(data.createMode, {
      name: formData.name.trim(),
      content: formData.content.trim(),
    });
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="node-editor-dialog-title"
    >
      <DialogTitle className={styles["dialog-header"]} id="node-editor-dialog-title">
        {data.createMode ? "Add Node" : "Edit Node"}
      </DialogTitle>
      <IconButton onClick={onClose} aria-label="Close" className={styles["close-button"]}>
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} id="node-editor-form">
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? "Node name is required" : null}
                className={styles["text-field"]}
                placeholder="Enter node name"
                {...field}
              />
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? "Node content is required" : null}
                className={styles["text-field"]}
                placeholder="Enter node content"
                {...field}
              />
            )}
          />
        </form>
      </DialogContent>

      <DialogActions className={styles["dialog-actions"]}>
        <Button onClick={onClose} variant="outlined" startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="node-editor-form"
          variant="contained"
          disabled={!isValid || isSubmitting}
          startIcon={data.createMode ? <AddIcon /> : <EditIcon />}
          className={styles["saveButton"]}
        >
          {data.createMode ? "Add Node" : "Edit Node"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
