"use client";

import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem, type TreeItemProps } from "@mui/x-tree-view/TreeItem";
import clsx from "clsx";
import { forwardRef, type Ref, type SyntheticEvent, useMemo } from "react";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import { type TreeNodeData, useTreePage } from "@/app/tree/_lib/TreePageContext";
import styles from "./Tree.module.scss";
import { TreeDragProvider, useTreeDrag } from "./TreeDragContext";

export const Tree = () => {
  const { rootNode, expandedItems, setExpandedItems, selectedNodeId, toggleSelect } = useTreePage();
  const key = useMemo(() => convertTreeToKey(rootNode), [rootNode]);

  const handleExpansionChange = (
    event: SyntheticEvent | null,
    itemId: string,
    isExpanded: boolean,
  ) => {
    event?.stopPropagation();
    setExpandedItems((itemIds) =>
      isExpanded ? [...itemIds, itemId] : itemIds.filter((id) => id !== itemId),
    );
  };

  const handleSelectionChange = (
    _event: SyntheticEvent | null,
    newSelectedNodeId: string | null,
  ) => {
    toggleSelect(Number(newSelectedNodeId));
  };

  return (
    <TreeDragProvider>
      <RichTreeView
        className={styles["tree"]!}
        key={key}
        items={[rootNode!]}
        getItemId={(node) => String(node.id)}
        getItemLabel={(node) => node.name}
        slots={{ item: TreeNode }}
        expandedItems={expandedItems}
        onItemExpansionToggle={handleExpansionChange}
        expansionTrigger="iconContainer"
        selectedItems={selectedNodeId ? String(selectedNodeId) : null}
        onItemClick={handleSelectionChange}
      />
    </TreeDragProvider>
  );
};

const TreeNode = forwardRef((props: TreeItemProps, ref: Ref<HTMLLIElement>) => {
  const node = useTreeItemModel<TreeNodeData>(props.itemId)!;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: TreeNodeLabel,
      }}
      slotProps={{
        label: { nodeId: node.id } as Partial<TreeNodeLabelProps>,
      }}
    />
  );
});

interface TreeNodeLabelProps {
  children: string;
  nodeId: number;
}

const TreeNodeLabel = ({ children, nodeId }: TreeNodeLabelProps) => {
  const { loading } = useBackendApi();
  const { foundNodes, nodesById, selectedNodeId } = useTreePage();
  const {
    draggedNodeId,
    dragoverNodeId,
    startDragging,
    stopDragging,
    startDragover,
    stopDragover,
  } = useTreeDrag();

  const foundStatus = foundNodes && (foundNodes.has(nodeId) ? "found" : "notFound");

  return (
    // biome-ignore lint/a11y/useSemanticElements: TODO: create fully customized tree item
    <Typography // NOSONAR: TODO: create fully customized tree item
      role="button"
      className={clsx(styles["node-label"], {
        [styles["not-found"] as string]: foundStatus === "notFound",
        [styles["dragging"] as string]: draggedNodeId === nodeId,
        [styles["dragged-over"] as string]: dragoverNodeId === nodeId,
      })}
      aria-label={nodesById.get(nodeId)!.name + (foundStatus === "found" ? " matched" : "")}
      aria-selected={nodeId === selectedNodeId}
      draggable={!loading}
      onDragStart={(event) => startDragging(event, nodeId)}
      onDragOver={(event) => startDragover(event, nodeId)}
      onDragEnd={stopDragging}
      onDrop={(event) => stopDragover(event, nodeId)}
    >
      {children} {foundStatus === "found" && <CheckIcon className={styles["found-icon"]} />}
    </Typography>
  );
};

const convertTreeToKey = (rootNode: TreeNodeData | null): string => {
  if (!rootNode) return "empty";

  const keyParts = [];
  const stack: TreeNodeData[] = [rootNode];

  while (stack.length) {
    const node = stack.pop()!;

    keyParts.push(`${node.id}:${node.parentId ?? "0"}`);

    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]!);
    }
  }

  return keyParts.join(",");
};
