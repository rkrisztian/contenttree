import type { AxiosInstance, GenericAbortSignal } from "axios";
import type { RefObject } from "react";
import type {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TreeNodeRespDTO,
  UpdateTreeNodeReqDTO,
} from "@/app/_lib/api/types";

export const TREE_API_BASE_PATH = "/api/tree";

export class TreeApi {
  constructor(private readonly backendApiRef: RefObject<AxiosInstance>) {}

  readonly getFlatNodes = async (signal: GenericAbortSignal) =>
    (await this.getBackendApi().get<TreeNodeRespDTO[]>(TREE_API_BASE_PATH, { signal })).data;

  readonly getContentForSelectedNode = async (selectedNodeId: number, signal: GenericAbortSignal) =>
    (
      await this.getBackendApi().get<ContentRespDto>(
        `${TREE_API_BASE_PATH}/content/${encodeURIComponent(selectedNodeId)}`,
        { signal },
      )
    ).data;

  readonly getFoundNodes = async (searchText: string, signal: GenericAbortSignal) =>
    searchText
      ? (
          await this.getBackendApi().get<number[]>(`${TREE_API_BASE_PATH}/search`, {
            params: { text: searchText },
            signal,
          })
        ).data
      : [];

  readonly createNode = async (node: CreateTreeNodeReqDTO, signal: GenericAbortSignal) =>
    this.getBackendApi().put(TREE_API_BASE_PATH, node, { signal });

  readonly updateNode = async (node: UpdateTreeNodeReqDTO, signal: GenericAbortSignal) =>
    this.getBackendApi().post(TREE_API_BASE_PATH, node, { signal });

  readonly deleteNode = async (id: number, signal: GenericAbortSignal) =>
    this.getBackendApi().delete(`${TREE_API_BASE_PATH}/${encodeURIComponent(id)}`, { signal });

  readonly moveNode = async (nodeId: number, newParentId: number, signal: GenericAbortSignal) =>
    this.getBackendApi().post(`${TREE_API_BASE_PATH}/move`, null, {
      params: { nodeId, newParentId },
      signal,
    });

  private readonly getBackendApi = () => this.backendApiRef.current;
}
