"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SWRResponse } from "swr/_internal";
import { useAbortContext, useSwrWithAbort } from "@/app/_lib/AbortContext";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import {
  type ContentRespDto,
  type CreateTreeNodeReqDTO,
  TreeApi,
  type TreeNodeRespDTO,
  type UpdateTreeNodeReqDTO,
} from "./tree-api";
import { TreeData } from "./tree-data";
import { TreeExpansionState } from "./tree-expansion-state";

export type TreePageContextType = {
  rawNodes: SWRResponse<TreeNodeRespDTO[]>;
  treeData: TreeData;
  expansionState: TreeExpansionState;
  setExpansionState: Dispatch<SetStateAction<TreePageContextType["expansionState"]>>;
  selectedNodeId: number | null;
  toggleSelect: (newSelectedNodeId: number | null) => void;
  contentForSelectedNode: SWRResponse<ContentRespDto>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<TreePageContextType["searchText"]>>;
  foundNodes: Set<number> | undefined;
  createNode: (node: CreateTreeNodeReqDTO) => Promise<void>;
  updateSelectedNode: (data: Omit<UpdateTreeNodeReqDTO, "id">) => Promise<void>;
  deleteSelectedNode: () => Promise<void>;
  moveNode: (nodeId: number, newParentId: number) => Promise<void>;
};

export const TreePageContext = createContext<TreePageContextType | undefined>(undefined);

export const TreePageContextProvider = ({ children }: { children: ReactNode }) => {
  const { backendApiRef, addAndShowError } = useBackendApi();
  const treeApiRef = useRef(new TreeApi(backendApiRef));
  const { withAbort } = useAbortContext();

  const rawNodes = useSwrWithAbort("flatNodes", (signal) =>
    treeApiRef.current.getFlatNodes(signal),
  );
  const treeData = useMemo(() => new TreeData(rawNodes.data), [rawNodes.data]);
  const hasRawNodesInitialized = useRef(false);

  const [expansionState, setExpansionState] = useState(() => new TreeExpansionState());

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const contentForSelectedNode = useSwrWithAbort(
    selectedNodeId ? ["contentForSelectedNode", selectedNodeId] : null,
    (signal) => treeApiRef.current.getContentForSelectedNode(selectedNodeId!, signal),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: treeData is derived
  useEffect(() => {
    if (!hasRawNodesInitialized.current && rawNodes.data) {
      setSelectedNodeId(treeData.rootNodeId ?? null);
      hasRawNodesInitialized.current = true;
    }
  }, [rawNodes.data]);

  const [searchText, setSearchText] = useState("");
  const _foundNodes = useSwrWithAbort(searchText ? ["foundNodes", searchText] : null, (signal) =>
    treeApiRef.current.getFoundNodes(searchText, signal),
  );
  const foundNodes = useMemo(
    () => (_foundNodes.data ? new Set(_foundNodes.data) : undefined),
    [_foundNodes.data],
  );

  const toggleSelect = (newSelectedNodeId: number | null) => {
    setSelectedNodeId((nodeId) => (nodeId === newSelectedNodeId ? null : newSelectedNodeId));
  };

  const createNode = async (node: CreateTreeNodeReqDTO) => {
    await withAbort("createNode", (signal) => treeApiRef.current.createNode(node, signal));
    await rawNodes.mutate();
  };

  const updateSelectedNode = async (data: Omit<UpdateTreeNodeReqDTO, "id">) => {
    await withAbort("updateNode", (signal) =>
      treeApiRef.current.updateNode({ id: selectedNodeId!, ...data }, signal),
    );
    await rawNodes.mutate();
    await contentForSelectedNode.mutate();
  };

  const deleteSelectedNode = async () => {
    await withAbort("deleteNode", (signal) =>
      treeApiRef.current.deleteNode(selectedNodeId!, signal),
    );
    setSelectedNodeId(treeData.getNodebyId(selectedNodeId!).parentId);
    setExpansionState((prev) => {
      const next = prev.clone();
      next.sync(treeData);
      return next;
    });
    await rawNodes.mutate();
  };

  const moveNode = async (nodeId: number, newParentId: number): Promise<void> => {
    if (!treeData.isValidMove(nodeId, newParentId)) {
      addAndShowError({
        error: "Cannot perform operation",
        message: "The requested move operation is invalid.",
      });

      return;
    }

    await withAbort("moveNode", (signal) =>
      treeApiRef.current.moveNode(nodeId, newParentId, signal),
    );
    await rawNodes.mutate();
  };

  return (
    <TreePageContext.Provider
      value={{
        rawNodes,
        treeData,
        expansionState,
        setExpansionState,
        selectedNodeId,
        toggleSelect,
        contentForSelectedNode,
        searchText,
        setSearchText,
        foundNodes,
        createNode,
        updateSelectedNode,
        deleteSelectedNode,
        moveNode,
      }}
    >
      {children}
    </TreePageContext.Provider>
  );
};

export const useTreePage = () => {
  const context = useContext(TreePageContext);
  if (!context) throw new Error("useTreePage must be used within a TreePageContextProvider");
  return context;
};
