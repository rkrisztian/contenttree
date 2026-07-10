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
import useSWR from "swr";
import type { SWRResponse } from "swr/_internal";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import {
  type ContentRespDto,
  type CreateTreeNodeReqDTO,
  TreeApi,
  type TreeNodeRespDTO,
  type UpdateTreeNodeReqDTO,
} from "./tree-api";

export interface TreeNodeData {
  id: number;
  name: string;
  parentId: number | null;
  children: TreeNodeData[];
}

export type TreePageContextType = {
  flatNodes: SWRResponse<TreeNodeRespDTO[]>;
  rootNode: TreeNodeData | null;
  nodesById: Map<number, TreeNodeData>;
  selectedNodeId: number | null;
  expandedItems: string[];
  setExpandedItems: Dispatch<SetStateAction<TreePageContextType["expandedItems"]>>;
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

  const flatNodes = useSWR("flatNodes", treeApiRef.current.getFlatNodes);
  const builtTree = useMemo(() => buildTree(flatNodes.data), [flatNodes.data]);
  const rootNode = builtTree.root;
  const nodesById = builtTree.nodesById;
  const [hasFlatNodesInitialized, setHasFlatNodesInitialized] = useState(false);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const contentForSelectedNode = useSWR(
    selectedNodeId ? `contentForSelectedNode/${selectedNodeId}` : null,
    () => treeApiRef.current.getContentForSelectedNode(selectedNodeId!),
  );

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: rootNode is derived
  useEffect(() => {
    if (!hasFlatNodesInitialized && flatNodes.data) {
      setSelectedNodeId(rootNode?.id ?? null);
      setExpandedItems(convertToExpandedItems(nodesById));
      setHasFlatNodesInitialized(true);
    }
  }, [hasFlatNodesInitialized, flatNodes.data]);

  const [searchText, setSearchText] = useState("");
  const _foundNodes = useSWR(searchText ? ["foundNodes", searchText] : null, () =>
    treeApiRef.current.getFoundNodes(searchText),
  );
  const foundNodes = useMemo(
    () => (_foundNodes.data ? new Set(_foundNodes.data) : undefined),
    [_foundNodes.data],
  );

  const toggleSelect = (newSelectedNodeId: number | null) => {
    setSelectedNodeId((nodeId) => (nodeId === newSelectedNodeId ? null : newSelectedNodeId));
  };

  const createNode = async (node: CreateTreeNodeReqDTO) => {
    const id = await treeApiRef.current.createNode(node);
    await flatNodes.mutate();
    setExpandedItems((expandedItems) => [...expandedItems, String(id)]);
  };

  const updateSelectedNode = async (data: Omit<UpdateTreeNodeReqDTO, "id">) => {
    await treeApiRef.current.updateNode({ id: selectedNodeId!, ...data });
    await flatNodes.mutate();
    await contentForSelectedNode.mutate();
  };

  const deleteSelectedNode = async () => {
    await treeApiRef.current.deleteNode(selectedNodeId!);
    setSelectedNodeId(nodesById.get(selectedNodeId!)!.parentId);
    setExpandedItems((expandedItems) => {
      const selectedNodeIdStr = String(selectedNodeId!);
      return expandedItems.filter((id) => id !== selectedNodeIdStr);
    });
    await flatNodes.mutate();
  };

  const moveNode = async (nodeId: number, newParentId: number): Promise<void> => {
    if (
      nodeId === newParentId ||
      isRoot(nodeId) ||
      isParent(newParentId, nodeId) ||
      isDescendant(newParentId, nodeId)
    ) {
      addAndShowError({
        error: "Cannot perform operation",
        message: "The requested move operation is invalid.",
      });

      return;
    }

    await treeApiRef.current.moveNode(nodeId, newParentId);
    await flatNodes.mutate();
  };

  const isRoot = (nodeId: number): boolean => {
    return rootNode?.id === nodeId;
  };

  const isParent = (newParentId: number, nodeId: number): boolean =>
    nodesById.get(nodeId)?.parentId === newParentId;

  /** Checks if the node with ID `newParentId` is a descendant of that with `nodeId`. */
  const isDescendant = (newParentId: number, nodeId: number): boolean => {
    let currentId: number | null = newParentId;

    do {
      currentId = nodesById.get(currentId)!.parentId ?? null;

      if (currentId === nodeId) {
        return true;
      }
    } while (currentId != null);

    return false;
  };

  return (
    <TreePageContext.Provider
      value={{
        flatNodes,
        rootNode,
        nodesById,
        expandedItems,
        setExpandedItems,
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

const buildTree = (flatNodes: TreeNodeRespDTO[] = []) => {
  const nodesById = new Map(
    flatNodes.map((node) => [node.id, { ...node, children: [] } as TreeNodeData]),
  );
  let root: TreeNodeData | null = null;

  for (const node of nodesById.values()) {
    if (node.parentId == null) {
      root = node;
    } else {
      const parent = nodesById.get(node.parentId)!;
      parent.children.push(node);
    }
  }

  return { root, nodesById };
};

const convertToExpandedItems = (nodesById: Map<number, TreeNodeData>) =>
  Array.from(nodesById.keys().map((id) => String(id)));
