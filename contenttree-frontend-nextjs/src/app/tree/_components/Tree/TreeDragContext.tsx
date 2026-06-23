"use client";

import { createContext, type DragEvent, type ReactNode, useContext, useState } from "react";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";

interface TreeDragContextType {
  draggedNodeId: number | null;
  dragoverNodeId: number | null;
  startDragging: (event: DragEvent, nodeId: number) => void;
  stopDragging: () => void;
  startDragover: (event: DragEvent, nodeId: number) => void;
  stopDragover: (event: DragEvent, newParentId: number) => void;
}

const TreeDragContext = createContext<TreeDragContextType | undefined>(undefined);

export const useTreeDrag = () => {
  const context = useContext(TreeDragContext);
  if (!context) {
    throw new Error("useTreeDrag must be used within a TreeDragProvider");
  }
  return context;
};

export const TreeDragProvider = ({ children }: { children: ReactNode }) => {
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [dragoverNodeId, setDragoverNodeId] = useState<number | null>(null);
  const { moveNode } = useTreePage();

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

  return (
    <TreeDragContext.Provider
      value={{
        draggedNodeId,
        dragoverNodeId,
        startDragging,
        stopDragging,
        startDragover,
        stopDragover,
      }}
    >
      {children}
    </TreeDragContext.Provider>
  );
};
