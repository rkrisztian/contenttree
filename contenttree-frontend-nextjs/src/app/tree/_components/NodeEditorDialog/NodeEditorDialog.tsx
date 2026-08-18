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
import { useT } from "next-i18next/client";
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
  const { t } = useT("tree");

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
        {t(
          data.createMode
            ? "tree-page.node-editor-dialog.add-title"
            : "tree-page.node-editor-dialog.edit-title",
        )}
      </DialogTitle>
      <IconButton
        onClick={onClose}
        aria-label={t("tree-page.node-editor-dialog.close-button-aria-label")}
        className={styles["close-button"]}
      >
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
                label={t("tree-page.node-editor-dialog.node-name-field-label")}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? t("tree-page.node-editor-dialog.node-name-field-required")
                    : null
                }
                className={styles["text-field"]}
                placeholder={t("tree-page.node-editor-dialog.node-name-field-placeholder")}
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
                label={t("tree-page.node-editor-dialog.node-content-field-label")}
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? t("tree-page.node-editor-dialog.node-content-field-required")
                    : null
                }
                className={styles["text-field"]}
                placeholder={t("tree-page.node-editor-dialog.node-content-field-placeholder")}
                {...field}
              />
            )}
          />
        </form>
      </DialogContent>

      <DialogActions className={styles["dialog-actions"]}>
        <Button onClick={onClose} variant="outlined" startIcon={<CancelIcon />}>
          {t("tree-page.node-editor-dialog.cancel-button-label")}
        </Button>
        <Button
          type="submit"
          form="node-editor-form"
          variant="contained"
          disabled={!isValid || isSubmitting}
          startIcon={data.createMode ? <AddIcon /> : <EditIcon />}
        >
          {t(
            data.createMode
              ? "tree-page.node-editor-dialog.add-button-label"
              : "tree-page.node-editor-dialog.edit-button-label",
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
