"use client";

import CheckIcon from "@mui/icons-material/Check";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import { useT } from "next-i18next/client";
import { type DragEvent, type KeyboardEvent, type MouseEvent, useState } from "react";
import { useAuthContext } from "@/app/_lib/AuthContext";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./Tree.module.scss";

export const Tree = () => {
  const { loading } = useBackendApi();
  const { isManager } = useAuthContext();
  const {
    treeData,
    expansionState,
    setExpansionState,
    selectedNodeId,
    toggleSelect,
    foundNodes,
    moveNode,
  } = useTreePage();
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [dragoverNodeId, setDragoverNodeId] = useState<number | null>(null);
  const { t } = useT("tree");

  const toggleExpanded = (event: MouseEvent | null, nodeId: number) => {
    event?.stopPropagation();

    // React Strict Mode workaround
    const origExpanded = expansionState.isExpanded(nodeId);

    setExpansionState((prev) => {
      const next = prev.clone();

      // React Strict Mode workaround
      if (prev.isExpanded(nodeId) !== origExpanded) {
        return next;
      }

      next.toggleExpanded(nodeId, treeData);
      return next;
    });
  };

  const startDragging = (event: DragEvent, nodeId: number) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = "move";

    setDraggedNodeId(nodeId);
  };

  const stopDragging = () => {
    setDraggedNodeId(null);
    setDragoverNodeId(null);
  };

  const startDragover = (event: DragEvent, nodeId: number) => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = "move";

    setDragoverNodeId(nodeId === draggedNodeId ? null : nodeId);
  };

  const stopDragover = (event: DragEvent, newParentId: number) => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    moveNode(draggedNodeId!, newParentId);
    stopDragging();
  };

  const handleKeyDown = (event: KeyboardEvent, nodeId: number) => {
    const treeItems = Array.from(document.querySelectorAll<HTMLDivElement>('[role="treeitem"]'));
    const currentIndex = treeItems.indexOf(document.activeElement as HTMLDivElement);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = treeItems[(currentIndex + 1) % treeItems.length]!;
        next.focus();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = treeItems[(currentIndex - 1 + treeItems.length) % treeItems.length]!;
        prev.focus();
        break;
      }
      case "Enter":
        event.preventDefault();
        toggleSelect(nodeId);
        break;
      case " ":
        event.preventDefault();
        toggleExpanded(null, nodeId);
        break;
    }
  };

  return (
    <Box role="tree" aria-label={t("tree-page.tree.aria-label")} className={styles["tree"]}>
      {treeData.nodes.map((node) => {
        const foundStatus = foundNodes && (foundNodes.has(node.id) ? "found" : "notFound");

        return (
          expansionState.isVisible(node.id) && (
            <Box key={node.id}>
              <Box
                role="treeitem"
                aria-level={node.depth}
                sx={{ marginLeft: `${node.depth * 1.75}rem` }}
                aria-label={
                  foundStatus === "found"
                    ? t("tree-page.tree.node-matched-aria-label", { nodeName: node.name })
                    : node.name
                }
                aria-expanded={expansionState.isExpanded(node.id)}
                aria-selected={selectedNodeId === node.id}
                onClick={() => toggleSelect(node.id)}
                onKeyDown={(event) => handleKeyDown(event, node.id)}
                tabIndex={selectedNodeId === node.id ? 0 : -1}
                draggable={isManager && !loading}
                onDragStart={(event) => startDragging(event, node.id)}
                onDragOver={(event) => startDragover(event, node.id)}
                onDragEnd={stopDragging}
                onDrop={(event) => stopDragover(event, node.id)}
                className={clsx(styles["tree-item"], {
                  [styles["not-found"] as string]: foundStatus === "notFound",
                  [styles["dragging"] as string]: draggedNodeId === node.id,
                  [styles["dragged-over"] as string]: dragoverNodeId === node.id,
                })}
              >
                {node.children.length ? (
                  <IconButton
                    className={styles["node-icon"]}
                    tabIndex={-1}
                    onClick={(event) => toggleExpanded(event, node.id)}
                    aria-label={t("tree-page.tree.toggle-button-aria-label", {
                      nodeName: node.name,
                    })}
                  >
                    {expansionState.isExpanded(node.id) ? (
                      <ExpandMoreIcon fontSize="inherit" />
                    ) : (
                      <ChevronRightIcon fontSize="inherit" />
                    )}
                  </IconButton>
                ) : (
                  <IconButton className={styles["node-icon"]} disabled={true}>
                    &nbsp;
                  </IconButton>
                )}

                {node.children.length ? (
                  <FolderIcon fontSize="inherit" />
                ) : (
                  <InsertDriveFileIcon fontSize="inherit" />
                )}

                <span className={styles["node-label"]}>{node.name}</span>

                {foundStatus === "found" && <CheckIcon className={styles["found-icon"]} />}
              </Box>
            </Box>
          )
        );
      })}
    </Box>
  );
};
